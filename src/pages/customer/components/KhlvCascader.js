import React, { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Cascader } from 'antd';
import * as service from '../../../services/customer';

const MAX_LEVEL = 2;

function getCascaderValueFromProps (props) {
  const { value = "", labelInValue = false } = props;
  if (labelInValue) {
    const { codePath } = value;
    if (typeof codePath !== 'string' || codePath.length === 0) {
      return [];
    }
    return codePath.split("/");
  }
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value !== 'string' || value.length === 0) {
    return [];
  }
  return value.split("/");
}

class RegionCascader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cascaderValue: [],
      options: [],
    };
  }

  static getDerivedStateFromProps (nextProps) {
    if ('value' in nextProps) {
      const value = getCascaderValueFromProps(nextProps);
      return { cascaderValue: value };
    }
    return null;
  }

  componentDidMount () {
    const maxLevel = this.getMaxLevel();
    const { cascaderValue: value } = this.state;
    setTimeout(() => {
      const val = this.props.value.codePath ? this.props.value.codePath.split('/') : [];
      this.genPromiseToGetOptionsByCodePath(val.join("/")).then(result => {
        val.pop();
        const filteredValue = ['',...val].filter((item, index) => index < maxLevel);
        let flag = true;
        const allOptions = [];
        let parentOption;
        filteredValue.forEach((parentCode, index) => {
          if (flag) {
            const data = result[parentCode] || [];
            if (data.length === 0) {
              flag = false;
            } else {
              const options = data.map(d => ({
                ...d,
                label: d.name,
                value: d.code,
                isLeaf: d.level === maxLevel
              }));
              if (index === 0) {
                allOptions.push(...options);
              } else if (index === 1) {
                const [filteredOption] = allOptions.filter(o => o.value === parentCode);
                parentOption = filteredOption;
                if (parentOption) {
                  parentOption.children = options;
                }
              } else if (parentOption) {
                const [filteredOption] = parentOption.children.filter(o => o.value === parentCode);
                parentOption = filteredOption;
                parentOption.children = options;
              }
            }

          }
        });
        this.setState({ options: allOptions });
      });
    }, 500)

  }

  formatValue = (codePath, namePath) => {
    const { labelInValue = false } = this.props;
    if (labelInValue) {
      return {
        codePath,
        namePath
      }
    }
    const { value = "" } = this.props;
    if (Array.isArray(value)) {
      return codePath ? codePath.split("/") : [];
    }
    return codePath;
  };

  getMaxLevel = () => {
    const { maxLevel } = this.props;
    if (typeof maxLevel !== 'number' || isNaN(maxLevel)) {
      return MAX_LEVEL;
    }
    return maxLevel > 0 && maxLevel <= MAX_LEVEL ? maxLevel : MAX_LEVEL;
  };

  genPromiseToGetOptionsByCodePath = (path) => {
    return service.getInitialValue({ path }).then((result) => {
      const { success, data } = result;
      if (success && data) {
        return data;
      }
      return {};
    });
  };

  loadData = selectedOptions => {
    const maxLevel = this.getMaxLevel();
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    service.getKhlbOptions({
      'activated.equals': 'T',
      'enabled.equals': 'T',
      'parentCode.equals': targetOption.value,
      'level.equals': targetOption.level + 1
    }).then(({ success, data }) => {
      targetOption.loading = false;
      if (success && !_.isEmpty(data)) {
        data.map(d => {
          d.label = d.name;
          d.value = d.code;
          d.isLeaf = d.level === maxLevel;
          return d;
        });
        targetOption.children = data;
        this.setState({
          options: [...this.state.options],
        });
      }
    });
  };

  onChange = (value, selectedOptions) => {
    const { onChange } = this.props;
    let rtn;
    if (!selectedOptions || selectedOptions.length === 0) {
      rtn = this.formatValue();
    } else {
      const { path: codePath, fullName: namePath } = selectedOptions[selectedOptions.length - 1];
      rtn = this.formatValue(codePath, namePath);
    }
    onChange && onChange(rtn);
  };

  render () {
    const { cascaderValue, options = [] } = this.state;
    const { value, maxLevel, labelInValue, ...cascaderProps } = this.props;
    return (
      <Cascader
        placeholder="请选择"
        changeOnSelect
        style={{ width: '100%' }}
        getPopupContainer={trigger => trigger.parentNode}
        {...cascaderProps}
        loadData={this.loadData}
        onChange={this.onChange}
        value={cascaderValue}
        options={options}
      />
    );
  }
}

RegionCascader.propTypes = {
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      codePath: PropTypes.string,
      namePath: PropTypes.string
    }),
    PropTypes.arrayOf(PropTypes.string)
  ]),
  maxLevel: PropTypes.oneOf([1, 2]),
};

RegionCascader.defaultProps = {
  maxLevel: 2
};

export default RegionCascader;

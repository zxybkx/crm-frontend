import {Avatar} from 'antd';

/**
 * @description 文字转三位16进制颜色码
 * @author ZhouNan
 * @date 2019-05-27
 * @param {*} text 中文文字
 * @returns 三位16进制颜色码
 */
function tranHex(text) {
  let str = '';
  for (let i = 0; i < text.length; i += 1) {
    str += parseInt(text[i].charCodeAt(0), 10).toString(16);
  }
  return str.slice(1, 4);
}

function getColorFromText(text) {
  const filledText = text.padStart(3, [...text][0]);
  let colorHex = '';
  [...filledText].forEach(item => {
    const hex = tranHex(item).slice(0, 2);
    colorHex += hex;
  });
  return colorHex;
}

/**
 * @description 判断是否是浅色颜色
 * @author ZhouNan
 * @date 2019-05-27
 * @param {*} r RGB中R的数值
 * @param {*} g RGB中G的数值
 * @param {*} b RGB中B的数值
 * @returns true代表是浅色,false代表是深色
 */
function isLightColor(r, g, b) {
  if (r * 0.299 + g * 0.587 + b * 0.114 >= 192) {
    return true;
  }
  return false;
}

/**
 * @description 颜色加深
 * @author ZhouNan
 * @date 2019-05-28
 * @param {*} [r, g, b] RGB数组
 * @returns RGB数组
 */
function colorBurnByYUV([r, g, b]) {
  const y = r * 0.299 + g * 0.587 + b * 0.114; // 计算颜色的明亮度(YUV)
  if (y < 192) {
    return [r, g, b];
  }
  const offset = y - 192;
  return [r - offset, g - offset, b - offset];
}

/**
 * @description 根据YIQ公式判断该背景色下的文本颜色
 * @author ZhouNan
 * @date 2019-05-28
 * @param {*} [r, g, b] 背景色RGB数组
 * @returns 文本颜色
 */
function getTextColorByYIQ([r, g, b]) {
  const yiq = r * 0.299 + g * 0.587 + b * 0.114; // 计算颜色的明亮度(YIQ)
  return yiq >= 128 ? 'black' : 'white';
}

/**
 * @description 16进制颜色码转RGB
 * @author ZhouNan
 * @date 2019-05-27
 * @param {*} hex 六位16进制颜色码
 * @returns RGB数组
 */
function hexToRgb(hex) {
  const colorHex = hex.toLowerCase();
  const rgbArr = [];
  for (let i = 0; i < 6; i += 2) {
    rgbArr.push(parseInt(`${colorHex.slice(i, i + 2)}`, 16));
  }
  return rgbArr;
}

export default ({text, lastNameOnly = false, style, ...otherProps}) => {
  let _style = {};
  if (text && text.length > 0) {
    /* let colorHex = '';
     [...text].slice(-2).forEach(item => {
     const hex = tranHex(item);
     colorHex = hex + colorHex;
     }); */
    // const [r, g, b] = colorBurnByYUV(hexToRgb(colorHex));
    // _style = { backgroundColor: `rgb(${r}, ${g}, ${b})` };
    const colorHex = getColorFromText(text);
    const textColor = getTextColorByYIQ(hexToRgb(colorHex));
    _style = {backgroundColor: `#${colorHex}`, color: `${textColor}`};
  }

  return (
    <Avatar style={{cursor: 'default', ..._style, ...style}} {...otherProps}>
      {lastNameOnly ? [...text][0] : text}
    </Avatar>
  );
};

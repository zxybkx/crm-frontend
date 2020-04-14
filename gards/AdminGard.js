import Authorized from 'casic-common/src/utils/Authorized';
import { Redirect } from 'umi';

export default (props) => {
  return (
    <Authorized authority={["ROLE_000-0001", "ROLE_000-0002"]}
                noMatch={<Redirect to='/403'/>}>
      { props.children }
    </Authorized>
  );
}

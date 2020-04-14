import Authorized from 'casic-common/src/utils/Authorized';
import { Redirect } from 'umi';

export default (props) => {
  return (
    <Authorized authority={["ROLE_000-0004"]}
                noMatch={<Redirect to='/passport/sign-in'/>}>
      { props.children }
    </Authorized>
  );
}

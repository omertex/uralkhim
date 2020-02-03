import React from "react";
import {AuthContext} from "../../../AuthContext/AuthContext";
import {Redirect} from "react-router-dom";
import {connect} from 'react-redux';

const Logout = ({dispatch}) => {
  const authContext = React.useContext(AuthContext);
  React.useEffect(() => {
    sessionStorage.removeItem('accessToken');
    dispatch({type: 'LOGOUT'});
    }, []
  );

  return (
    <Redirect to={{pathname: '/login'}} />
  )
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Logout);

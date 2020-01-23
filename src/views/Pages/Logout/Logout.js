import React from "react";
import {AuthContext} from "../../../AuthContext/AuthContext";
import {Redirect} from "react-router-dom";

const Logout = () => {
  const authContext = React.useContext(AuthContext);
  React.useEffect(() => {
      sessionStorage.removeItem('accessToken');
      authContext.setIsAuth(false);
    }, []
  );

  return (
    <Redirect to={{pathname: "/login"}} />
  )
}

export default Logout;

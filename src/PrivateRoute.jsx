import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useGlobalState } from "./services";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [{ isAuthenticated}] = useGlobalState();
  return  isAuthenticated  ? (
    <Route {...rest} />
  ) : (
    <Route
      render={props => (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      )}
    />
  );
};
export default PrivateRoute;

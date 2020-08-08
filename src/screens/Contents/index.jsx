import React, { Suspense, lazy } from "react";
import { Switch, Router, Redirect } from "react-router-dom";
import PrivateRoute from "../../PrivateRoute";
const ContentTypes = lazy(() => import("./ContentTypes"));
const DataTable = lazy(() => import("./Table"));

const Contents = ({ match }) => {
  return (
    <Suspense fallback={<div />}>
      <Switch>
        <PrivateRoute
          exact
          path={match.path + "/:id"}
          render={(props) => <DataTable {...props} />}
        />
        <PrivateRoute
          exact
          path={match.path}
          render={(props) => <ContentTypes {...props} />}
        />
      </Switch>
    </Suspense>
  );
};
export default Contents;

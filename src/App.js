import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./styles/app.scss";
import "animate.css";
//
import StateProvider from "./services/stateManager/stateProvider";
import Notifies from "./components/Notifies";
//
import PrivateRoute from "./PrivateRoute";
//
import withResolver from "./hoc/withResolver";
import MainPageComponent from "./screens/MainPage";
const Login = lazy(() => import("./screens/Login"));
const Signup = lazy(() => import("./screens/Signup"));
const ForgotPassword = lazy(() => import("./screens/ForgotPassword"));
const ConfirmEmail = lazy(() => import("./screens/ConfirmEmail"));
const UpsertContent = lazy(() => import("./screens/UpsertContent"));
const UpdateFile = lazy(() => import("./screens/upsertFile"));
const ContentViewByLink = lazy(() => import("./screens/ViewContent"));

const MainPage = withResolver(MainPageComponent);
const AddAsset = withResolver(UpdateFile);
const EditAsset = withResolver(UpdateFile);
const ViewAsset = withResolver(UpdateFile);
const AddContent = withResolver(UpsertContent);
const EditContent = withResolver(UpsertContent);
const ViewContent = withResolver(UpsertContent);
console.log("============");
console.log("NODE ENVIRONMENT: ", process.env.NODE_ENV);
console.log("============");

const App = () => {
  return (
    <StateProvider>
      <BrowserRouter>
        <Suspense fallback={<div />}>
          <Switch>
            <Route
              exact
              key="login"
              path="/app/login"
              render={(props) => <Login {...props} />}
            />
            <Route
              key="signup"
              path="/app/signup"
              render={(props) => <Signup {...props} />}
            />
            <Route
              key="forgotPassword"
              path="/app/forgotPassword"
              render={(props) => <ForgotPassword {...props} />}
            />
            <Route
              key="confirmEmail"
              path="/app/confirmEmail/:token"
              render={(props) => <ConfirmEmail {...props} />}
            />
            <Route
              key="contentViewByLink"
              path="/app/contentView/:link"
              render={(props) => <ContentViewByLink {...props} />}
            />
            <PrivateRoute
              key="panel"
              path="/app/panel"
              render={(props) => <MainPage {...props} />}
            />
            <PrivateRoute
              key="addAsset"
              path="/app/asset/new"
              render={(props) => <AddAsset {...props} />}
            />
            <PrivateRoute
              key="editAsset"
              path="/app/asset/edit/:id"
              render={(props) => <EditAsset {...props} />}
            />
            <PrivateRoute
              key="viewAsset"
              path="/app/asset/view/:id"
              render={(props) => <ViewAsset {...props} />}
            />
            <PrivateRoute
              key="addContent"
              path="/app/contents/new/:id?"
              render={(props) => <AddContent {...props} />}
            />
            <PrivateRoute
              key="editContent"
              path="/app/contents/edit/:id"
              render={(props) => <EditContent {...props} />}
            />
            <PrivateRoute
              key="viewContent"
              path="/app/contents/view/:id"
              render={(props) => <ViewContent {...props} />}
            />
            <Redirect from="/" to="/app/panel/home" exact />
          </Switch>
        </Suspense>
      </BrowserRouter>
      <Notifies />
    </StateProvider>
  );
};

export default App;

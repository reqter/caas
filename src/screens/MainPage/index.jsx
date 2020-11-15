import React, { Suspense, lazy } from "react";
import { Switch, Redirect } from "react-router-dom";
import useGlobalState from "services/stateManager";
import SideBar from "./components/SideBar";
import Header from "components/Header";
import RouterLocation from "components/RouterLocation";

import "./styles.scss";
//
import PrivateRoute from "../../PrivateRoute";
const Home = lazy(() => import("../Home"));
const ContentType = lazy(() => import("../ContentType"));
const Contents = lazy(() => import("../Contents"));
const Profile = lazy(() => import("../Profile"));
const Settings = lazy(() => import("../Settings"));
const Assets = lazy(() => import("../Assets"));
//
const MainPage = (props) => {
  const [{ userInfo }] = useGlobalState();

  return (
    <div className="page-wrapper">
      <RouterLocation />
      <Header />
      <main className="main">
        {userInfo &&
          (userInfo.emailConfirmed === undefined ||
            userInfo.emailConfirmed === false) && (
            <div className="main__confirmationBox">
              {`Please check your email (${userInfo.username}) to verify that you own
          this address.`}
            </div>
          )}
        <Suspense fallback={<div />}>
          <Switch>
            <PrivateRoute
              key="home"
              path="/app/panel/home"
              render={(props) => <Home {...props} />}
            />
            <PrivateRoute
              key="contentType"
              path="/app/panel/contentType"
              render={(props) => <ContentType {...props} />}
            />
            <PrivateRoute
              key="contents"
              path="/app/panel/contents"
              render={(props) => <Contents {...props} />}
            />
            <PrivateRoute
              key="profile"
              path="/app/panel/profile"
              render={(props) => <Profile {...props} />}
            />
            <PrivateRoute
              key="assets"
              path="/app/panel/assets"
              render={(props) => <Assets {...props} />}
            />
            <PrivateRoute
              key="settings"
              path="/app/panel/settings"
              render={(props) => <Settings {...props} />}
            />
          </Switch>
        </Suspense>
      </main>
    </div>
  );
};
export default MainPage;

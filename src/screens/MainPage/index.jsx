import React, { Suspense, lazy } from "react";
import { Switch } from "react-router-dom";
import SideBar from "./components/SideBar";
import Header from "components/Header";
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
const MainPage = props => {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="main">
        <Suspense fallback={<div />}>
          <Switch>
            <PrivateRoute
              key="home"
              path="/panel/home"
              render={props => <Home {...props} />}
            />
            <PrivateRoute
              key="contentType"
              path="/panel/contentType"
              render={props => <ContentType {...props} />}
            />
            <PrivateRoute
              key="contents"
              path="/panel/contents"
              render={props => <Contents {...props} />}
            />
            <PrivateRoute
              key="profile"
              path="/panel/profile"
              render={props => <Profile {...props} />}
            />
            <PrivateRoute
              key="assets"
              path="/panel/assets"
              render={props => <Assets {...props} />}
            />
            <PrivateRoute
              key="settings"
              path="/panel/settings"
              render={props => <Settings {...props} />}
            />
          </Switch>
        </Suspense>
      </main>
    </div>
  );
};
export default MainPage;

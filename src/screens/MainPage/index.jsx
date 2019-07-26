import React from "react";
import SideBar from "./components/SideBar";
import "./styles.scss";
//
import PrivateRoute from "../../PrivateRoute";
import Home from "../Home";
import ContentType from "../ContentType";
import Contents from "../Contents";
import Profile from "../Profile";
import Settings from "../Settings";
import Assets from "../Assets";
//
const MainPage = props => {
  return (
    <div className="page-wrapper">
      <SideBar links={[]} />
      <main className="main">
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
      </main>
    </div>
  );
};
export default MainPage;

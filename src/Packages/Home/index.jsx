import React from "react";
import SideBar from "./components/SideBar";
import "./styles.scss";

const Home = props => {
  return (
    <div className="page-wrapper">
      <SideBar links={[]} />
      <main className="main">
        {props.routes}
      </main>
    </div>
  );
};
export default Home;

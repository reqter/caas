import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "animate.css";
//
import StateProvider from "./services/stateManager/stateProvider";
import "./styles/app.scss";
import Notifies from "./components/Notifies";
//
import PrivateRoute from "./PrivateRoute";
//
import withResolver from "./hoc/withResolver";

import Login from "./screens/Login";
import Signup from "./screens/Signup";
import ForgotPassword from "./screens/ForgotPassword";
import MainPageComponent from "./screens/MainPage";
import UpsertContent from "./screens/UpsertContent";
import UpdateFile from "./screens/upsertFile";

const MainPage = withResolver(MainPageComponent);
const AddAsset = withResolver(UpdateFile);
const EditAsset = withResolver(UpdateFile);
const ViewAsset = withResolver(UpdateFile);
const AddContent = withResolver(UpsertContent);
const EditContent = withResolver(UpsertContent);
const ViewContent = withResolver(UpsertContent);
//
const App = () => {
  return (
    <StateProvider>
      <BrowserRouter>
        <div>
          <Switch>
            <Route
              exact
              key="login"
              path="/login"
              render={props => <Login {...props} />}
            />
            <Route
              key="signup"
              path="/signup"
              render={props => <Signup {...props} />}
            />
            <Route
              key="forgotPassword"
              path="/forgotPassword"
              render={props => <ForgotPassword {...props} />}
            />
            <PrivateRoute
              key="panel"
              path="/panel"
              render={props => <MainPage {...props} />}
            />
            <PrivateRoute
              key="addAsset"
              path="/asset/new"
              render={props => <AddAsset {...props} />}
            />
            <PrivateRoute
              key="editAsset"
              path="/asset/edit/:id"
              render={props => <EditAsset {...props} />}
            />
            <PrivateRoute
              key="viewAsset"
              path="/asset/view/:id"
              render={props => <ViewAsset {...props} />}
            />
            <PrivateRoute
              key="addContent"
              path="/contents/new"
              render={props => <AddContent {...props} />}
            />
            <PrivateRoute
              key="editContent"
              path="/contents/edit/:id"
              render={props => <EditContent {...props} />}
            />
            <PrivateRoute
              key="viewContent"
              path="/contents/view/:id"
              render={props => <ViewContent {...props} />}
            />

            {/* <Route to="/not-found" render={props=><NoutFound/>}/> */}
            {/* اگه دقیقا / رو زد برو لاگین */}
            <Redirect from="/" to="/panel/home" exact />
            {/* اگه هیچی نزد یا چرت و پرت زد برو اون روتی که نات فاند هست */}
            {/* <Redirect to="/not-found"/> */}
          </Switch>
        </div>
      </BrowserRouter>
      <Notifies />
    </StateProvider>
  );
};

export default App;

// function makeData(len = 10) {
//   return range(len).map(d => {
//     return {
//       ...newProduct(),
//       children: range(10).map(newProduct)
//     };
//   });
// }

// function newProduct() {
//   return {
//     thumbnail:
//       "https://myresources1195.blob.core.windows.net/images/banana.jpg",
//     name: "موز ممتاز",
//     description: "محصولات وارداتی از افریقا",
//     price: "2500 $",
//     brand: "Banana"
//   };
// }
// function range(len) {
//   const arr = [];
//   for (let i = 0; i < len; i++) {
//     arr.push(i);
//   }
//   return arr;
// }
//   function createTree(list) {
//     var map = {},
//       node,
//       roots = [],
//       i;
//     for (i = 0; i < list.length; i += 1) {
//       map[list[i].id] = i; // initialize the map
//       list[i].children = []; // initis
//     }
//     for (i = 0; i < list.length; i += 1) {
//       node = list[i];
//       if (node.parentId) {
//         // if you have dangling branches check that map[node.parentId] exists
//         list[map[node.parentId]].children.push(node);
//       } else {
//         roots.push(node);
//       }
//     }
//     return roots;
//   }

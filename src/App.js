import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "animate.css";
//
import StateProvider from "./services/stateManager/stateProvider";
import "./styles/app.scss";
import Notifies from "./components/Notifies";
//
import Routes from "./routes";
import PrivateRoute from "./PrivateRoute";
//
import withResolver from "./hoc/withResolver";

import Login from "./Packages/Login";
import Signup from "./Packages/Signup";
import ForgotPassword from "./Packages/ForgotPassword";
import HomeComponent from "./Packages/Home";
import ContentType from "./Packages/ContentType";
import Contents from "./Packages/Contents";
import UpsertContent from "./Packages/UpsertContent";
import Assets from "./Packages/Assets";
import UpdateFile from "./Packages/upsertFile";
import Profile from "./Packages/Profile";
import Settings from "./Packages/Settings";

const Home = withResolver(HomeComponent);
const AddAsset = withResolver(UpdateFile);
const EditAsset = withResolver(UpdateFile);
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
            {Routes.map(route => {
              if (route.isPublic) {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    render={props => {
                      const Component = route.component;
                      let nestedRoutes;
                      if (route.routes) {
                        nestedRoutes = (
                          <>
                            {route.routes.map(nestedRoute => (
                              <Route
                                exact
                                key={nestedRoute.path}
                                path={nestedRoute.path}
                                render={props => {
                                  const NestedComponent = nestedRoute.component;
                                  const p = {
                                    ...props,
                                    component: nestedRoute
                                  };
                                  return <NestedComponent {...p} />;
                                }}
                              />
                            ))}
                          </>
                        );
                      }
                      return <Component {...props} routes={nestedRoutes} />;
                    }}
                  />
                );
              } else {
                return (
                  <PrivateRoute
                    key={route.path}
                    path={route.path}
                    render={props => {
                      const Component = route.component;
                      let nestedRoutes;
                      if (route.routes) {
                        nestedRoutes = (
                          <>
                            {route.routes.map(nestedRoute => (
                              <Route
                                exact
                                key={nestedRoute.path}
                                path={nestedRoute.path}
                                render={props => {
                                  const NestedComponent = nestedRoute.component;

                                  const p = {
                                    ...props,
                                    component: nestedRoute
                                  };
                                  return <NestedComponent {...p} />;
                                }}
                              />
                            ))}
                          </>
                        );
                      }

                      return <Component {...props} routes={nestedRoutes} />;
                    }}
                  />
                );
              }
            })}
            {/* <Route to="/not-found" render={props=><NoutFound/>}/> */}
            {/* اگه دقیقا / رو زد برو لاگین */}
            <Redirect from="/" to="/panel" exact />
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

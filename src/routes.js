import { languageManager } from "./services";

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

function translate(key) {
  return languageManager.translate(key);
}

const routes = [
  {
    path: "/login",
    component: Login,
    isPublic: true
  },
  {
    path: "/signup",
    component: Signup,
    isPublic: true
  },
  {
    path: "/forgotPassword",
    component: ForgotPassword,
    isPublic: true
  },
  {
    path: "/panel",
    component: Home,
    isPublic: false,
    isExact: true,
    routes: [
      {
        name: translate("HOME_SIDE_NAV_CONTENT_TYPE"),
        icon: "item-type",
        path: "/panel/contentType",
        desc: translate("HOME_SIDE_NAV_CONTENT_TYPE_DEC"),
        component: ContentType,
        isPublic: false
      },
      {
        name: translate("HOME_SIDE_NAV_PRODUCTS"),
        icon: "product",
        path: "/panel/contents",
        desc: translate("HOME_SIDE_NAV_PRODUCTS_DESC"),
        component: Contents,
        isPublic: false
      },
      {
        name: translate("HOME_SIDE_NAV_ASSETS_MANAGER"),
        icon: "images",
        desc: translate("HOME_SIDE_NAV_ASSETS_MANAGER_DESC"),
        path: "/panel/assets",
        component: Assets,
        isPublic: false
      },
      {
        name: translate("HOME_SIDE_NAV_PROFILE"),
        icon: "user",
        desc: translate("HOME_SIDE_NAV_PROFILE_DESC"),
        path: "/panel/profile",
        component: Profile,
        isPublic: false
      },
      {
        name: translate("HOME_SIDE_NAV_SETTINGS"),
        icon: "cog",
        desc: translate("HOME_SIDE_NAV_SETTINGS_DESC"),
        path: "/panel/settings",
        component: Settings,
        isPublic: false
      }
    ]
  },
  {
    path: "/contents/new",
    component: AddContent,
    isPublic: false
  },
  {
    path: "/contents/edit/:id",
    component: EditContent,
    isPublic: false
  },
  {
    path: "/contents/view/:id",
    component: ViewContent,
    isPublic: false
  },
  {
    path: "/asset/new",
    component: AddAsset,
    isPublic: false
  },
  {
    path: "/asset/edit/:id",
    component: EditAsset,
    isPublic: true
  },
  {
    path: "/asset/view/:id",
    component: EditAsset,
    isPublic: true
  }
];
export default routes;

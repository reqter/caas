import { languageManager } from "./services";

import withResolver from "./hoc/withResolver";

import Login from "./screens/Login";
import Signup from "./screens/Signup";
import ForgotPassword from "./screens/ForgotPassword";
import HomeComponent from "./screens/MainPage";
import ContentType from "./screens/ContentType";
import Contents from "./screens/Contents";
import UpsertContent from "./screens/UpsertContent";
import Assets from "./screens/Assets";
import UpdateFile from "./screens/upsertFile";
import Profile from "./screens/Profile";
import Settings from "./screens/Settings";

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

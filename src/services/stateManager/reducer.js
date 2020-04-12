import storageManager from "./../storageManager"

const token = storageManager.getItem("@caaser-token");
export const initialState = {
  isAuthenticated: token ? true : false,
  spaceInfo: undefined,
  userInfo: undefined,
  contentTypes: [],
  fields: [],
  contents: [],
  requests: [],
  assets: [],
  status: [
    {
      id: "0",
      name: "draft",
      icon: "icon-draft",
    },
    {
      id: "1",
      name: "archived",
      icon: "icon-archive",
    },
    {
      id: "2",
      name: "changed",
      icon: "icon-refresh",
    },
    {
      id: "3",
      name: "published",
      icon: "icon-publish",
    },
  ],
  notifies: [],
  editingLocale: null,
  sysLocales: [
    {
      name: "en",
      title: "English (United State) (en-US)",
    },
    {
      name: "fa",
      title: "فارسی (ایران) (fa)",
    },
    {
      name: "de",
      title: "German (Germany) (de-DE)",
    },
    {
      name: "sv",
      title: "Swedish (Sweden) (sw-SV)",
    },
  ],
  apiKeys: [],
  roleTypes: [
    {
      name: "admin",
      title: {
        en: "Admin",
      },
    },
    {
      name: "reader",
      title: {
        en: "Reader",
      },
    },
    {
      name: "manager",
      title: {
        en: "Manager",
      },
    },
    {
      name: "translator",
      title: {
        en: "Translator",
      },
    },
  ],
  webhooks: [],
  contentFilter: null,
  selectedContentType: null,
};
export const reducer = (state, action) => {
  switch (action.type) {
    case "LOGOUT":
      const logout = {
        ...state,
        isAuthenticated: false,
        spaceInfo: undefined,
        userInfo: undefined,
        contentTypes: [],
        fields: [],
        contents: [],
        assets: [],
        apiKeys: [],
        webhooks: [],
      };
      return logout;
    case "SET_EDITING_LOCALE":
      return {
        ...state,
        editingLocale: action.payload,
      };
    case "SET_AUTHENTICATED":
      const auth = {
        ...state,
        isAuthenticated: action.value,
      };
      return auth;
    case "SET_USERINFO":
      // if (action.value.profile && action.value.profile.avatar) {
      //   if (action.value.profile.avatar)
      //     action.value.profile.avatar =
      //       process.env.REACT_APP_DOWNLOAD_FILE_BASE_URL +
      //       action.value.profile.avatar;
      // }
      const u = {
        ...state,
        userInfo: action.value,
      };
      return u;
    case "SET_SPACEINFO":
      const s_info = {
        ...state,
        spaceInfo: action.value,
      };
      return s_info;
    case "SET_LOCALES":
      let s_l_info = { ...state.spaceInfo };
      s_l_info["locales"] = action.value;
      const s_locales = {
        ...state,
        spaceInfo: s_l_info,
      };
      return s_locales;
    case "SET_API_KEYS":
      const apiKeys = {
        ...state,
        apiKeys: action.value,
      };
      return apiKeys;
    case "ADD_API_KEY":
      let apiKeys_add = [...state.apiKeys];
      apiKeys_add.push(action.value);
      return {
        ...state,
        apiKeys: apiKeys_add,
      };
    case "DELETE_API_KEY":
      const apiKeys_delete = state.apiKeys.filter(
        (item) => item._id !== action.value._id
      );
      return {
        ...state,
        apiKeys: apiKeys_delete,
      };
    case "UPDATE_API_KEY":
      const apiKeys_up = state.apiKeys.map((item) => {
        if (item._id === action.value._id) item = action.value;
        return item;
      });
      return {
        ...state,
        apiKeys: apiKeys_up,
      };
    case "SET_WEBHOOKS":
      const webhooks = {
        ...state,
        webhooks: action.value,
      };
      return webhooks;
    case "SET_CONTENT_TYPES":
      const s = {
        ...state,
        contentTypes: action.value,
      };
      return s;
    case "ADD_CONTENT_TYPE":
      let c_add = [...state.contentTypes];
      c_add.push(action.value);
      return {
        ...state,
        contentTypes: c_add,
      };
    case "UPDATE_CONTENT_TYPE":
      const s_up = state.contentTypes.map((item) => {
        if (item._id === action.value._id) item = action.value;
        return item;
      });
      return {
        ...state,
        contentTypes: s_up,
      };
    case "DELETE_CONTENT_TYPE":
      const s_delete = state.contentTypes.filter(
        (item) => item._id !== action.value._id
      );
      return {
        ...state,
        contentTypes: s_delete,
      };
    case "SET_FIELDS":
      const f = {
        ...state,
        fields: action.value,
      };
      return f;
    case "SET_CONTENTS":
      return {
        ...state,
        contents: action.value,
      };
    case "DELETE_CONTENT":
      const content_delete = state.contents.filter(
        (item) => item._id !== action.value._id
      );
      return {
        ...state,
        contents: content_delete,
      };
    case "CHANGE_CONTENT_STATUS":
      const content_status = state.contents.map((item) => {
        if (item._id === action.value._id) item.status = action.value.status;
        return item;
      });

      return {
        ...state,
        contents: content_status,
      };
    case "SET_ASSETS":
      return {
        ...state,
        assets: action.value,
      };
    case "DELETE_ASSET":
      const assets_delete = state.assets.filter(
        (item) => item._id !== action.value._id
      );
      return {
        ...state,
        assets: assets_delete,
      };
    case "ARCHIVE_ASSET":
      const assets_archive = state.assets.map((item) => {
        if (item._id === action.value._id) item.status = action.value.status;
        return item;
      });

      return {
        ...state,
        assets: assets_archive,
      };
    case "UN_ARCHIVE_ASSET":
      const assets_unarchive = state.assets.map((item) => {
        if (item._id === action.value._id) item.status = action.value.status;
        return item;
      });

      return {
        ...state,
        assets: assets_unarchive,
      };
    case "PUBLISH_ASSET":
      const assets_publish = state.assets.map((item) => {
        if (item._id === action.value._id) item.status = action.value.status;
        return item;
      });

      return {
        ...state,
        assets: assets_publish,
      };
    case "UN_PUBLISH_ASSET":
      const assets_unpublish = state.assets.map((item) => {
        if (item._id === action.value._id) item.status = action.value.status;
        return item;
      });

      return {
        ...state,
        assets: assets_unpublish,
      };
    case "ADD_NOTIFY":
      let newItem = { ...action.value };
      newItem.id = Math.random();
      let items_n = [...state.notifies];
      items_n.unshift(newItem);
      return {
        ...state,
        notifies: items_n,
      };
    case "REMOVE_NOTIFY":
      const items = state.notifies.filter(
        (item) => item.id !== action.value.id
      );
      return {
        ...state,
        notifies: items,
      };
    case "SET_CONTENT_PAGE_STATUS":
      return {
        ...state,
        contentPage: action.value,
      };
    case "SAVE_CONTENT_TYPE":
      return {
        ...state,
        selectedContentType: action.payload,
      };
    case "SAVE_CONTENT_FILTER":
      return {
        ...state,
        contentFilter: action.payload,
      };
    default:
      return state;
  }
};

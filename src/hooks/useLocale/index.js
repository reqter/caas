import { useGlobalState } from "services";
const dataDefaultLang = process.env.REACT_APP_DATA_DEFAULT_LANG || "fa";
//
const useLocale = () => {
  const [{ spaceInfo, editingLocale }, dispatch] = useGlobalState();
  function getCurrentLocale() {
    const { locales } = spaceInfo;

    if (!locales || locales.length === 0) return dataDefaultLang;

    if (editingLocale) {
      const d = locales.find(item => item.locale === editingLocale);
      if (d) return editingLocale;
      else {
        const d = locales.find(item => item.default === true);
        if (d) {
          _setEditingLocale(d.locale);
          return d.locale;
        } else return dataDefaultLang;
      }
    } else {
      const d = locales.find(item => item.default === true);
      if (d) {
        _setEditingLocale(d.locale);
        return d.locale;
      } else return dataDefaultLang;
    }
  }
  function getLocales() {
    const { locales } = spaceInfo;
    if (!locales || locales.length === 0) return [dataDefaultLang];
    else {
      let l_arr = [];
      for (let i = 0; i < locales.length; i++) {
        const l = locales[i];
        l_arr.push(l.locale);
      }
      return l_arr;
    }
  }
  function makeLocalesValue(prev = {}, value) {
    if (prev == null) prev = {};
    const { locales } = spaceInfo;
    if (!locales || locales.length === 0) {
      prev[dataDefaultLang] = value;
    } else {
      for (let i = 0; i < locales.length; i++) {
        const l = locales[i];
        if (!prev[l.locale] || (editingLocale && l.locale === editingLocale)) {
          prev[l.locale] = value;
        }
      }
    }
    return prev;
  }
  function _setEditingLocale(lang) {
    dispatch({
      type: "SET_EDITING_LOCALE",
      payload: lang
    });
  }
  function setEditingLocale(loc) {
    _setEditingLocale(loc);
  }
  return {
    currentLocale: getCurrentLocale(),
    setEditingLocale,
    locales: getLocales(),
    makeLocalesValue
  };
};

export default useLocale;

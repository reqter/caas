import en from "./locale/en";
import fa from "./locale/fa";
let systemDefaultLang = {
  title: "فارسی",
  direction: "rtl",
  name: "fa",
  description: "جمهوری اسلامی ایران"
};

let languages = {
  fa: {
    title: "فارسی",
    direction: "rtl",
    name: "fa",
    description: "جمهوری اسلامی ایران"
  },
  en: {
    title: "English",
    name: "en",
    direction: "ltr",
    description: "United Kingdom"
  }
};
let translate = {
  en,
  fa
};

// let currentLanguage = {
//   title: "فارسی",
//   direction: "rtl",
//   name: "fa",
//   description: "جمهوری اسلامی ایران"
// };

let currentLanguage = {
  title: "English",
  name: "en",
  direction: "ltr",
  description: "United Kingdom",
  allowEmptyValues: false
};

const languageManager = {
  translate(key) {
    if (translate !== undefined && translate[currentLanguage.name])
      return translate[currentLanguage.name][key]
        ? translate[currentLanguage.name][key]
        : key;
    else return key;
  },
  setLanguage(langName) {
    if (langName !== undefined) {
      if (!languages.hasOwnProperty(langName)) {
        currentLanguage = languages[Object.keys(languages)[0]];
      } else {
        currentLanguage = languages[langName];
      }
      if (
        !(currentLanguage && currentLanguage.name && currentLanguage.direction)
      ) {
        currentLanguage = systemDefaultLang;
      }
      //EventRegister.emit("onLanguageChanged", currentLanguage);
    }
  },
  getCurrentLanguage() {
    return currentLanguage;
  },
  getCurrentLayout() {
    return currentLanguage.direction;
  },
  setAppLanguages(enabledLanguages) {
    if (enabledLanguages) {
      languages = enabledLanguages;
    }
  },
  getAllLanguages() {
    return languages;
  },
  get isRTL() {
    return currentLanguage.direction === "rtl" ? true : false;
  }
};
export default languageManager;

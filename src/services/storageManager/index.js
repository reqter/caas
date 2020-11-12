"use strict";
import Cookies from "js-cookie";
function setItem(name, value) {
  Cookies.set(name, value);
}
function removeItem(name) {
  Cookies.remove(name);
}
function getItem(name) {
  return Cookies.get(name);
}

const storage = { setItem, getItem, removeItem };
export default storage;

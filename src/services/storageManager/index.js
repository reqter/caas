"use strict";
// import Cookies from "js-cookie";
function setItem(key, value) {
  localStorage.setItem(key, value);
}
function removeItem(key) {
  localStorage.removeItem(key);
}
function getItem(key) {
  return localStorage.getItem(key);
}
const storage = { setItem, getItem, removeItem };
export default storage;

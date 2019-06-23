import React, { useState, useEffect, useRef } from "react";
import { useGlobalState } from "../../../../services";
import { setLocales } from "./../../../../Api/space-api";
const Locale = props => {
  const [{ sysLocales, spaceInfo }, dispatch] = useGlobalState();

  function getLocaleTitle(localeName, type) {
    const locale = sysLocales.find(l => l.name === localeName);
    if (locale !== undefined) return locale.title;
    return type === "name" ? "" : "none";
  }
  function removeLocale(locale) {
    const s_copy = { ...spaceInfo };
    const r = s_copy.locales.filter(l => l.locale !== locale.locale);
    s_copy["locales"] = r;

    setLocales()
      .onOk(result => {
        dispatch({
          type: "SET_LOCALES",
          value: s_copy["locales"],
        });
      })
      .onServerError(result => {})
      .onBadRequest(result => {})
      .unAuthorized(result => {})
      .notFound(result => {})
      .call(spaceInfo.id, r);
  }
  function editLocale(locale) {
    props.onEditLocale(locale);
  }
  return (
    <div className="tabContents animated fadeIn faster">
      <div className="tabContent">
        <div className="tabContent-header">
          <span className="tabContent-header-title">Locales</span>
          <span className="tabContent-header-desc">
            Lorem ipsum has no many contribute
          </span>
        </div>
        <table className="table myTable">
          <thead className="myTable-header">
            <tr>
              <th>#</th>
              <th>Locale</th>
              <th>Fallback</th>
              <th>Inc.in response</th>
              <th>Editing</th>
              <th>Required Fields</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {spaceInfo &&
              spaceInfo.locales &&
              spaceInfo.locales.map((locale, index) => (
                <tr key={locale.locale}>
                  <td>
                    <div className="myTable-number">{index + 1}</div>
                  </td>
                  <td>
                    {getLocaleTitle(locale.locale, "name")}
                    {locale.default === true && (
                      <span className="defaultLang">Default</span>
                    )}
                  </td>
                  <td>{getLocaleTitle(locale.fallback, "fallback")}</td>
                  <td>{locale.inResponce === true ? "Enabled" : "Disabled"}</td>
                  <td>{locale.editable === true ? "Enabled" : "Disabled"}</td>
                  <td>
                    {locale.requiredFields === true
                      ? "Content is required"
                      : "Not required"}
                  </td>
                  <td>
                    <div className="myTable-actions">
                      <button
                        className="btn btn-light btn-sm"
                        onClick={() => editLocale(locale)}
                      >
                        Edit
                      </button>
                      {(locale.default === undefined ||
                        locale.default === false) && (
                        <button
                          className="btn btn-light btn-sm"
                          onClick={() => removeLocale(locale)}
                        >
                          <i className="icon-bin" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Locale;

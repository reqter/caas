import React from "react";
import { updateSpace, setRoles } from "Api/space-api";
import { languageManager, useGlobalState } from "services";
const currentLang = languageManager.getCurrentLanguage().name;
const Locale = props => {
  const [{ spaceInfo, roleTypes }, dispatch] = useGlobalState();

  function removeRole(role) {
    const s_copy = { ...spaceInfo };
    const r = s_copy.roles.filter(r => r.name !== role.name);
    s_copy["roles"] = r;
    setRoles()
      .onOk(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: languageManager.translate("SUCCESS_TEXT")
          }
        });
        dispatch({
          type: "SET_SPACEINFO",
          value: s_copy
        });
      })
      .unKnownError(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("ERROR_TEXT")
          }
        });
      })
      .call(spaceInfo.id, r);
  }
  function editRole(role) {
    props.onEditRole(role);
  }
  function getRoleTypeTitle(type) {
    const r = roleTypes.find(item => item.name === type);
    return r ? r.name : "----";
  }
  return (
    <div className="tabContents animated fadeIn faster">
      <div className="tabContent">
        <div className="tabContent-header">
          <span className="tabContent-header-title">
            {languageManager.translate("Roles")}
          </span>
          <span className="tabContent-header-desc">
            {languageManager.translate("Define and change space roles")}
          </span>
        </div>
        <table className="table myTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Title</th>
              <th>Role Type</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {spaceInfo &&
              spaceInfo.roles &&
              spaceInfo.roles.map((role, index) => (
                <tr>
                  <td>
                    <div className="myTable-number">{index + 1}</div>
                  </td>
                  <td>{role.name}</td>
                  <td>{role.title[currentLang]}</td>
                  <td>
                    <span className="badge badge-primary badge-lg">
                      {getRoleTypeTitle(role.type)}
                    </span>
                  </td>
                  <td>
                    <div className="myTable-actions">
                      <button
                        className="btn btn-light btn-sm"
                        onClick={() => removeRole(role)}
                      >
                        <i className="icon-bin" />
                      </button>
                      <button
                        className="btn btn-light btn-sm"
                        onClick={() => editRole(role)}
                      >
                        Edit
                      </button>
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

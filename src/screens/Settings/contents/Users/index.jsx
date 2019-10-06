import React from "react";
import { setUsers } from "Api/space-api";
import { languageManager, useGlobalState } from "services";
const currentLang = languageManager.getCurrentLanguage().name;
const UsersList = props => {
  const [{ spaceInfo, roleTypes }, dispatch] = useGlobalState();

  function remove(user) {
    const s_copy = { ...spaceInfo };
    const r = s_copy.users.filter(r => r.userName !== user.userName);
    s_copy["users"] = r;
    setUsers()
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
  function edit(user) {
    props.onEditUser(user);
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
            {languageManager.translate("Users")}
          </span>
          <span className="tabContent-header-desc">
            {languageManager.translate("Define and change space users")}
          </span>
        </div>
        <table className="table myTable">
          <thead>
            <tr>
              <th>#</th>
              <th>FullName</th>
              <th>Username</th>
              <th>Password</th>
              <th>Role Type</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {spaceInfo &&
              spaceInfo.users &&
              spaceInfo.users.map((user, index) => (
                <tr>
                  <td>
                    <div className="myTable-number">{index + 1}</div>
                  </td>
                  <td>{user.fullName}</td>
                  <td>{user.userName}</td>
                  <td>{user.password}</td>
                  <td>
                    <span className="badge badge-primary badge-lg">
                      {getRoleTypeTitle(user.type)}
                    </span>
                  </td>
                  <td>
                    <div className="myTable-actions">
                      <button
                        className="btn btn-light btn-sm"
                        onClick={() => remove(user)}
                      >
                        <i className="icon-bin" />
                      </button>
                      <button
                        className="btn btn-light btn-sm"
                        onClick={() => edit(user)}
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
export default UsersList;

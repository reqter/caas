import React, { useState, useRef, useEffect } from "react";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalFooter from "reactstrap/lib/ModalFooter";
//
import { setUsers } from "Api/space-api";
import { CircleSpinner } from "components";
import { languageManager, useGlobalState } from "services";
const currentLang = languageManager.getCurrentLanguage().name;
//
const UpsertUserModal = props => {
  const inputRef = useRef(null);
  const [{ spaceInfo, roleTypes }, dispatch] = useGlobalState();

  const updateMode = props.selectedUser === undefined ? undefined : true;
  const selectedUser =
    props.selectedUser === undefined ? undefined : props.selectedUser;

  const [fullName, setFullName] = useState(
    selectedUser ? selectedUser.fullName : ""
  );
  const [userName, setUserName] = useState(
    selectedUser ? selectedUser.userName : ""
  );
  const [password, setPassword] = useState(
    selectedUser ? selectedUser.password : ""
  );
  const [selectedRoleType, setRoleType] = useState(
    selectedUser ? selectedUser.type : null
  );
  const [spinner, toggleSpinner] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
    return () => {};
  }, []);

  function showNotify(type, msg) {
    dispatch({
      type: "ADD_NOTIFY",
      value: {
        type: type,
        message: msg
      }
    });
  }
  function closeModal() {
    props.onClose();
  }
  function handleRoleTypeClicked(type) {
    setRoleType(type.name);
  }

  function handleSubmit(e) {
    if (!spinner) {
      toggleSpinner(true);
      const s = { ...spaceInfo };
      if (updateMode) {
        for (let i = 0; i < s.users.length; i++) {
          const user = s.users[i];
          if (user.userName === selectedUser.userName) {
            user.userName = userName;
            user.fullName = fullName;
            user.password = password;
            user.type = selectedRoleType;
            break;
          }
        }
      } else {
        if (s.users === undefined) {
          s.users = [];
        }
        s.users.push({
          fullName: fullName,
          userName: userName,
          password: password,
          type: selectedRoleType
        });
      }
      setUsers()
        .onOk(result => {
          dispatch({
            type: "SET_SPACEINFO",
            value: s
          });
          closeModal();
          showNotify(
            "success",
            languageManager.translate("User submitted successfully.")
          );
        })
        .unKnownError(result => {
          toggleSpinner(false);
          showNotify("error", languageManager.translate("ERROR_TEXT"));
        })
        .call(spaceInfo.id, s.roles);
    }
  }
  function checkDuplicateUserName() {
    if (!spaceInfo.users || spaceInfo.users.length == 0) return true;
    for (let i = 0; i < spaceInfo.users.length; i++) {
      const user = spaceInfo.users[i];
      if (updateMode) {
        if (user.userName !== selectedUser.userName)
          if (user.userName === userName) return false;
      } else if (user.userName === userName) return false;
    }
    return true;
  }
  return (
    <Modal isOpen={props.isOpen} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>
        {updateMode ? "Update User" : "New User"}
      </ModalHeader>
      <ModalBody>
        <div className="settings-modal-body">
          <form id="upserRoleForm">
            <div className="form-group">
              <label>{languageManager.translate("FullName")}</label>
              <input
                ref={inputRef}
                type="text"
                className="form-control"
                placeholder={languageManager.translate("Enter user full name")}
                value={fullName}
                onChange={e => {
                  setFullName(e.target.value);
                }}
              />
              <small className="form-text text-muted">
                {/* {languageManager.translate("Name can't be a duplicate")} */}
              </small>
            </div>
            <div className="form-group">
              <label>{languageManager.translate("Username")}</label>
              <input
                type="text"
                className="form-control"
                placeholder={languageManager.translate("Enter a username")}
                value={userName}
                onChange={e => {
                  setUserName(e.target.value);
                }}
              />
              <small className="form-text text-muted">
                {languageManager.translate("Username can't be a duplicate")}
              </small>
            </div>
            <div className="form-group">
              <label>{languageManager.translate("Password")}</label>
              <input
                type="text"
                className="form-control"
                placeholder={languageManager.translate("******")}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                }}
              />
              <small className="form-text text-muted">
                {languageManager.translate(
                  "Password must be at least 6 characters"
                )}
              </small>
            </div>
            <div className="roles">
              <label>Select Role Type</label>
              <div>
                {roleTypes.map(r => (
                  <button
                    type="button"
                    className={
                      "btn btn-sm " +
                      (r.name === selectedRoleType
                        ? "btn-primary"
                        : "btn-light")
                    }
                    onClick={() => handleRoleTypeClicked(r)}
                  >
                    {r.title[currentLang]}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </ModalBody>
      <ModalFooter>
        <button onClick={closeModal} className="btn btn-secondary">
          {languageManager.translate("CANCEL")}
        </button>
        <button
          type="button"
          className="btn btn-primary ajax-button"
          onClick={handleSubmit}
          disabled={
            userName.length > 0 &&
            !userName.includes(" ") > 0 &&
            checkDuplicateUserName() &&
            password.length >= 6 &&
            selectedRoleType
              ? false
              : true
          }
        >
          {spinner ? (
            <CircleSpinner show={spinner} size="small" />
          ) : (
            <span> {updateMode ? "Update User" : "Add User"}</span>
          )}
        </button>
      </ModalFooter>
    </Modal>
  );
};
export default UpsertUserModal;

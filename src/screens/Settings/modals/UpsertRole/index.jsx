import React, { useState, useRef, useEffect } from "react";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalFooter from "reactstrap/lib/ModalFooter";
//
import { setRoles } from "Api/space-api";
import { CircleSpinner } from "components";
import { languageManager, useGlobalState } from "services";
const currentLang = languageManager.getCurrentLanguage().name;
//
const UpdateRole = props => {
  const inputRef = useRef(null);
  const [{ spaceInfo, roleTypes }, dispatch] = useGlobalState();

  const updateMode = props.selectedRole === undefined ? undefined : true;
  const selectedRole =
    props.selectedRole === undefined ? undefined : props.selectedRole;

  const [name, setName] = useState(selectedRole ? selectedRole.name : "");
  const [title, setTitle] = useState(
    selectedRole ? selectedRole.title[currentLang] : ""
  );
  const [selectedRoleType, setRoleType] = useState(
    selectedRole ? selectedRole.type : null
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

  function handleSubmitRole(e) {
    if (!spinner) {
      toggleSpinner(true);
      const s = { ...spaceInfo };
      if (updateMode) {
        for (let i = 0; i < s.roles.length; i++) {
          const role = s.roles[i];
          if (role.name === selectedRole.name) {
            role.name = name;
            role.title = {
              en: title
            };
            role.type = selectedRoleType;
            break;
          }
        }
      } else {
        if (s.roles === undefined) {
          s.roles = [];
        }
        s.roles.push({
          name: name,
          title: {
            en: title
          },
          type: selectedRoleType
        });
      }
      setRoles()
        .onOk(result => {
          dispatch({
            type: "SET_SPACEINFO",
            value: s
          });
          closeModal();
          showNotify(
            "success",
            languageManager.translate("Role submitted successfully.")
          );
        })
        .onServerError(result => {
          toggleSpinner(false);
          showNotify(
            "error",
            languageManager.translate("PROFILE_CHANGE_PASS_ON_SERVER_ERROR")
          );
        })
        .onBadRequest(result => {
          toggleSpinner(false);
          showNotify(
            "error",
            languageManager.translate("PROFILE_CHANGE_PASS_ON_BAD_REQUEST")
          );
        })
        .unAuthorized(result => {
          toggleSpinner(false);
          showNotify(
            "error",
            languageManager.translate("PROFILE_CHANGE_PASS_UN_AUTHORIZED")
          );
        })
        .notFound(result => {
          toggleSpinner(false);
          showNotify(
            "error",
            languageManager.translate("PROFILE_CHANGE_PASS_NOT_FOUND")
          );
        })
        .call(spaceInfo.id, s.roles);
    }
  }
  function checkDuplicateName() {
    if (!spaceInfo.roles || spaceInfo.roles.length == 0) return true;
    for (let i = 0; i < spaceInfo.roles.length; i++) {
      const role = spaceInfo.roles[i];
      if (updateMode) {
        if (role.name !== selectedRole.name)
          if (role.name === name) return false;
      } else if (role.name === name) return false;
    }
    return true;
  }
  return (
    <Modal isOpen={props.isOpen} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>
        {updateMode ? "Update Role" : "New Role"}
      </ModalHeader>
      <ModalBody>
        <div className="settings-modal-body">
          <form id="upserRoleForm">
            <div className="form-group">
              <label>{languageManager.translate("Title")}</label>
              <input
                ref={inputRef}
                type="text"
                className="form-control"
                placeholder={languageManager.translate("Enter a name")}
                value={name}
                onChange={e => {
                  setName(e.target.value);
                }}
              />
              <small className="form-text text-muted">
                {languageManager.translate("Name can't be a duplicate")}
              </small>
            </div>
            <div className="form-group">
              <label>{languageManager.translate("Title")}</label>
              <input
                type="text"
                className="form-control"
                placeholder={languageManager.translate("Enter a title")}
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                }}
              />
              <small className="form-text text-muted">
                {languageManager.translate("Required field.")}
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
          onClick={handleSubmitRole}
          disabled={
            name.length > 0 &&
            !name.includes(" ") > 0 &&
            checkDuplicateName() &&
            title.length > 0 &&
            selectedRoleType
              ? false
              : true
          }
        >
          {spinner ? (
            <CircleSpinner show={spinner} size="small" />
          ) : (
            <span> {updateMode ? "Update Role" : "Add Role"}</span>
          )}
        </button>
      </ModalFooter>
    </Modal>
  );
};
export default UpdateRole;

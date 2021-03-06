import React, { useState, useEffect } from "react";
import "./styles.scss";
import List from "./list";
import AddNewField from "./modals/AddNewField";
import FieldConfig from "./modals/FieldConfig";
import AddNewItemType from "./modals/AddNewItemType";
import useGlobalState from "services/stateManager";
import { t, currentLang } from "services/languageManager";
import PageLayout from "components/PageLayout";
import { useLocale } from "hooks";
import {
  deleteContentType,
  setAccessRight,
  updateContentType,
} from "Api/contentType-api";
import Alert from "components/PopupAlert";
import RowSkeleton from "components/RowSkeleton";
import AssignRole from "components/AssignRole";

const ItemTypes = (props) => {
  const [{ contentTypes, spaceInfo }, dispatch] = useGlobalState();
  const { currentLocale } = useLocale();

  // variables and handlers
  const [showFieldConfig, toggleShowFieldConfig] = useState(false);
  const [upsertFieldModal, toggleUpsertFieldModal] = useState(false);
  const [upsertItemTypeModal, toggleUpserItemTypeModal] = useState(false);
  const [selectedContentType, setItemType] = useState({});
  const [updateMode, setUpdateMode] = useState();
  const [fields, setFields] = useState();
  const [selectedField, setSelectedField] = useState();
  const [rightContent, toggleRightContent] = useState(false);
  const [alertData, setAlertData] = useState();
  const [assignRoleModal, toggleAssignRoleModal] = useState(false);

  function openAddItemTypeModal() {
    setUpdateMode(false);
    toggleUpserItemTypeModal(true);
  }

  function editItemType(item) {
    setItemType(item);
    setUpdateMode(true);
    toggleUpserItemTypeModal(true);
  }

  function removeItemType(selected) {
    setAlertData({
      type: "error",
      title: t("CONTENT_TYPE_REMOVE_ALERT_TITLE"),
      message: t("CONTENT_TYPE_REMOVE_ALERT_MESSAGE"),
      isAjaxCall: true,
      okTitle: "Remove",
      cancelTitle: "Don't remove",
      onOk: () =>
        deleteContentType()
          .onOk((result) => {
            setAlertData();
            if (selected._id === selectedContentType._id)
              toggleRightContent(false);
            dispatch({
              type: "DELETE_CONTENT_TYPE",
              value: selected,
            });
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "success",
                message: t("CONTENT_TYPE_REMOVE_ON_OK"),
              },
            });
          })
          .onServerError((result) => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: t("CONTENT_TYPE_REMOVE_ON_SERVER_ERROR"),
              },
            });
          })
          .onBadRequest((result) => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: t("CONTENT_TYPE_REMOVE_ON_BAD_REQUEST"),
              },
            });
          })
          .unAuthorized((result) => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "warning",
                message: t("CONTENT_TYPE_REMOVE_UN_AUTHORIZED"),
              },
            });
          })
          .notFound((result) => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: t("CONTENT_TYPE_REMOVE__NOT_FOUND"),
              },
            });
          })
          .call(spaceInfo.id, selected._id),
      onCancel: () => {
        setAlertData();
      },
    });
  }
  function closeRightContent() {
    toggleRightContent();
  }

  /////////////////////////////// fields
  function showFields(item) {
    if (!rightContent) toggleRightContent(true);
    setItemType(item);
    if (item.fields && item.fields.length > 0) setFields([...item.fields]);
    else setFields([]);
    //dispatch({ type: "SET_FIELDS", value: [...item.fields] });
  }
  function closeAddFieldModal(result) {
    toggleUpsertFieldModal(false);
    if (result) {
      const f = fields;
      f.push(result.field);
      setFields(f);
      //dispatch({ type: "SET_FIELDS", value: f });
      if (result.showConfig) {
        setSelectedField(result.field);
        toggleShowFieldConfig(true);
      }
    }
  }
  function addNewField() {
    toggleUpsertFieldModal((prevModal) => !prevModal);
  }
  function handleRemoveField(field) {
    setAlertData({
      type: "error",
      title: t("CONTENT_TYPE_REMOVE_FIELD_ALERT_TITLE"),
      message: t("CONTENT_TYPE_REMOVE_FIELD_ALERT_MESSAGE"),
      isAjaxCall: true,
      onOk: () => {
        let newContentType = { ...selectedContentType };
        const restFields = fields.filter((item) => item.name !== field.name);
        newContentType.fields = restFields;
        updateContentType()
          .onOk((result) => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "success",
                message: t("CONTENT_TYPE_REMOVE_FIELD_ON_OK"),
              },
            });
            setFields(result.fields);
            setItemType(newContentType);
            dispatch({
              type: "UPDATE_CONTENT_TYPE",
              value: result,
            });
          })
          .onServerError((result) => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: t("CONTENT_TYPE_REMOVE_FIELD_ON_SERVER_ERROR"),
              },
            });
          })
          .onBadRequest((result) => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: t("CONTENT_TYPE_REMOVE_FIELD_ON_BAD_REQUEST"),
              },
            });
          })
          .unAuthorized((result) => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "warning",
                message: t("CONTENT_TYPE_REMOVE_FIELD_UN_AUTHORIZED"),
              },
            });
          })
          .notFound((result) => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: t("CONTENT_TYPE_REMOVE_FIELD_NOT_FOUND"),
              },
            });
          })
          .call(spaceInfo.id, newContentType);
      },
      onCancel: () => {
        setAlertData();
      },
    });
  }
  function closeFieldConfigModal(cnType, updatedField) {
    toggleShowFieldConfig(false);
    if (updatedField) {
      const newFields = fields.map((item) => {
        if (item.name === updatedField.name) return updatedField;
        return item;
      });
      setFields(newFields);
      setItemType(cnType);
    }
  }
  function showAdvanceConfig(field) {
    setSelectedField(field);
    toggleShowFieldConfig(true);
  }

  function openAssignRoleModal(c) {
    setItemType(c);
    toggleAssignRoleModal(true);
  }
  function closeAssignRoleModal(result) {
    toggleAssignRoleModal(false);
    // if (result) {
    //   setAccessRight()
    //     .onOk(result => {
    //       dispatch({
    //         type: "ADD_NOTIFY",
    //         value: {
    //           type: "success",
    //           message: t("CONTENT_TYPE_ASSIGN_ROLE_ON_OK")
    //         }
    //       });
    //       dispatch({
    //         type: "SET_USERS",
    //         value: result
    //       });
    //     })
    //     .onServerError(result => {
    //       dispatch({
    //         type: "ADD_NOTIFY",
    //         value: {
    //           type: "error",
    //           message: t("CONTENT_TYPE_ASSIGN_ROLE_SERVER_ERROR")
    //         }
    //       });
    //     })
    //     .onBadRequest(result => {
    //       dispatch({
    //         type: "ADD_NOTIFY",
    //         value: {
    //           type: "error",
    //           message: t("CONTENT_TYPE_ASSIGN_ROLE_ON_BAD_REQUEST")
    //         }
    //       });
    //     })
    //     .unAuthorized(result => {
    //       dispatch({
    //         type: "ADD_NOTIFY",
    //         value: {
    //           type: "warning",
    //           message: t("CONTENT_TYPE_ASSIGN_ROLE_UN_AUTHORIZED")
    //         }
    //       });
    //     })
    //     .notFound(result => {
    //       dispatch({
    //         type: "ADD_NOTIFY",
    //         value: {
    //           type: "warning",
    //           message: t("CONTENT_TYPE_ASSIGN_ROLE_NOT_FOUND")
    //         }
    //       });
    //     })
    //     .call(selectedContentType._id, result);
    // }
  }
  return (
    <PageLayout
      title={t("HOME_SIDE_NAV_CONTENT_TYPE")}
      description={t("HOME_SIDE_NAV_CONTENT_TYPE_DEC")}
      renderHeader={() => (
        <div>
          <button className="btn btn-primary" onClick={openAddItemTypeModal}>
            {t("CONTENT_TYPE_NEW_ITEM_BTN")}
          </button>
        </div>
      )}
    >
      <div className="ct-content">
        <div className="ct-content-left">
          <List
            rightContent={rightContent}
            handleEditType={editItemType}
            handleDeleteType={removeItemType}
            handleShowFields={showFields}
            onVisibleToClicked={openAssignRoleModal}
          />
        </div>
        {rightContent && (
          <div className="ct-content-right animated slideInRight faster">
            <div className="ct-content-right-header">
              <span className="ct-right-header-title">
                {t("CONTENT_TYPE_MODEL_HEADER_TITLE")}
              </span>
              <span className="ct-right-header-description">
                {t("CONTENT_TYPE_MODEL_HEADER_DESC")}
              </span>
              <span
                className="icon-cross closeIcon"
                onClick={closeRightContent}
              />
            </div>
            <div className="ct-content-right-body">
              <div className="fieldsContent">
                {/* <SortableContainer onSortEnd={onSortEnd}>
                    {fields.map((value, index) => (
                      <SortableItem
                        key={`item-${index}`}
                        index={index}
                        field={value}
                      />
                    ))}
                  </SortableContainer> */}
                {fields &&
                  fields.map((field) => (
                    <div
                      className="fieldItem"
                      key={field.name}
                      // style={{
                      //   display: !selectedContentType.allowCustomFields
                      //     ? field.isBase
                      //       ? "none"
                      //       : "flex"
                      //     : "flex"
                      // }}
                    >
                      <div className="fieldItem-icon">
                        <i className="icon-more-h" />
                      </div>
                      <div className="fieldItem-type">
                        <i
                          className={
                            field.type === "string"
                              ? "icon-file-text"
                              : field.type === "number"
                              ? "icon-number"
                              : field.type === "dateTime"
                              ? "icon-calendar"
                              : field.type === "location"
                              ? "icon-location"
                              : field.type === "media"
                              ? "icon-images"
                              : field.type === "jsonObject"
                              ? "icon-json-file"
                              : field.type === "reference"
                              ? "icon-reference"
                              : field.type === "boolean"
                              ? "icon-boolean"
                              : field.type === "keyValue"
                              ? "icon-combo-box"
                              : "icon-file-text"
                          }
                        />
                      </div>
                      <div className="fieldItem-name">
                        {field.title[currentLocale]}
                      </div>
                      <div className="fieldItem-title">{field.name}</div>

                      <div className="fieldItem-actions">
                        <button
                          className="btn btn-link"
                          onClick={() => showAdvanceConfig(field)}
                        >
                          Settings
                        </button>
                        {field.isBase === undefined || !field.isBase ? (
                          <>
                            <button
                              className="btn btn-link"
                              size="xs"
                              onClick={() => handleRemoveField(field)}
                            >
                              <i className="icon-bin" />
                            </button>
                          </>
                        ) : (
                          // <span className="badge badge-danger label-nonEditable">
                          //   Non-editable
                          // </span>
                          <div />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="btnNewFieldContent">
                {selectedContentType.allowCustomFields && (
                  <button className="btn btn-primary" onClick={addNewField}>
                    <i className="icon-plus" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {upsertItemTypeModal && (
        <AddNewItemType
          selectedContentType={selectedContentType}
          updateMode={updateMode}
          isOpen={upsertFieldModal}
          onCloseModal={() => toggleUpserItemTypeModal(false)}
        />
      )}
      {upsertFieldModal && (
        <AddNewField
          fields={fields}
          selectedContentType={selectedContentType}
          isOpen={upsertFieldModal}
          onCloseModal={(result) => closeAddFieldModal(result)}
        />
      )}
      {showFieldConfig && (
        <FieldConfig
          selectedContentType={selectedContentType}
          selectedField={selectedField}
          isOpen={showFieldConfig}
          onCloseModal={closeFieldConfigModal}
        />
      )}
      {alertData && <Alert data={alertData} />}
      {assignRoleModal && (
        <AssignRole
          isOpen={assignRoleModal}
          onClose={closeAssignRoleModal}
          headerTitle={
            t("CONTENT_TYPE_ROLE_MODAL_TITLE") +
            " " +
            selectedContentType.title[currentLang]
          }
          roles={selectedContentType ? selectedContentType.visibleTo : []}
        />
      )}
    </PageLayout>
  );
};

export default ItemTypes;

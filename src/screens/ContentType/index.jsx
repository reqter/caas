import React, { useState, useEffect, useRef } from "react";
import "./styles.scss";
import List from "./list";
import AddNewField from "./modals/AddNewField";
import FieldConfig from "./modals/FieldConfig";
import AddNewItemType from "./modals/AddNewItemType";
import { languageManager, useGlobalState } from "../../services";
import {
  getContentTypes,
  deleteContentType,
  removeContentTypeField,
  setAccessRight,
  updateContentType
} from "../../Api/contentType-api";
import { Alert, RowSkeleton } from "../../components";

const ItemTypes = props => {
  const currentLang = languageManager.getCurrentLanguage().name;

  const [{ contentTypes, spaceInfo }, dispatch] = useGlobalState();
  const [spinner, setSpinner] = useState(true);
  useEffect(() => {
    let didCancel = false;
    getContentTypes()
      .onOk(result => {
        if (!didCancel) {
          setSpinner(false);
          dispatch({
            type: "SET_CONTENT_TYPES",
            value: result
          });
        }
      })
      .onServerError(result => {
        if (!didCancel) {
          setSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: languageManager.translate("CONTENT_TYPE_ON_SERVER_ERROR")
            }
          });
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
          setSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: languageManager.translate("CONTENT_TYPE_ON_BAD_REQUEST")
            }
          });
        }
      })
      .unAuthorized(result => {
        if (!didCancel) {
          setSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "warning",
              message: languageManager.translate("CONTENT_TYPE_UN_AUTHORIZED")
            }
          });
        }
      })
      .call(spaceInfo.id);
    return () => {
      didCancel = true;
    };
  }, []);

  const pageTitle = languageManager.translate("HOME_SIDE_NAV_CONTENT_TYPE");
  const pageDescription = languageManager.translate(
    "HOME_SIDE_NAV_CONTENT_TYPE_DEC"
  );
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

  function translate(key) {
    return languageManager.translate(key);
  }
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
      title: translate("CONTENT_TYPE_REMOVE_ALERT_TITLE"),
      message: translate("CONTENT_TYPE_REMOVE_ALERT_MESSAGE"),
      isAjaxCall: true,
      okTitle: "Remove",
      cancelTitle: "Don't remove",
      onOk: () =>
        deleteContentType()
          .onOk(result => {
            setAlertData();
            if (selected._id === selectedContentType._id)
              toggleRightContent(false);
            dispatch({
              type: "DELETE_CONTENT_TYPE",
              value: selected
            });
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "success",
                message: languageManager.translate("CONTENT_TYPE_REMOVE_ON_OK")
              }
            });
          })
          .onServerError(result => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "CONTENT_TYPE_REMOVE_ON_SERVER_ERROR"
                )
              }
            });
          })
          .onBadRequest(result => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "CONTENT_TYPE_REMOVE_ON_BAD_REQUEST"
                )
              }
            });
          })
          .unAuthorized(result => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "warning",
                message: languageManager.translate(
                  "CONTENT_TYPE_REMOVE_UN_AUTHORIZED"
                )
              }
            });
          })
          .notFound(result => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "CONTENT_TYPE_REMOVE__NOT_FOUND"
                )
              }
            });
          })
          .call(spaceInfo.id, selected._id),
      onCancel: () => {
        setAlertData();
      }
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
    toggleUpsertFieldModal(prevModal => !prevModal);
  }
  function handleRemoveField(field) {
    setAlertData({
      type: "error",
      title: translate("CONTENT_TYPE_REMOVE_FIELD_ALERT_TITLE"),
      message: translate("CONTENT_TYPE_REMOVE_FIELD_ALERT_MESSAGE"),
      isAjaxCall: true,
      onOk: () => {
        const newContentType = { ...selectedContentType };
        const f = fields.filter(item => item.name !== field.name);
        newContentType.fields = f;
        updateContentType()
          .onOk(result => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "success",
                message: languageManager.translate(
                  "CONTENT_TYPE_REMOVE_FIELD_ON_OK"
                )
              }
            });
            setFields(f);
            dispatch({
              type: "UPDATE_CONTENT_TYPE",
              value: result
            });
          })
          .onServerError(result => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "CONTENT_TYPE_REMOVE_FIELD_ON_SERVER_ERROR"
                )
              }
            });
          })
          .onBadRequest(result => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "CONTENT_TYPE_REMOVE_FIELD_ON_BAD_REQUEST"
                )
              }
            });
          })
          .unAuthorized(result => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "warning",
                message: languageManager.translate(
                  "CONTENT_TYPE_REMOVE_FIELD_UN_AUTHORIZED"
                )
              }
            });
          })
          .notFound(result => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "CONTENT_TYPE_REMOVE_FIELD_NOT_FOUND"
                )
              }
            });
          })
          .call(spaceInfo.id, newContentType);
      },
      onCancel: () => {
        setAlertData();
      }
    });
  }
  function closeFieldConfigModal(updatedField) {
    toggleShowFieldConfig(false);
    if (updatedField) {
      const newFields = fields.map(item => {
        if (item.name === updatedField.name) return updatedField;
        return item;
      });
      setFields(newFields);
    }
  }
  function showAdvanceConfig(field) {
    setSelectedField(field);
    toggleShowFieldConfig(true);
  }

  return (
    <>
      <div className="ct-wrapper">
        <div className="ct-header">
          <div className="ct-header-left">
            <span className="ct-header-title">{pageTitle}</span>
            <span className="ct-header-description">{pageDescription}</span>
          </div>
          <div className="ct-header-right">
            <button className="btn btn-primary" onClick={openAddItemTypeModal}>
              {languageManager.translate("CONTENT_TYPE_NEW_ITEM_BTN")}
            </button>
          </div>
        </div>
        <div className="ct-content">
          <div className="ct-content-left">
            {spinner ? (
              <RowSkeleton />
            ) : !contentTypes || contentTypes.length === 0 ? (
              <div className="emptyContenType animated fadeIn">
                <i className="icon-empty-box-open icon" />
                <span className="title">Empty List!</span>
                <span className="info">
                  You have not created any content types yet.
                </span>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={openAddItemTypeModal}
                >
                  New Content Type
                </button>
              </div>
            ) : (
              <List
                rightContent={rightContent}
                data={contentTypes}
                handleEditType={selected => editItemType(selected)}
                handleDeleteType={selected => removeItemType(selected)}
                handleShowFields={selected => showFields(selected)}
              />
            )}
          </div>
          {rightContent && (
            <div className="ct-content-right animated slideInRight faster">
              <div className="ct-content-right-header">
                <span className="ct-right-header-title">
                  {languageManager.translate("CONTENT_TYPE_MODEL_HEADER_TITLE")}
                </span>
                <span className="ct-right-header-description">
                  {languageManager.translate("CONTENT_TYPE_MODEL_HEADER_DESC")}
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
                    fields.map(field => (
                      <div
                        className="fieldItem"
                        key={field._id}
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
                          {field.title[currentLang]}
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
          onCloseModal={result => closeAddFieldModal(result)}
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
    </>
  );
};

export default ItemTypes;

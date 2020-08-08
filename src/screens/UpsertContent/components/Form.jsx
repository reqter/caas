import React, { useState, useEffect, useRef } from "react";
import useGlobalState from "services/stateManager";
import { t } from "services/languageManager";
import CircleSpinner from "components/CircleSpinner";
import useLocale from "hooks/useLocale";
import {
  String,
  Number,
  DateTime,
  Location,
  Media,
  Boolean,
  KeyValue,
  RichText,
  Reference,
  JsonObject,
  AdvanceUploaderView,
} from "components";
import {
  addContent,
  updateContent,
  update_PublishContent,
} from "Api/content-api";
import styles from "../styles.module.scss";

const Form = ({ formMode = "new", contentType, item, onSubmitClose }) => {
  const updateMode = formMode === "edit" ? true : false;
  const viewMode = formMode === "view" ? true : false;
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const [formData, setFormData] = useState(item ? item.fields : {});
  const [form, setForm] = useState(item ? item.fields : {});
  const [fields, setFields] = useState();
  const [formValidation, setFormValidation] = useState();
  const [isValidForm, toggleIsValidForm] = useState(false);
  const [spinner, toggleSpinner] = useState(false);
  const [closeSpinner, toggleCloseSpinner] = useState(false);
  const [publishSpinner, togglePublishSpinner] = useState(false);

  useEffect(() => {
    if (Object.keys(form).length > 0 && checkFormValidation()) {
      toggleIsValidForm(true);
    } else toggleIsValidForm(false);
  }, [formValidation]);

  function checkFormValidation() {
    for (const key in formValidation) {
      if (formValidation[key] === false) return false;
    }
    return true;
  }

  function setNameToFormValidation(name, value) {
    if (!formValidation || formValidation[name] !== null) {
      setFormValidation((prevFormValidation) => ({
        ...prevFormValidation,
        [name]: value,
      }));
    }
  }
  function handleOnChangeValue(field, value, isValid) {
    const { name: key } = field;
    // add value to form
    // const f = { ...form, [key]: value };
    // form[key] = value;
    setForm((prevForm) => {
      const obj = { ...prevForm, [key]: value };
      return obj;
    });

    setFormValidation((prevFormValidation) => ({
      ...prevFormValidation,
      [key]: isValid,
    }));
  }
  function getFieldItem(field) {
    switch (field.type.toLowerCase()) {
      case "string":
        return (
          <String
            viewMode={viewMode}
            updateMode={updateMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "number":
        return (
          <Number
            viewMode={viewMode}
            updateMode={updateMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "datetime":
        return (
          <DateTime
            viewMode={viewMode}
            updateMode={updateMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "location":
        return (
          <Location
            viewMode={viewMode}
            updateMode={updateMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "media":
        if (viewMode) {
          return (
            <AdvanceUploaderView
              updateMode={updateMode}
              viewMode={viewMode}
              formData={formData}
              field={field}
              init={setNameToFormValidation}
              onChangeValue={handleOnChangeValue}
            />
          );
        } else {
          return (
            <Media
              viewMode={viewMode}
              updateMode={updateMode}
              formData={formData}
              field={field}
              init={setNameToFormValidation}
              onChangeValue={handleOnChangeValue}
            />
          );
        }
      case "boolean":
        return (
          <Boolean
            viewMode={viewMode}
            updateMode={updateMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "keyvalue":
        return (
          <KeyValue
            viewMode={viewMode}
            field={field}
            updateMode={updateMode}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "richtext":
        return (
          <RichText
            updateMode={updateMode}
            viewMode={viewMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "reference":
        return (
          <Reference
            viewMode={viewMode}
            updateMode={updateMode}
            field={field}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      case "jsonobject":
        return (
          <JsonObject
            viewMode={viewMode}
            field={field}
            updateMode={updateMode}
            formData={formData}
            init={setNameToFormValidation}
            onChangeValue={handleOnChangeValue}
          />
        );
      default:
        break;
    }
  }
  function upsertItem(closePage, isPublish) {
    if (!spinner && !closeSpinner && !publishSpinner) {
      if (isPublish) togglePublishSpinner(true);
      else if (closePage) toggleCloseSpinner(true);
      else toggleSpinner(true);
      upsertContent(closePage, isPublish);
    }
  }

  function upsertContent(closePage, isPublish) {
    if (isPublish) {
      const obj = {
        _id: item._id,
        contentType: contentType._id,
        fields: form,
      };
      update_PublishContent()
        .onOk((result) => {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "success",
              message: t("UPSERT_ITEM_UPDATE_ON_OK"),
            },
          });
          if (onSubmitClose) onSubmitClose();
        })
        .onServerError((result) => {
          if (closePage) toggleCloseSpinner(false);
          else toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("UPSERT_ITEM_UPDATE_ON_SERVER_ERROR"),
            },
          });
        })
        .onBadRequest((result) => {
          if (closePage) toggleCloseSpinner(false);
          else toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("UPSERT_ITEM_UPDATE_ON_BAD_REQUEST"),
            },
          });
        })
        .unAuthorized((result) => {
          if (closePage) toggleCloseSpinner(false);
          else toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "warning",
              message: t("UPSERT_ITEM_UPDATE_UN_AUTHORIZED"),
            },
          });
        })
        .notFound((result) => {
          if (closePage) toggleCloseSpinner(false);
          else toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "warning",
              message: t("UPSERT_ITEM_UPDATE_NOT_FOUND"),
            },
          });
        })
        .call(spaceInfo.id, obj);
    } else if (updateMode) {
      const obj = {
        _id: item._id,
        contentType: contentType._id,
        fields: form,
      };
      updateContent()
        .onOk((result) => {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "success",
              message: t("UPSERT_ITEM_ADD_ON_OK"),
            },
          });
          if (closePage) {
            if (onSubmitClose) onSubmitClose();
          } else {
            if (closePage) toggleCloseSpinner(false);
            else toggleSpinner(false);
            setFormData({});
            setForm({});
            // let n_obj = {};
            // for (const key in formValidation) {
            //   n_obj[key] = false;
            // }
            setFormValidation({});
          }
        })
        .onServerError((result) => {
          if (closePage) toggleCloseSpinner(false);
          else toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("UPSERT_ITEM_ADD_ON_SERVER_ERROR"),
            },
          });
        })
        .onBadRequest((result) => {
          if (closePage) toggleCloseSpinner(false);
          else toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("UPSERT_ITEM_ADD_ON_BAD_REQUEST"),
            },
          });
        })
        .unAuthorized((result) => {
          if (closePage) toggleCloseSpinner(false);
          else toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "warning",
              message: t("UPSERT_ITEM_ADD_UN_AUTHORIZED"),
            },
          });
        })
        .notFound((result) => {
          if (closePage) toggleCloseSpinner(false);
          else toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "warning",
              message: t("UPSERT_ITEM_ADD_NOT_FOUND"),
            },
          });
        })
        .call(spaceInfo.id, obj);
    } else {
      const obj = {
        contentType: contentType._id,
        fields: form,
      };
      addContent()
        .onOk((result) => {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "success",
              message: t("UPSERT_ITEM_ADD_ON_OK"),
            },
          });
          if (closePage) {
            if (onSubmitClose) onSubmitClose();
          } else {
            if (closePage) toggleCloseSpinner(false);
            else toggleSpinner(false);
            setFormData({});
            setForm({});
            // let n_obj = {};
            // for (const key in formValidation) {
            //   n_obj[key] = false;
            // }
            setFormValidation({});
          }
        })
        .onServerError((result) => {
          if (closePage) toggleCloseSpinner(false);
          else toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("UPSERT_ITEM_ADD_ON_SERVER_ERROR"),
            },
          });
        })
        .onBadRequest((result) => {
          if (closePage) toggleCloseSpinner(false);
          else toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("UPSERT_ITEM_ADD_ON_BAD_REQUEST"),
            },
          });
        })
        .unAuthorized((result) => {
          if (closePage) toggleCloseSpinner(false);
          else toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "warning",
              message: t("UPSERT_ITEM_ADD_UN_AUTHORIZED"),
            },
          });
        })
        .notFound((result) => {
          if (closePage) toggleCloseSpinner(false);
          else toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "warning",
              message: t("UPSERT_ITEM_ADD_NOT_FOUND"),
            },
          });
        })
        .call(spaceInfo.id, obj);
    }
  }
  return (
    <div className={styles.up_formInputs + " animated fadeIn"}>
      {contentType.fields &&
        contentType.fields.map((field) => (
          <div key={field.id} className={styles.rowItem}>
            {getFieldItem(field)}
          </div>
        ))}
      {!viewMode && (
        <div className={styles.form_submit_btns}>
          {!updateMode && (
            <button
              className="btn btn-primary"
              onClick={() => upsertItem(false)}
              disabled={!isValidForm}
            >
              <CircleSpinner show={spinner} size="small" />
              {!spinner && "Save & New"}
            </button>
          )}
          <button
            className="btn btn-primary "
            onClick={() => upsertItem(true)}
            disabled={!isValidForm}
          >
            <CircleSpinner show={closeSpinner} size="small" />
            {!closeSpinner && (updateMode ? "Update & Close" : "Save & Close")}
          </button>
          {updateMode && (
            <button
              className="btn btn-primary "
              onClick={() => upsertItem(true, true)}
              disabled={!isValidForm}
            >
              {publishSpinner ? (
                <CircleSpinner show={publishSpinner} size="small" />
              ) : (
                "Update & Publish"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
export default Form;

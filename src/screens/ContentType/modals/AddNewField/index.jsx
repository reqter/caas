import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { languageManager, utility, useGlobalState } from "../../../../services";
import { CheckBox, CircleSpinner } from "../../../../components";
import { updateContentType } from "../../../../Api/contentType-api";
import "./styles.scss";

const fields = [
  {
    name: "string",
    title: languageManager.translate("FIELD_TYPE_TEXT"),
    description: languageManager.translate("FIELD_TYPE_TEXT_INFO"),
    icon: "icon-file-text",
    appearance: "text",
  },
  {
    name: "number",
    title: languageManager.translate("FIELD_TYPE_NUMBER"),
    description: languageManager.translate("FIELD_TYPE_NUMBER_INFO"),
    icon: "icon-number",
    appearance: "default",
  },
  {
    name: "dateTime",
    title: languageManager.translate("FIELD_TYPE_DATE_TIME"),
    description: languageManager.translate("FIELD_TYPE_DATE_TIME_INFO"),
    icon: "icon-calendar",
    appearance: "default",
  },
  {
    name: "location",
    title: languageManager.translate("FIELD_TYPE_LOCATION"),
    description: languageManager.translate("FIELD_TYPE_LOCATION_INFO"),
    icon: "icon-location",
    appearance: "default",
  },
  {
    name: "media",
    title: languageManager.translate("FIELD_TYPE_MEDIA"),
    description: languageManager.translate("FIELD_TYPE_MEDIA_INFO"),
    icon: "icon-images",
    appearance: "default",
  },
  {
    name: "boolean",
    title: languageManager.translate("FIELD_TYPE_BOOLEAN"),
    description: languageManager.translate("FIELD_TYPE_BOOLEAN_INFO"),
    icon: "icon-boolean",
    appearance: "default",
  },
  {
    name: "keyValue",
    title: languageManager.translate("FIELD_TYPE_KEY_VALUE"),
    description: languageManager.translate("FIELD_TYPE_KEY_VALUE_INFO"),
    icon: "icon-combo-box",
    appearance: "default",
  },
  {
    name: "richText",
    title: languageManager.translate("FIELD_TYPE_RICH_TEXT"),
    description: languageManager.translate("FIELD_TYPE_RICH_TEXT_INFO"),
    icon: "icon-file-text-o",
    appearance: "default",
  },
  {
    name: "jsonObject",
    title: languageManager.translate("FIELD_TYPE_OBJECT"),
    description: languageManager.translate("FIELD_TYPE_OBJECT_INFO"),
    icon: "icon-json-file",
  },
  {
    name: "reference",
    title: languageManager.translate("FIELD_TYPE_REFERENCE"),
    description: languageManager.translate("FIELD_TYPE_REFERENCE_INFO"),
    icon: "icon-reference",
    appearance: "default",
  },
];
const translatableFields = ["string", "media", "richText"];
const reservedWords = [
  "guid",
  "sys",
  "contentType",
  "category",
  "fields",
  "status",
];
const AddNewField = props => {
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const { selectedContentType } = props;

  const [isOpen, toggleModal] = useState(true);
  const nameInput = useRef(null); //  ref is defined here
  const [tab, changeTab] = useState(1);
  const [newFieldHeaderTitle, setAddFieldHeaderTitle] = useState(
    languageManager.translate("CONTENT_TYPE_ADD_FIELD_TITLE")
  );
  const [selectedField, setField] = useState({});
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [translation, toggleTranslation] = useState(false);
  const [spinner, toggleSpinner] = useState(false);
  const [configSpinner, toggleConfigSpinner] = useState(false);

  useEffect(() => {
    return () => {
      if (!props.isOpen) toggleModal(false);
    };
  });
  useEffect(() => {
    if (tab === 2) {
      nameInput.current.focus();
    }
  }, [tab]);
  function closeAddFieldModal(params) {
    props.onCloseModal();
  }
  function handleChooseField(field) {
    changeTab(2);
    setField(field);
    const title =
      languageManager.translate("CONTENT_TYPE_ADD_FIELD_CHOOSEN") +
      " " +
      field.title;
    setAddFieldHeaderTitle(title);
    //nameInput.current.focus(); // focus after changing tab on first input
  }
  function backToFields(params) {
    if (!spinner && !configSpinner) {
      const title = languageManager.translate("CONTENT_TYPE_ADD_FIELD_CHOOSEN");
      setAddFieldHeaderTitle(title);
      changeTab(1);
    }
  }
  function handleNameChanged(e) {
    setName(e.target.value);
  }
  function handleTitleChanged(e) {
    setTitle(e.target.value);
  }
  function handleDescriptionChanged(e) {
    setDescription(e.target.value);
  }

  function addField(e, showConfig) {
    if (!spinner && !configSpinner) {
      if (showConfig) {
        toggleConfigSpinner(true);
      } else {
        toggleSpinner(true);
      }
      const obj = {
        name: name.toLowerCase(),
        title: utility.applyeLangs(title),
        description: utility.applyeLangs(description),
        type: selectedField.name,
        isTranslate: translation,
        appearance: selectedField.appearance,
      };
      const newContentType = { ...selectedContentType };
      if (newContentType.fields === undefined) newContentType.fields = [];
      newContentType.fields.push(obj);
      updateContentType()
        .onOk(result => {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "success",
              message: languageManager.translate(
                "CONTENT_TYPE_ADD_FIELD_ON_OK"
              ),
            },
          });
          dispatch({
            type: "UPDATE_CONTENT_TYPE",
            value: result,
          });
          props.onCloseModal({ field: obj, showConfig: showConfig });
        })
        .onServerError(result => {
          if (showConfig) {
            toggleConfigSpinner(false);
          } else {
            toggleSpinner(false);
          }
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: languageManager.translate(
                "CONTENT_TYPE_ADD_FIELD_ON_SERVER_ERROR"
              ),
            },
          });
        })
        .onBadRequest(result => {
          if (showConfig) {
            toggleConfigSpinner(false);
          } else {
            toggleSpinner(false);
          }
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: languageManager.translate(
                "CONTENT_TYPE_ADD_FIELD_ON_BAD_REQUEST"
              ),
            },
          });
        })
        .unAuthorized(result => {
          if (showConfig) {
            toggleConfigSpinner(false);
          } else {
            toggleSpinner(false);
          }
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "warning",
              message: languageManager.translate(
                "CONTENT_TYPE_ADD_FIELD_UN_AUTHORIZED"
              ),
            },
          });
        })
        .call(spaceInfo.id, newContentType);
    }
  }
  function addField_configure() {
    addField(undefined, true);
  }
  function checkName() {
    return props.fields.find(f => f.name === name);
  }
  return (
    <Modal isOpen={isOpen} toggle={closeAddFieldModal} size="lg">
      <ModalHeader toggle={closeAddFieldModal}>
        {newFieldHeaderTitle}
      </ModalHeader>
      <ModalBody>
        <div className="c-category-addField-body">
          {tab === 1 && (
            <div className="fieldsTab">
              {fields.map(field => (
                <div
                  key={field.icon}
                  className="add-field-types"
                  onClick={() => handleChooseField(field)}
                >
                  <div className="add-field-icon">
                    <i className={field.icon} />
                  </div>
                  <span className="title">{field.title}</span>
                  <span className="description">{field.description}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 2 && (
            <Form className="formTab">
              <div className="row">
                <div className="form-group col">
                  <label>
                    {languageManager.translate(
                      "CONTENT_TYPE_ADD_FIELD_MODAL_NAME"
                    )}
                  </label>
                  <input
                    ref={nameInput} // using ref
                    type="text"
                    className="form-control"
                    placeholder={languageManager.translate(
                      "CONTENT_TYPE_ADD_FIELD_MODAL_NAME_PLACEHOLDER"
                    )}
                    value={name}
                    required
                    onChange={handleNameChanged}
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate(
                      "CONTENT_TYPE_ADD_FIELD_MODAL_NAME_INFO"
                    )}
                  </small>
                </div>

                <FormGroup className="col">
                  <Label>
                    {languageManager.translate(
                      "CONTENT_TYPE_ADD_FIELD_MODAL_TITLE"
                    )}
                  </Label>
                  <Input
                    type="string"
                    value={title}
                    placeholder={languageManager.translate(
                      "CONTENT_TYPE_ADD_FIELD_MODAL_TITLE_PLACEHOLDER"
                    )}
                    onChange={handleTitleChanged}
                  />
                  <small id="emailHelp" className="form-text text-muted">
                    {languageManager.translate(
                      "CONTENT_TYPE_ADD_FIELD_MODAL_TITLE_INFO"
                    )}
                  </small>
                </FormGroup>
              </div>

              <div className="formTab-row">
                <FormGroup>
                  <Label>
                    {languageManager.translate(
                      "CONTENT_TYPE_ADD_FIELD_MODAL_DESCRIPTION"
                    )}
                  </Label>
                  <Input
                    type="string"
                    value={description}
                    placeholder={languageManager.translate(
                      "CONTENT_TYPE_ADD_FIELD_MODAL_DESCRIPTION_PLACEHOLDER"
                    )}
                    onChange={handleDescriptionChanged}
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate(
                      "CONTENT_TYPE_ADD_FIELD_MODAL_DESCRIPTION_INFO"
                    )}
                  </small>
                </FormGroup>
                {translatableFields.indexOf(selectedField.name) > -1 && (
                  <CheckBox
                    title={languageManager.translate("TRANSLATION")}
                    value={translation}
                    onChange={e => toggleTranslation(e.target.checked)}
                  />
                )}
              </div>
            </Form>
          )}
        </div>
      </ModalBody>
      {tab !== 1 ? (
        <ModalFooter>
          <Button
            color="primary"
            onClick={addField}
            disabled={
              name.length > 0 &&
              title.length > 0 &&
              !name.includes(" ") &&
              !reservedWords.includes(name) &&
              !checkName()
                ? false
                : true
            }
          >
            <CircleSpinner show={spinner} size="small" />
            {!spinner &&
              languageManager.translate(
                "CONTENT_TYPE_ADD_FIELD_MODAL_CREATE_BTN"
              )}
          </Button>
          <Button
            color="primary"
            onClick={addField_configure}
            disabled={
              name.length > 0 &&
              title.length > 0 &&
              !name.includes(" ") &&
              !reservedWords.includes(name) &&
              !checkName()
                ? false
                : true
            }
          >
            <CircleSpinner show={configSpinner} size="small" />
            {!configSpinner &&
              languageManager.translate(
                "CONTENT_TYPE_ADD_FIELD_MODAL_CREATE_CONFIG_BTN"
              )}
          </Button>
          <Button color="secondary" onClick={backToFields}>
            {languageManager.translate(
              "CONTENT_TYPE_ADD_FIELD_MODAL_CHNAGE_FIELD_BTN"
            )}
          </Button>
        </ModalFooter>
      ) : (
        undefined
      )}
    </Modal>
  );
};

export default AddNewField;

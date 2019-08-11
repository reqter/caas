import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { Modal, ModalFooter } from "reactstrap";
import { languageManager, useGlobalState, utility } from "../../../../services";
import { updateContentType } from "../../../../Api/contentType-api";
import "./styles.scss";
import { CircleSpinner } from "../../../../components";

const acceptedMediaTypes = [
  {
    id: 1,
    name: "all",
    title: "All Files"
  },
  {
    id: 2,
    name: "image",
    title: "Image"
  },
  {
    id: 3,
    name: "video",
    title: "Video"
  },
  {
    id: 4,
    name: "audio",
    title: "Audio"
  },
  {
    id: 5,
    name: "pdf",
    title: "PDF"
  },
  {
    id: 6,
    name: "spreadsheet",
    title: "Spreadsheet"
  }
];
const translatableFields = ["string", "media", "richText"];
const fieldsApearance = {
  string: [
    { name: "text", title: { en: "Text" }, apearance: "", selected: true },
    { name: "email", title: { en: "Email" }, apearance: "" },
    { name: "password", title: { en: "Password" }, apearance: "" },
    { name: "url", title: { en: "URL" }, apearance: "" },
    { name: "phoneNumber", title: { en: "Phone Number" }, apearance: "" }
  ],
  number: [
    { name: "number", title: { en: "Number" }, apearance: "", selected: true },
    {
      name: "rangeSlider",
      title: { en: "Range Slider", fa: "" },
      apearance: ""
    }
  ]
};

const currentLang = languageManager.getCurrentLanguage().name;
const FieldConfig = props => {
  //#region variables
  const { selectedContentType } = props;
  const [{ contentTypes, spaceInfo }, dispatch] = useGlobalState();
  const { selectedField } = props;

  const [spinner, toggleSpinner] = useState(false);
  const [fieldsUI, setFieldsUI] = useState(() => {
    if (fieldsApearance[selectedField.type] === undefined) return undefined;
    let items = JSON.parse(JSON.stringify(fieldsApearance[selectedField.type]));
    if (
      selectedField.appearance === undefined ||
      selectedField.appearance === "default"
    )
      return items;
    for (let i = 0; i < items.length; i++) {
      items[i].selected = false;
      if (items[i].name === selectedField.appearance) items[i].selected = true;
    }
    return items;
  });
  const [isOpen, toggleModal] = useState(true);
  const [tab, changeTab] = useState(1);
  const [name] = useState(selectedField.name);
  const [title, setTitle] = useState(
    selectedField.title ? selectedField.title[currentLang] : ""
  );
  const [description, setDescription] = useState(
    selectedField.description ? selectedField.description[currentLang] : ""
  );
  const [translation, toggleTranslation] = useState(selectedField.isTranslate);

  const [isRequired, toggleRequired] = useState(
    selectedField.isRequired === true ? true : false
  );

  const [textLimit, setTextLimit] = useState({
    checked: selectedField.limit ? true : false,
    type: selectedField.limit ? selectedField.limit.type : "between",
    min: selectedField.limit ? selectedField.limit.min : undefined,
    max: selectedField.limit ? selectedField.limit.max : undefined
  });
  const [numberLimitChecked, toggleNumberLimitChecked] = useState(
    selectedField.limit ? true : false
  );
  const [numberLimitType, setNumberLimitType] = useState(
    selectedField.limit ? selectedField.limit.type : "between"
  );
  const [numberLimitMin, setNumberLimitMin] = useState(
    selectedField.limit ? selectedField.limit.min : undefined
  );
  const [numberLimitMax, setNumberLimitMax] = useState(
    selectedField.limit ? selectedField.limit.max : undefined
  );
  const [matchRegex, toggleMatchRegex] = useState(
    selectedField.pattern ? true : false
  );
  const [matchRegexValue, setMatchRegexValue] = useState(
    selectedField.pattern ? selectedField.pattern : ""
  );

  const [imageUploadMethod, setImageUploadMethod] = useState(
    selectedField.isList === true ? "manyFiles" : "oneFile"
  );
  const [referenceChooseType, setReferenceChooseType] = useState(
    selectedField.isList === true ? "multiSelect" : "single"
  );
  const [pickerType, setPickerType] = useState(
    selectedField.type === "keyValue" && selectedField.isList === true
      ? "multiSelect"
      : "single"
  );
  const [mediaTypeVisibility, toggleMediaType] = useState(
    selectedField.type === "media" ? true : false
  );
  const [mediaType, setMediaType] = useState(
    selectedField.type === "media"
      ? () => {
          if (
            selectedField.mediaType === undefined ||
            selectedField.mediaType.length === 0
          ) {
            let m = JSON.parse(JSON.stringify(acceptedMediaTypes));
            m[0].selected = true;
            return m;
          } else {
            let m = JSON.parse(JSON.stringify(acceptedMediaTypes));
            for (let j = 0; j < m.length; j++) {
              for (let i = 0; i < selectedField.mediaType.length; i++) {
                const type = selectedField.mediaType[i];
                if (m[j].name === type) {
                  m[j].selected = true;
                }
              }
            }
            return m;
          }
        }
      : []
  );

  const [referenceContentTypeChk, toggleReferenceContentType] = useState(
    selectedField.type === "reference"
      ? () => {
          if (selectedField.references === undefined) {
            return false;
          } else return true;
        }
      : false
  );

  const [selectedRefContentType, setRefContentType] = useState(
    selectedField.type === "reference"
      ? () => {
          let d = [];
          if (
            selectedField.references === undefined ||
            selectedField.references.length === 0
          ) {
            return;
          } else {
            for (let j = 0; j < contentTypes.length; j++) {
              for (let i = 0; i < selectedField.references.length; i++) {
                const r_id = selectedField.references[i];
                if (contentTypes[j]._id === r_id) {
                  return contentTypes[j];
                }
              }
            }
          }
        }
      : undefined
  );
  const [selectedRefContentTypeFields, setRefFields] = useState(
    selectedField.type === "reference"
      ? () => {
          let d = [];
          if (
            selectedField.references === undefined ||
            selectedField.references.length === 0
          ) {
            return;
          } else {
            for (let j = 0; j < contentTypes.length; j++) {
              for (let i = 0; i < selectedField.references.length; i++) {
                const r_id = selectedField.references[i];
                if (contentTypes[j]._id === r_id) {
                  const item = contentTypes[j];
                  return item.fields.map(f => {
                    f.value = f.name;
                    return f;
                  });
                }
              }
            }
          }
        }
      : undefined
  );
  const [refVisibleFields, setRefVisibleFields] = useState();
  const [refValue, setRefValue] = useState();

  const [helpText, setHelpText] = useState(
    selectedField.helpText ? selectedField.helpText : ""
  );
  const [inVisible, toggleInVisible] = useState(
    selectedField.inVisible ? selectedField.inVisible : false
  );
  const [textDefaultValue, setTextDefaultValue] = useState(
    selectedField.type === "string"
      ? selectedField.defaultValue
        ? selectedField.defaultValue
        : ""
      : ""
  );
  const [numberDefaultValue, setNumberDefaultValue] = useState(
    selectedField.type === "number"
      ? selectedField.defaultValue
        ? selectedField.defaultValue
        : ""
      : ""
  );
  const [dateDefaultValue, toggleDateDefaultValue] = useState(
    selectedField.type === "dateTime"
      ? selectedField.showCurrent
        ? selectedField.showCurrent
        : false
      : false
  );
  const [dateDisablePast, toggleDateDisablePast] = useState(
    selectedField.type === "dateTime"
      ? selectedField.disablePastDates
        ? selectedField.disablePastDates
        : false
      : false
  );
  const [isMultiLine, toggleMultiLine] = useState(
    selectedField.type === "string"
      ? selectedField.isMultiLine
        ? selectedField.isMultiLine
        : false
      : false
  );
  const [dateTimeFormat, toggleDateFormat] = useState(
    selectedField.type === "dateTime"
      ? selectedField.format
        ? selectedField.format
        : "dateTime"
      : "dateTime"
  );
  const [latitude, setLatitude] = useState(
    selectedField.type === "location"
      ? selectedField.defaultValue
        ? selectedField.defaultValue.latitude
        : ""
      : ""
  );
  const [longitude, setLongitude] = useState(
    selectedField.type === "location"
      ? selectedField.defaultValue
        ? selectedField.defaultValue.longitude
        : ""
      : ""
  );
  const [booleanDefaultValue, setBooleanDefaultValue] = useState(
    selectedField.type === "boolean"
      ? selectedField.defaultValue !== undefined
        ? selectedField.defaultValue
        : false
      : false
  );
  const [options, setOptions] = useState(
    selectedField.type === "keyValue"
      ? selectedField.options !== undefined && selectedField.options.length > 0
        ? selectedField.options
        : [{ value: "", selected: false }]
      : [{ value: "", selected: false }]
  );
  //#endregion variables

  useEffect(() => {
    return () => {
      if (!props.isOpen) {
        toggleModal(false);
      }
    };
  });

  //#region methods
  function closeModal(params) {
    props.onCloseModal();
  }
  function handleTextDefaultValue(e) {
    setTextDefaultValue(e.target.value);
  }
  function handleNumberDefaultValue(e) {
    setNumberDefaultValue(e.target.value);
  }
  function handleDateDefaultValue(e) {
    toggleDateDefaultValue(e.target.checked);
  }
  function handleDateDisablePast(e) {
    toggleDateDisablePast(e.target.checked);
  }
  function handleMultiLineChanged(e) {
    toggleMultiLine(e.target.checked);
  }
  function handleChangeTitle(e) {
    setTitle(e.target.value);
  }
  function handleDescriptionChanged(e) {
    setDescription(e.target.value);
  }
  function handleLatitudeChange(e) {
    setLatitude(e.target.value);
  }
  function handleLongitudeChange(e) {
    setLongitude(e.target.value);
  }
  function handleChangeTranslation(e) {
    toggleTranslation(e.target.checked);
  }
  function handleRequireCheckBox(e) {
    toggleRequired(e.target.checked);
  }
  function handleTextLimitChanged(e) {
    const obj = { ...textLimit, checked: e.target.checked };
    setTextLimit(obj);
  }

  function handleTextLimitTypeChanged(e) {
    const type = e.target.value;
    setTextLimit({ checked: true, type, min: "", max: "" });
  }
  function handleTextLimitMinimum(e) {
    const min = e.target.value;
    let max = textLimit.max;
    let obj;

    if (
      !max ||
      parseInt(min) > parseInt(max) ||
      parseInt(min) === parseInt(max)
    ) {
      max = parseInt(min) + 1;
      obj = { ...textLimit, min, max };
    } else {
      obj = { ...textLimit, min };
    }
    setTextLimit(obj);
  }
  let timer;
  function handleTextLimitMaximum(e) {
    clearTimeout(timer);
    const max = e.target.value;
    let obj = { ...textLimit, max };
    setTextLimit(obj);
    // let v = e.target.value;
    // timer = setTimeout(() => checkTextMaxValue(v), 2000);
  }
  function checkTextMaxValue(max) {
    let obj = { ...textLimit, max };
    setTextLimit(obj);
    let min = textLimit.min;
    if (min && parseInt(min) > parseInt(max)) {
      var m = parseInt(min) + 1;
      const obj1 = { ...textLimit, max: m };
      setTextLimit(obj1);
    }
  }
  function handleNumberLimitChanged(e) {
    toggleNumberLimitChecked(e.target.checked);
  }
  function handleNumberLimitTypeChanged(e) {
    setNumberLimitType(e.target.value);
    setNumberLimitMin("");
    setNumberLimitMax("");
  }
  function handleNumberLimitMinimum(e) {
    if (
      !numberLimitMax ||
      parseInt(e.target.value) > parseInt(numberLimitMax) ||
      parseInt(e.target.value) === parseInt(numberLimitMax)
    )
      setNumberLimitMax(parseInt(e.target.value) + 1);

    setNumberLimitMin(e.target.value);
  }

  function handleNumberLimitMaximum(e) {
    // if (numberLimitMin && parseInt(numberLimitMin) > parseInt(e.target.value)) {
    //   setNumberLimitMax(
    //     Math.max(
    //       parseInt(numberLimitMin) + 1,
    //       parseInt(e.target.value)
    //     ).toString()
    //   );
    // } else setNumberLimitMax(e.target.value)
    setNumberLimitMax(e.target.value);
  }
  function handleRegexChanged(e) {
    toggleMatchRegex(e.target.checked);
  }
  function handleMatchRegexValueChanged(e) {
    setMatchRegexValue(e.target.value);
  }
  function handleImageUploadMethod(e) {
    setImageUploadMethod(e.target.value);
  }
  function handleReferencechooseType(e) {
    setReferenceChooseType(e.target.value);
  }
  function handlePickerChooseType(e) {
    setPickerType(e.target.value);
    if (options.length > 0) {
      let isFind = false;
      const op = options.map(opt => {
        if (isFind) delete opt.selected;
        else if (opt.selected === true) isFind = true;
        return opt;
      });
      setOptions(op);
    }
  }
  function handleReferenceChk(e) {
    toggleReferenceContentType(e.target.checked);
  }
  function getRefDefaults() {
    let arr = [];
    if (!selectedField.references || selectedField.references.length === 0)
      return;
    else {
      if (
        !selectedField.refVisibleFields ||
        selectedField.refVisibleFields.length === 0
      )
        return;
      for (let j = 0; j < contentTypes.length; j++) {
        for (let i = 0; i < selectedField.references.length; i++) {
          const r_id = selectedField.references[i];
          if (contentTypes[j]._id === r_id) {
            const item = contentTypes[j];
            for (let k = 0; k < selectedField.refVisibleFields.length; k++) {
              for (let l = 0; l < item.fields.length; l++) {
                if (selectedField.refVisibleFields[k] === item.fields[l].name) {
                  const obj = {
                    value: item.fields[l].name,
                    ...item.fields[l]
                  };
                  arr.push(obj);
                  break;
                }
              }
            }
          }
        }
      }
    }
    return arr;
  }
  function handleRefSelect(item) {
    if (!selectedRefContentType || selectedRefContentType._id !== item._id) {
      setRefContentType(item);
      const fields = item.fields.map(f => {
        f.value = f.name;
        return f;
      });
      setRefFields(fields);
      setRefValue(null);
    }
  }
  function handleRefVisibleFieldsChange(items) {
    setRefVisibleFields(items);
  }
  function handleHelpTextchanged(e) {
    setHelpText(e.target.value);
  }
  function handleToggleInVisible(e) {
    toggleInVisible(e.target.checked);
  }
  function setAppearance(ui) {
    const f_uis = fieldsUI.map(item => {
      item.selected = false;
      if (item.name === ui.name) item.selected = true;
      return item;
    });
    setFieldsUI(f_uis);
  }
  function handleSelectMediaType(type) {
    let m;
    if (type.name === "all") {
      m = mediaType.map(c => {
        c.selected = false;
        if (type.name === c.name) {
          c.selected = !c.selected;
        }
        return c;
      });
    } else {
      m = mediaType.map(c => {
        if (type.name === c.name) {
          c.selected = !c.selected;
        }
        return c;
      });
      if (m[0].selected === true) m[0].selected = false;
    }
    setMediaType(m);
  }
  function addNewOption() {
    let opts = [...options];
    opts.push({
      value: "",
      selected: false
    });
    setOptions(opts);
  }
  function handleOptionValueChanged(e, index) {
    const opts = options.map((item, i) => {
      if (i === index) item.value = e.target.value;
      return item;
    });
    setOptions(opts);
  }
  function removeOption(item, index) {
    if (options.length > 1) {
      const opts = options.filter((item, i) => i !== index);
      setOptions(opts);
    }
  }
  function setSelectedOption(item, index) {
    if (pickerType === "multiSelect") {
      const opts = options.map((item, i) => {
        if (i === index) item.selected = !item.selected;
        return item;
      });
      setOptions(opts);
    } else {
      const opts = options.map((item, i) => {
        delete item.selected;
        if (i === index) item.selected = true;
        return item;
      });
      setOptions(opts);
    }
  }
  function update() {
    if (!spinner) {
      toggleSpinner(true);
      let obj = {
        ...selectedField
      };
      obj["title"] = utility.applyeLangs(title);
      obj["description"] = utility.applyeLangs(description);
      obj["isTranslate"] = translation;
      obj["isRequired"] = isRequired;
      obj["inVisible"] = inVisible;
      obj["appearance"] = !fieldsUI
        ? selectedField.appearance
          ? selectedField.appearance
          : "default"
        : fieldsUI.find(ui => ui.selected).name;
      if (helpText.length > 0) obj["helpText"] = utility.applyeLangs(helpText);
      if (selectedField.type !== "media" && selectedField.type !== "richText") {
        obj["inVisible"] = inVisible;
      }
      if (selectedField.type === "string") {
        if (textDefaultValue.length > 0) obj["defaultValue"] = textDefaultValue;
        obj["isMultiLine"] = isMultiLine;

        if (textLimit.checked) {
          if (textLimit.type === "between") {
            obj["limit"] = {
              type: textLimit.type,
              min: textLimit.min,
              max: textLimit.max
            };
          } else {
            if (textLimit.type === "atLeast") {
              obj["limit"] = {
                type: textLimit.type,
                min: textLimit.min
              };
            } else {
              obj["limit"] = {
                type: textLimit.type,
                max: textLimit.max
              };
            }
          }
        } else {
          delete obj["limit"];
        }
        if (matchRegex) {
          obj["pattern"] = matchRegexValue;
        } else {
          delete obj["pattern"];
        }
      }
      if (selectedField.type === "number") {
        if (numberDefaultValue.length > 0)
          obj["defaultValue"] = numberDefaultValue;
        if (numberLimitChecked) {
          if (numberLimitType === "between") {
            obj["limit"] = {
              type: numberLimitType,
              min: numberLimitMin,
              max: numberLimitMax
            };
          } else {
            if (textLimit.type === "greatEqual") {
              obj["limit"] = {
                type: numberLimitType,
                min: numberLimitMin
              };
            } else {
              obj["limit"] = {
                type: numberLimitType,
                max: numberLimitMax
              };
            }
          }
        } else {
          delete obj["limit"];
        }
        if (matchRegex) {
          obj["pattern"] = matchRegexValue;
        } else {
          delete obj["pattern"];
        }
      }
      if (selectedField.type === "dateTime") {
        obj["showCurrent"] = dateDefaultValue;
        obj["format"] = dateTimeFormat;
        obj["disablePastDates"] = dateDisablePast;
      }
      if (selectedField.type === "location") {
        if (latitude.length > 0 && longitude.length > 0) {
          obj["defaultValue"] = {
            latitude: latitude,
            longitude: longitude
          };
        }
      }
      if (selectedField.type === "boolean") {
        obj["defaultValue"] = booleanDefaultValue;
      }
      if (selectedField.type === "keyValue") {
        obj["isList"] = pickerType === "single" ? false : true;
        obj["options"] = options.filter(item => item.value.length > 0);
      }
      if (selectedField.type === "media") {
        obj["isList"] = imageUploadMethod === "oneFile" ? false : true;
        if (mediaTypeVisibility) {
          let r = [];
          for (let i = 0; i < mediaType.length; i++) {
            const type = mediaType[i];
            if (type.name !== "all" && type.selected === true) {
              r.push(type.name);
            }
          }
          obj["mediaType"] = r.length > 0 ? r : undefined;
        } else {
          obj["mediaType"] = undefined;
        }
      } else if (selectedField.type === "reference") {
        obj["isList"] = referenceChooseType === "single" ? false : true;
        if (selectedRefContentType) {
          let arr = [];
          // for (let i = 0; i < refContentTypes.length; i++) {
          //   const item = refContentTypes[i];
          //   if (item.selected === true) {
          //     arr.push(item._id);
          //   }
          // }
          arr.push(selectedRefContentType._id);
          obj["references"] = arr;
          if (refVisibleFields && refVisibleFields.length > 0) {
            let arr_fields = [];
            for (let i = 0; i < refVisibleFields.length; i++) {
              const item = refVisibleFields[i];
              arr_fields.push(item.value);
            }
            obj["refVisibleFields"] = arr_fields;
          }
        }
      }
      const newContentType = { ...selectedContentType };
      const newFields = newContentType.fields.map(f => {
        if (f.name === selectedField.name) f = obj;
        return f;
      });
      newContentType.fields = newFields;
      updateContentType()
        .onOk(result => {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "success",
              message: languageManager.translate(
                "CONTENT_TYPE_UPDATE_FIELD_ON_OK"
              )
            }
          });
          dispatch({
            type: "UPDATE_CONTENT_TYPE",
            value: result
          });
          props.onCloseModal(obj);
        })
        .onServerError(result => {
          toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: languageManager.translate(
                "CONTENT_TYPE_UPDATE_FIELD_ON_BAD_REQUEST"
              )
            }
          });
        })
        .onBadRequest(result => {
          toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: languageManager.translate(
                "CONTENT_TYPE_UPDATE_FIELD_UN_AUTHORIZED"
              )
            }
          });
        })
        .unAuthorized(result => {
          toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "warning",
              message: languageManager.translate(
                "CONTENT_TYPE_UPDATE_FIELD_UN_AUTHORIZED"
              )
            }
          });
        })
        .notFound(result => {
          toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "warning",
              message: languageManager.translate(
                "CONTENT_TYPE_UPDATE_FIELD_NOT_FOUND"
              )
            }
          });
        })
        .call(spaceInfo.id, newContentType);
    }
  }
  //#endregion methods
  return (
    <Modal isOpen={isOpen} toggle={closeModal} size="lg">
      <div className="fieldConfig">
        <div className="fieldConfig-header">
          <div className="left">
            <i
              className={
                selectedField.type === "string"
                  ? "icon-file-text icon"
                  : selectedField.type === "number"
                  ? "icon-number icon"
                  : selectedField.type === "dateTime"
                  ? "icon-calendar icon"
                  : selectedField.type === "location"
                  ? "icon-location icon"
                  : selectedField.type === "media"
                  ? "icon-images icon"
                  : selectedField.type === "jsonObject"
                  ? "icon-json-file icon"
                  : selectedField.type === "reference"
                  ? "icon-reference icon"
                  : selectedField.type === "boolean"
                  ? "icon-boolean icon"
                  : "icon-file-text icon"
              }
            />
            <span className="fieldName">{selectedField.name}</span>
            <span className="fieldType">{selectedField.type}</span>
          </div>
          <div className="right">
            <div
              className="tabItem"
              style={{
                background: tab === 1 ? "white" : "whitesmoke"
              }}
              onClick={() => changeTab(1)}
            >
              Settings
            </div>
            <div
              className="tabItem"
              style={{
                background: tab === 2 ? "white" : "whitesmoke"
              }}
              onClick={() => changeTab(2)}
            >
              Validations
            </div>
            <div
              className="tabItem"
              style={{
                background: tab === 3 ? "white" : "whitesmoke"
              }}
              onClick={() => changeTab(3)}
            >
              Appearance
            </div>
          </div>
        </div>
        <div className="body">
          {tab === 1 && (
            <div className="firstTab">
              <div className="row">
                <div className="form-group col">
                  <label>{languageManager.translate("NAME")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    readOnly
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate(
                      "CONTENT_TYPE_ADD_FIELD_MODAL_NAME_INFO"
                    )}
                  </small>
                </div>
                <div className="form-group col">
                  <label>{languageManager.translate("TITLE")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={handleChangeTitle}
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate("TITLE_INFO")}
                  </small>
                </div>
              </div>
              <div className="row">
                <div className="form-group col">
                  <label>{languageManager.translate("Description")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={description}
                    onChange={handleDescriptionChanged}
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate("field description")}
                  </small>
                </div>
              </div>
              {selectedField.type === "location" && (
                <div className="row">
                  <div className="form-group col">
                    <label>
                      {languageManager.translate("FIELD_LOCATION_LATITUDE")}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={latitude}
                      onChange={handleLatitudeChange}
                    />
                    <small className="form-text text-muted">
                      {languageManager.translate(
                        "FIELD_LOCATION_LATITUDE_INFO"
                      )}
                    </small>
                  </div>
                  <div className="form-group col">
                    <label>
                      {languageManager.translate("FIELD_LOCATION_LONGITUDE")}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={longitude}
                      onChange={handleLongitudeChange}
                    />
                    <small className="form-text text-muted">
                      {languageManager.translate(
                        "FIELD_LOCATION_LONGITUDE_INFO"
                      )}
                    </small>
                  </div>
                </div>
              )}
              {selectedField.type === "string" && (
                <div className="form-group">
                  <label>
                    {languageManager.translate("DEFAULT_VALUE_TEXT")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={textDefaultValue}
                    onChange={handleTextDefaultValue}
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate("DEFAULT_VALUE_TEXT_INFO")}
                  </small>
                </div>
              )}
              {selectedField.type === "number" && (
                <div className="form-group">
                  <label>
                    {languageManager.translate("DEFAULT_VALUE_NUMBER")}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={numberDefaultValue}
                    onChange={handleNumberDefaultValue}
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate("DEFAULT_VALUE_NUMBER_INFO")}
                  </small>
                </div>
              )}
              {selectedField.type === "boolean" && (
                <div
                  className="inputSwitch"
                  style={{
                    marginBottom: 20
                  }}
                >
                  <span>
                    {languageManager.translate("FIELD_BOOLEAN_DEFAULT_VALUE")}
                  </span>
                  <span>
                    {languageManager.translate(
                      "FIELD_BOOLEAN_DEFAULT_VALUE_INFO"
                    )}
                  </span>
                  <div className="inputSwitch-content">
                    <button
                      className={
                        "btn btn-sm " +
                        (booleanDefaultValue ? "btn-primary" : "btn-light")
                      }
                      onClick={() => setBooleanDefaultValue(true)}
                    >
                      {languageManager.translate("TRUE")}
                    </button>
                    <button
                      className={
                        "btn btn-sm " +
                        (!booleanDefaultValue ? "btn-primary" : "btn-light")
                      }
                      onClick={() => setBooleanDefaultValue(false)}
                    >
                      {languageManager.translate("FALSE")}
                    </button>
                  </div>
                </div>
              )}
              {/* <div className="custom_checkbox">
                <div className="left">
                  <label className="checkBox">
                    <input
                      type="checkbox"
                      id="invisible"
                      checked={inVisible}
                      onChange={handleToggleInVisible}
                    />
                    <span className="checkmark" />
                  </label>
                </div>
                <div className="right">
                  <label htmlFor="isName">
                    {languageManager.translate("Is Name")}
                  </label>
                  <label htmlFor="invisible">
                    {languageManager.translate("")}
                  </label>
                </div>
              </div> */}
              {/* {selectedField.type !== "media" &&
                selectedField.type !== "richText" && ( */}

              <div className="custom_checkbox">
                <div className="left">
                  <label className="checkBox">
                    <input
                      type="checkbox"
                      id="invisible"
                      checked={inVisible}
                      onChange={handleToggleInVisible}
                    />
                    <span className="checkmark" />
                  </label>
                </div>
                <div className="right">
                  <label htmlFor="invisible">
                    {languageManager.translate("FIELD_INVISIBLE")}
                  </label>
                  <label htmlFor="invisible">
                    {languageManager.translate("FIELD_INVISIBLE_INFO")}
                  </label>
                </div>
              </div>
              {/*  )} */}
              {translatableFields.indexOf(selectedField.type) > -1 && (
                <div className="custom_checkbox">
                  <div className="left">
                    <label className="checkBox">
                      <input
                        type="checkbox"
                        id="localization"
                        checked={translation}
                        onChange={handleChangeTranslation}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="right">
                    <label htmlFor="localization">
                      {languageManager.translate("TRANSLATION")}
                    </label>
                    <label>
                      {languageManager.translate("TRANSLATION_INFO")}
                    </label>
                  </div>
                </div>
              )}
              {selectedField.type === "dateTime" && (
                <>
                  <div className="custom_checkbox">
                    <div className="left">
                      <label className="checkBox">
                        <input
                          type="checkbox"
                          id="dateShowCurrent"
                          checked={dateDefaultValue}
                          onChange={handleDateDefaultValue}
                        />
                        <span className="checkmark" />
                      </label>
                    </div>
                    <div className="right">
                      <label htmlFor="dateShowCurrent">
                        {languageManager.translate("FIELD_DATE_SHOW_CURRENT")}
                      </label>
                      <label>
                        {languageManager.translate(
                          "FIELD_DATE_SHOW_CURRENT_INFO"
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="custom_checkbox">
                    <div className="left">
                      <label className="checkBox">
                        <input
                          type="checkbox"
                          id="dateDisablePast"
                          checked={dateDisablePast}
                          onChange={handleDateDisablePast}
                        />
                        <span className="checkmark" />
                      </label>
                    </div>
                    <div className="right">
                      <label htmlFor="dateDisablePast">
                        {languageManager.translate("FIELD_DATE_DISABLE_PAST")}
                      </label>
                      <label htmlFor="dateDisablePast">
                        {languageManager.translate(
                          "FIELD_DATE_DISABLE_PAST_INFO"
                        )}
                      </label>
                    </div>
                  </div>
                </>
              )}
              {selectedField.type === "string" && (
                <div className="custom_checkbox">
                  <div className="left">
                    <label className="checkBox">
                      <input
                        type="checkbox"
                        id="multiLine"
                        checked={isMultiLine}
                        onChange={handleMultiLineChanged}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="right">
                    <label htmlFor="multiLine">
                      {languageManager.translate("FIELD_STRING_MULTILINE")}
                    </label>
                    <label htmlFor="multiLine">
                      {languageManager.translate("FIELD_STRING_MULTILINE_INFO")}
                    </label>
                  </div>
                </div>
              )}
              {selectedField.type === "media" && (
                <>
                  <div className="custom_checkbox ">
                    <div className="left">
                      <label className="radio">
                        <input
                          type="radio"
                          value="oneFile"
                          checked={imageUploadMethod === "oneFile"}
                          name="uploadFileMethod"
                          onChange={handleImageUploadMethod}
                          id="oneFileRadio"
                        />
                        <span className="checkround" />
                      </label>
                    </div>
                    <div className="right">
                      <label htmlFor="oneFileRadio">One File</label>
                      <label>
                        Select this if there is only one thing to store For
                        example, a single photo or one PDF file
                      </label>
                    </div>
                  </div>
                  <div className="custom_checkbox">
                    <div className="left">
                      <label className="radio">
                        <input
                          type="radio"
                          value="manyFiles"
                          checked={imageUploadMethod === "manyFiles"}
                          name="uploadFileMethod"
                          onChange={handleImageUploadMethod}
                          id="manyFileRadio"
                        />
                        <span className="checkround" />
                      </label>
                    </div>
                    <div className="right">
                      <label htmlFor="manyFileRadio">Many Files</label>
                      <label>
                        Select this if there are several things to be stored For
                        example, several photos or PDF files
                      </label>
                    </div>
                  </div>
                </>
              )}
              {selectedField.type === "reference" && (
                <>
                  <div className="custom_checkbox ">
                    <div className="left">
                      <label className="radio">
                        <input
                          type="radio"
                          value="single"
                          checked={referenceChooseType === "single"}
                          name="referenceChooseType"
                          onChange={handleReferencechooseType}
                          id="singleRadio"
                        />
                        <span className="checkround" />
                      </label>
                    </div>
                    <div className="right">
                      <label htmlFor="singleRadio">Single Select</label>
                      <label htmlFor="singleRadio">
                        Select this if there is only one thing to store For
                      </label>
                    </div>
                  </div>
                  <div className="custom_checkbox">
                    <div className="left">
                      <label className="radio">
                        <input
                          type="radio"
                          value="multiSelect"
                          checked={referenceChooseType === "multiSelect"}
                          name="referenceChooseType"
                          onChange={handleReferencechooseType}
                          id="multiSelectRadio"
                        />
                        <span className="checkround" />
                      </label>
                    </div>
                    <div className="right">
                      <label htmlFor="multiSelectRadio">Multi Select</label>
                      <label htmlFor="multiSelectRadio">
                        Select this if there are several things to be stored
                      </label>
                    </div>
                  </div>
                </>
              )}
              {selectedField.type === "keyValue" && (
                <>
                  <div className="custom_checkbox ">
                    <div className="left">
                      <label className="radio">
                        <input
                          type="radio"
                          value="single"
                          checked={pickerType === "single"}
                          name="pickerChooseType"
                          onChange={handlePickerChooseType}
                          id="singlePickerRadio"
                        />
                        <span className="checkround" />
                      </label>
                    </div>
                    <div className="right">
                      <label htmlFor="singlePickerRadio">Single Select</label>
                      <label htmlFor="singlePickerRadio">
                        Select this if there is only one thing to store For
                      </label>
                    </div>
                  </div>
                  <div className="custom_checkbox">
                    <div className="left">
                      <label className="radio">
                        <input
                          type="radio"
                          value="multiSelect"
                          checked={pickerType === "multiSelect"}
                          name="pickerChooseType"
                          onChange={handlePickerChooseType}
                          id="multiSelectPickerRadio"
                        />
                        <span className="checkround" />
                      </label>
                    </div>
                    <div className="right">
                      <label htmlFor="multiSelectPickerRadio">
                        Multi Select
                      </label>
                      <label htmlFor="multiSelectPickerRadio">
                        Select this if there are several things to be stored
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {tab === 2 && (
            <div className="secondTab">
              <div className="custom_checkbox">
                <div className="left">
                  <label className="checkBox">
                    <input
                      type="checkbox"
                      id="isRequired"
                      checked={isRequired}
                      onChange={handleRequireCheckBox}
                    />
                    <span className="checkmark" />
                  </label>
                </div>
                <div className="right">
                  <label htmlFor="isRequired">Required</label>
                  <label>
                    You won't be able to publish an entry if this field is empty
                  </label>
                </div>
              </div>
              {selectedField.type === "string" && (
                <div className="custom_checkbox">
                  <div className="left">
                    <label className="checkBox">
                      <input
                        type="checkbox"
                        id="textLimit"
                        checked={textLimit.checked}
                        onChange={handleTextLimitChanged}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="right">
                    <label htmlFor="textLimit">Limit character count</label>
                    <label htmlFor="textLimit">
                      Specify a minimum and/or maximum allowed number of
                      characters
                    </label>
                    {textLimit.checked && (
                      <div className="validation-configs text-limit-validation">
                        <select
                          className="form-control"
                          onChange={handleTextLimitTypeChanged}
                          value={textLimit.type}
                        >
                          <option value="between">Between</option>
                          <option value="atLeast">At least</option>
                          <option value="noMoreThan">No more than</option>
                        </select>
                        {(textLimit.type === "between" ||
                          textLimit.type === "atLeast") && (
                          <input
                            type="number"
                            className="form-control"
                            placeholder="min"
                            value={textLimit.min}
                            onChange={handleTextLimitMinimum}
                          />
                        )}
                        {textLimit.type === "between" && <span>and</span>}
                        {(textLimit.type === "between" ||
                          textLimit.type === "noMoreThan") && (
                          <input
                            type="number"
                            className="form-control"
                            placeholder="max"
                            min="0"
                            value={textLimit.max}
                            onChange={handleTextLimitMaximum}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {selectedField.type === "number" && (
                <div className="custom_checkbox">
                  <div className="left">
                    <label className="checkBox">
                      <input
                        type="checkbox"
                        id="numberLimitRange"
                        checked={numberLimitChecked}
                        onChange={handleNumberLimitChanged}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="right">
                    <label htmlFor="numberLimitRange">
                      Accept only specified number range
                    </label>
                    <label htmlFor="numberLimitRange">
                      Specify a minimum and/or maximum allowed number for this
                      field
                    </label>
                    {numberLimitChecked && (
                      <div className="validation-configs text-limit-validation">
                        <select
                          className="form-control input-sm"
                          onChange={handleNumberLimitTypeChanged}
                          value={numberLimitType}
                        >
                          <option value="between">Between</option>
                          <option value="greatEqual">
                            Greater or equal than
                          </option>
                          <option value="lessEqual">Less or equal than</option>
                        </select>
                        {(numberLimitType === "between" ||
                          numberLimitType === "greatEqual") && (
                          <input
                            type="number"
                            className="form-control input-sm"
                            placeholder="min"
                            value={numberLimitMin}
                            onChange={handleNumberLimitMinimum}
                          />
                        )}
                        {numberLimitType === "between" && <span>and</span>}
                        {(numberLimitType === "between" ||
                          numberLimitType === "lessEqual") && (
                          <input
                            type="number"
                            className="form-control input-sm"
                            placeholder="max"
                            min="0"
                            value={numberLimitMax}
                            onChange={handleNumberLimitMaximum}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {selectedField.type === "string" && (
                <div className="custom_checkbox">
                  <div className="left">
                    <label className="checkBox">
                      <input
                        type="checkbox"
                        id="matchRegex"
                        checked={matchRegex}
                        onChange={handleRegexChanged}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="right">
                    <label htmlFor="matchRegex">Match a specific pattern</label>
                    <label htmlFor="matchRegex">
                      Make this field match a pattern: e-mail address, URI, or a
                      custom regular expression
                    </label>
                    {matchRegex && (
                      <div className="validation-configs">
                        <input
                          className="form-control input-sm"
                          placeholder="[^0-9]*[12]?[0-9]{1,2}[^0-9]*"
                          value={matchRegexValue}
                          onChange={handleMatchRegexValueChanged}
                        />
                        <a
                          href="https://projects.lukehaas.me/regexhub/"
                          target="_blank"
                        >
                          Examples
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {selectedField.type === "media" && (
                <div className="custom_checkbox">
                  <div className="left">
                    <label className="checkBox">
                      <input
                        type="checkbox"
                        id="mediaType"
                        checked={mediaTypeVisibility}
                        onChange={() =>
                          toggleMediaType(prevState => !prevState)
                        }
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="right">
                    <label htmlFor="mediaType">
                      Accept only specified file types
                    </label>
                    <label>
                      Make this field only accept specified file types
                    </label>
                    {mediaTypeVisibility && (
                      <div className="validation-configs">
                        {mediaType.map((type, index) => (
                          <button
                            key={"btnType" + index}
                            className={
                              "btn btn-sm " +
                              (type.selected === true
                                ? "btn-primary"
                                : "btn-light")
                            }
                            onClick={() => handleSelectMediaType(type)}
                          >
                            {type.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {selectedField.type === "reference" && (
                <div className="custom_checkbox">
                  <div className="left">
                    <label className="checkBox">
                      <input
                        type="checkbox"
                        id="referenceChk"
                        checked={referenceContentTypeChk}
                        onChange={handleReferenceChk}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="right">
                    <label htmlFor="referenceChk">
                      Accept only specified entry type
                    </label>
                    <label htmlFor="referenceChk">
                      Make this field only accept entries from specified content
                      type(s)
                    </label>
                    {referenceContentTypeChk && (
                      <div className="validation-configs">
                        {contentTypes.map((item, index) => (
                          <button
                            className={
                              "btn btn-sm " +
                              (selectedRefContentType &&
                              selectedRefContentType._id === item._id
                                ? "btn-primary"
                                : "btn-light")
                            }
                            key={item._id}
                            onClick={() => handleRefSelect(item)}
                            title={item.title[currentLang]}
                          >
                            {item.title[currentLang]}
                          </button>
                        ))}
                        {selectedRefContentType && (
                          <div className="form-group" style={{ marginTop: 10 }}>
                            <label>Visible Fields</label>
                            <Select
                              // menuPlacement="top"
                              closeMenuOnScroll={true}
                              closeMenuOnSelect={false}
                              value={refValue}
                              defaultValue={true && getRefDefaults()}
                              onChange={handleRefVisibleFieldsChange}
                              options={selectedRefContentTypeFields}
                              isMulti={true}
                              isSearchable={true}
                              components={{
                                Option: CustomOption,
                                MultiValueLabel,
                                SingleValue
                              }}
                            />
                            {/* <small className="form-text text-muted">
                              {field.description[currentLang]}
                            </small> */}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {tab === 3 && (
            <div className="thirdTab">
              <span className="thirdTab-title">
                Chooes how this field should be displayed
              </span>
              <div className="apearanceUiList">
                {fieldsUI ? (
                  fieldsUI.map(ui => (
                    <div
                      className={
                        "apearanceItem " + (ui.selected ? "active" : "")
                      }
                      onClick={() => setAppearance(ui)}
                    >
                      {ui.title[currentLang]}
                      {ui.selected && (
                        <div className="activeItem">
                          <i className="icon-checkmark" />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="apearanceItem active">
                    Default
                    <div className="activeItem">
                      <i className="icon-checkmark" />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="form-group">
                  <label>{languageManager.translate("Help Text")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={helpText}
                    placeholder={languageManager.translate(
                      "Try to enter maximum 255 char"
                    )}
                    onChange={handleHelpTextchanged}
                  />
                  <small className="form-text text-muted">
                    {languageManager.translate(
                      "This help text will show up below the field"
                    )}
                  </small>
                </div>
                {selectedField.type === "dateTime" && (
                  <div className="inputSwitch">
                    <span>
                      {languageManager.translate("FIELD_DATE_FORMAT_TITLE")}
                    </span>
                    <span>
                      {languageManager.translate(
                        "FIELD_DATE_FORMAT_TITLE_INFO"
                      )}
                    </span>
                    <div className="inputSwitch-content">
                      <button
                        className={
                          "btn btn-sm " +
                          (dateTimeFormat === "dateTime"
                            ? "btn-primary"
                            : "btn-light")
                        }
                        onClick={() => toggleDateFormat("dateTime")}
                      >
                        {languageManager.translate(
                          "FIELD_DATE_FORMAT_DATE_TIME"
                        )}
                      </button>
                      <button
                        className={
                          "btn btn-sm " +
                          (dateTimeFormat === "date"
                            ? "btn-primary"
                            : "btn-light")
                        }
                        onClick={() => toggleDateFormat("date")}
                      >
                        {languageManager.translate("FIELD_DATE_FORMAT_DATE")}
                      </button>
                      <button
                        className={
                          "btn btn-sm " +
                          (dateTimeFormat === "time"
                            ? "btn-primary"
                            : "btn-light")
                        }
                        onClick={() => toggleDateFormat("time")}
                      >
                        {languageManager.translate("FIELD_DATE_FORMAT_TIME")}
                      </button>
                    </div>
                  </div>
                )}
                {selectedField.type === "keyValue" && (
                  <>
                    <span>
                      {languageManager.translate("FIELD_OPTIONS_TITLE")}
                    </span>
                    {options.map((item, index) => (
                      <div className="options" key={index}>
                        <div className="leftInput">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={languageManager.translate(
                              "FIELD_OPTIONS_VALUE"
                            )}
                            value={options[index].value}
                            onChange={e => handleOptionValueChanged(e, index)}
                          />
                        </div>
                        <div className="rightInput">
                          <button
                            className="btn btn-light"
                            onClick={() => setSelectedOption(item, index)}
                          >
                            <i
                              className="icon-checkmark"
                              style={{
                                opacity: item.selected ? "1" : ".2"
                              }}
                            />
                          </button>
                          <button
                            className="btn btn-light"
                            onClick={() => removeOption(item, index)}
                          >
                            <i className="icon-bin" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      className="btn btn-primary btn-plus btn-sm"
                      onClick={addNewOption}
                    >
                      <i className="icon-plus" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <ModalFooter>
          <button className="btn btn-primary" onClick={update}>
            <CircleSpinner show={spinner} size="small" />
            {!spinner && "Save"}
          </button>
          <button className="btn btn-secondary" onClick={closeModal}>
            Close
          </button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default FieldConfig;

const SingleValue = props => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <div className="options-single-selected">
        {data.title
          ? data.title[currentLang]
            ? data.title[currentLang]
            : ""
          : ""}
      </div>
    </components.SingleValue>
  );
};
const MultiValueLabel = props => {
  const { data } = props;
  return (
    <components.MultiValueLabel {...props}>
      <div className="options-multiple-selected">
        {data.title
          ? data.title[currentLang]
            ? data.title[currentLang]
            : ""
          : ""}
      </div>
    </components.MultiValueLabel>
  );
};

const CustomOption = ({ innerProps, isDisabled, data }) => {
  if (!isDisabled) {
    return (
      <div {...innerProps} className="options-items">
        {data.title
          ? data.title[currentLang]
            ? data.title[currentLang]
            : ""
          : ""}
      </div>
    );
  } else return null;
};

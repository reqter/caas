import React, { useState, useEffect } from "react";
import "./styles.scss";
import { languageManager, utility } from "../../services";

const NumberInput = props => {
  const currentLang = languageManager.getCurrentLanguage().name;

  const { field, formData } = props;
  const [error, setError] = useState();
  const [input, setInput] = useState(
    field.defaultValue ? field.defaultValue : ""
  );

  useEffect(() => {
    if (formData[field.name]) {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, true);

      setInput(props.formData[field.name]);
    } else {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, false);
      if (field.defaultValue) {
        setInput(field.defaultValue);
        setValueToParentForm(field.defaultValue);
      } else setInput("");
    }
  }, [formData]);

  function setValueToParentForm(inputValue) {
    let value;
    if (field.isTranslate) value = utility.applyeLangs(inputValue);
    else value = inputValue;

    let isValid = true;
    let e;
    const numberValue = parseInt(inputValue);
    if (field.isRequired && inputValue.length === 0) {
      isValid = false;
      e = "It's required";
    }
    //  if (isValid && field.appearance === "email") {
    //    if (!validateEmail(inputValue)) {
    //      isValid = false;
    //      e = "Incorrect email";
    //    }
    //  }
    //  if (isValid && field.appearance === "url") {
    //    if (!inputValue.match(url_pattern)) {
    //      isValid = false;
    //      e = "Incorrect url";
    //    }
    //  }
    //  if (isValid && field.appearance === "phoneNumber") {
    //    if (!isPhoneNumber(inputValue)) {
    //      isValid = false;
    //      e = "Incorrect phone number";
    //    }
    //  }
    if (isValid && field.limit) {
      const type = field.limit.type;
      const min = field.limit.min ? parseInt(field.limit.min) : 0;
      const max = field.limit.max ? parseInt(field.limit.max) : 1000000;
      if (type === "between") {
        if (numberValue >= min && numberValue <= max) {
        } else {
          isValid = false;
          e = `Value should be between ${min} and ${max}`;
        }
      } else if (type === "atLeast") {
        if (numberValue < min) {
          isValid = false;
          e = `Value can not be less than ${min}`;
        }
      } else {
        if (numberValue < min) {
          isValid = false;
          e = `Value can not be greater than ${max}`;
        }
      }
    }
    props.onChangeValue(field, value, isValid);
    setError(e);
  }
  function handleOnChange(e) {
    setInput(e.target.value);
    setValueToParentForm(e.target.value);
  }
  function myFormat(num) {
    return num + "$";
  }
  return (
    <div className="form-group">
      <label>{field.title[currentLang]}</label>
      <input
        type="number"
        className="form-control"
        placeholder={field.title[currentLang]}
        value={input}
        onChange={handleOnChange}
        readOnly={props.viewMode}
        min={
          field.limit &&
          (field.limit.type === "between" ||
            field.limit.type === "greatEqual") &&
          field.limit.min
        }
        max={
          field.limit &&
          (field.limit.type === "between" ||
            field.limit.type === "lessEqual") &&
          field.limit.max
        }
        format={myFormat}
      />
      <small className="form-text text-muted">
        {!error ? (
          field.description && field.description[currentLang]
        ) : (
          <span className="error-text">{error}</span>
        )}
      </small>
    </div>
  );
};

export default NumberInput;
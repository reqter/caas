import React, { useState, useEffect } from "react";
import "./styles.scss";
import { languageManager, utility } from "../../services";

var url_pattern = /^(http[s]?|ftp|torrent|image|irc):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/i;

const StringInput = props => {
  const currentLang = languageManager.getCurrentLanguage().name;

  const { field, formData } = props;
  const [error, setError] = useState();
  const [input, setInput] = useState("");

  // set value to input
  useEffect(() => {
    if (field.isRequired === true) if (props.init) props.init(field.name, true);
  }, []);
  useEffect(() => {
    if (formData && formData[field.name]) {
      if (field.isTranslate) setInput(props.formData[field.name][currentLang]);
      else
        setInput(
          props.formData[field.name][currentLang]
            ? props.formData[field.name][currentLang]
            : props.formData[field.name]
        );
    } else {
      if (field.defaultValue) {
        setInput(field.defaultValue);
        setValueToParentForm(field.defaultValue);
      } else setInput("");
    }
  }, [formData]);

  function setValueToParentForm(inputValue) {
    if (props.onChangeValue) {
      let value;
      if (field.isTranslate) value = utility.applyeLangs(inputValue);
      else value = inputValue;

      let isValid = true;
      let e;
      const char_count = inputValue.length;
      if (field.isRequired && char_count === 0) {
        isValid = false;
        e = "It's required";
      }
      if (isValid && field.appearance === "email") {
        if (!validateEmail(inputValue)) {
          isValid = false;
          e = "Incorrect email";
        }
      }
      if (isValid && field.appearance === "url") {
        if (!inputValue.match(url_pattern)) {
          isValid = false;
          e = "Incorrect url";
        }
      }
      if (isValid && field.appearance === "phoneNumber") {
        if (!isPhoneNumber(inputValue)) {
          isValid = false;
          e = "Incorrect phone number";
        }
      }
      if (isValid && field.limit) {
        const type = field.limit.type;
        const min = field.limit.min ? parseInt(field.limit.min) : 0;
        const max = field.limit.max ? parseInt(field.limit.max) : 1000000;
        if (type === "between") {
          if (char_count >= min && char_count <= max) {
          } else {
            isValid = false;
            e = `Value should be between ${min} and ${max} characters`;
          }
        } else if (type === "atLeast") {
          if (char_count < min) {
            isValid = false;
            e = `Value can not be less than ${min} characters`;
          }
        } else {
          if (char_count < min) {
            isValid = false;
            e = `Value can not be more than ${max} characters`;
          }
        }
      }
      props.onChangeValue(field, value, isValid);
      setError(e);
    }
  }
  function handleOnChange(e) {
    setInput(e.target.value);
    setValueToParentForm(e.target.value);
  }
  return (
    <div className="form-group">
      <label>{field.title && field.title[currentLang]}</label>
      {field.isMultiLine !== undefined && field.isMultiLine ? (
        <textarea
          className="form-control up-form-stringInput-textArea"
          placeholder={field.title[currentLang]}
          value={input}
          onChange={handleOnChange}
          readOnly={props.viewMode}
        />
      ) : (
        <input
          type={field.appearance ? field.appearance : "text"}
          className="form-control"
          placeholder={field.title && field.title[currentLang]}
          value={input}
          onChange={handleOnChange}
          readOnly={props.viewMode}
          minLength={
            field.limit &&
            (field.limit.type === "between" ||
              field.limit.type === "atLeast") &&
            field.limit.min
          }
          maxLength={
            field.limit &&
            (field.limit.type === "between" ||
              field.limit.type === "noMoreThan") &&
            field.limit.max
          }
        />
      )}
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

export default StringInput;

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function isPhoneNumber(phoneNumber) {
  var p = /^(\+98|0098|0)?9\d{9}$/;
  return p.test(phoneNumber);
}

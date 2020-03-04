import React, { useState, useEffect } from "react";
import "./styles.scss";
import { useLocale } from "hooks";
const util = require("util");

const JsonInput = props => {
  const { currentLocale } = useLocale();

  const { field, formData, updateMode } = props;
  const [error, setError] = useState("");
  const [input, setInput] = useState("");

  // set value to input
  useEffect(() => {
    if (formData && formData[field.name]) {
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
    if (props.onChangeValue) {
      let value = inputValue;
      let p;
      try {
        p = JSON.parse(inputValue);
        if (error) setError();

        if (field.isRequired) {
          let isValid = false;
          if (inputValue.length > 0) {
            isValid = true;
          }
          props.onChangeValue(field, value, isValid);
        } else props.onChangeValue(field, value, true);
      } catch (e) {
        setError(util.inspect(e));
      }
    }
  }
  function handleOnChange(e) {
    setInput(e.target.value);
    setValueToParentForm(e.target.value);
  }
  return (
    <div className="form-group">
      <label>{field.title && field.title[currentLocale]}</label>
      <textarea
        className="form-control"
        placeholder="example : { 'propName' : 'propValue' }"
        value={input}
        onChange={handleOnChange}
        readOnly={props.viewMode}
      />
      <small className="form-text text-muted">
        {error ? (
          <span style={{ color: "red" }}>{error}</span>
        ) : (
          field.description && field.description[currentLocale]
        )}
      </small>
    </div>
  );
};

export default JsonInput;

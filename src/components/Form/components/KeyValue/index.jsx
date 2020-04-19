import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import Select, { components } from "react-select";
import useLocale from "hooks/useLocale";
import styles from "../styles.module.scss";

const KeyValueInput = ({ field, mode, initialValue }) => {
  const {
    register,
    errors,
    setError,
    clearError,
    setValue,
    reset,
    formState: { dirty },
    watch,
  } = useFormContext();
  const { currentLocale } = useLocale();
  const selectRef = React.useRef(null);

  React.useEffect(() => {
    register({ name: field.name, type: "custom" });
    if (!initialValue && mode !== "filter" && field.options) {
      if (field.isList) {
        const opts = field.options
          .filter((opt) => opt.selected === true)
          .map((item) => item.value);
        if (opts && opts.length > 0) setValue(field.name, opts);
      } else {
        const opt = field.options.find((opt) => opt.selected === true);
        if (opt) setValue(field.name, opt.value);
      }
    }
  }, []);
  const selectValue = watch(field.name);
  React.useEffect(() => {
    // if (selectValue === undefined) {
    //   console.log(register().current);
    // }
    //  selectFieldRef.current.select.clearValue();
  }, [selectValue]);

  function getSelectedOption() {
    if (mode !== "filter") {
      if (initialValue) {
        if (field.isList) {
          return initialValue.map((value) => ({
            value,
          }));
        }
        return { value: initialValue };
      } else {
        if (!field.options || field.options.length === 0) return undefined;
        if (field.isList)
          return field.options.filter((opt) => opt.selected === true);
        else return field.options.find((opt) => opt.selected === true);
      }
    }
  }

  function handleOnChange(selected) {
    let isValid = true;
    let value;
    if (field.isList) {
      value = selected.map((item) => item.value);
      if (mode !== "filter") {
        if (field.isRequired) {
          isValid = false;
          const e = {
            type: "required",
            name: field.name,
            message: "This is required.",
          };
          setError([e]);
        }
      }
    } else {
      value = selected.value;
      if (value.length === 0) isValid = false;
    }

    if (isValid) {
      clearError(field.name);
      setValue(field.name, value);
    }
  }
  return React.useMemo(
    () => (
      <div className={styles.input__group}>
        <label className={styles.label}>
          {field.title ? field.title[currentLocale] : ""}
        </label>
        <Select
          name={field.name}
          ref={(e) => {
            selectRef.current = e;
          }}
          placeholder={
            field.description ? field.description[currentLocale] : ""
          }
          menuPlacement="top"
          closeMenuOnScroll={true}
          closeMenuOnSelect={!field.isList}
          options={field.options ? field.options : []}
          isMulti={field.isList === true ? true : false}
          isSearchable={true}
          isDisabled={mode === "view" ? true : false}
          components={{
            Option: CustomOption,
            MultiValueLabel,
            SingleValue,
          }}
          onChange={handleOnChange}
          defaultValue={true && getSelectedOption()}
        />
        <span className={styles.info}>
          {errors[field.name] ? errors[field.name]["message"] : ""}
        </span>
      </div>
    ),
    [dirty]
  );
};

export default KeyValueInput;

const SingleValue = (props) => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <div className="options-single-selected">{data.value}</div>
    </components.SingleValue>
  );
};
const MultiValueLabel = (props) => {
  const { data } = props;
  return (
    <components.MultiValueLabel {...props}>
      <div className="options-multiple-selected">{data.value}</div>
    </components.MultiValueLabel>
  );
};

const CustomOption = ({ innerProps, isDisabled, data }) => {
  if (!isDisabled) {
    return (
      <div {...innerProps} className={styles.options_items}>
        {data.value}
      </div>
    );
  } else return null;
};

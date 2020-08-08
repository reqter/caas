import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import Select, { components } from "react-select";
import useLocale from "hooks/useLocale";
import styles from "../styles.module.scss";

const KeyValueInput = ({ field, mode, initialValue, filter }) => {
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

  // set default options to form object if form is in new mode
  React.useEffect(() => {
    register({ name: field.name, type: "custom" });
    if (field.options) {
      if (filter) {
        setValue(field.name, filter);
      } else {
        if (mode === "new") {
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

  // show options as selected values if form is not in filter mode
  function getSelectedOption() {
    if (filter) {
      const val = filter;
      if (val) {
        if (field.isList && Array.isArray(val)) {
          return val.map((value) => ({
            value,
          }));
        }
        return { value: val };
      } else {
        if (mode !== "filter") {
          const val = initialValue;
          if (val) {
            if (field.isList && Array.isArray(val)) {
              return val.map((value) => ({
                value,
              }));
            }
            return { value: val };
          }
          if (!field.options || field.options.length === 0) return undefined;
          if (field.isList)
            return field.options.filter((opt) => opt.selected === true);
          else return field.options.find((opt) => opt.selected === true);
        }
      }
    }
  }

  function handleOnChange(selected) {
    let isValid = true;
    let value;
    if (field.isList) {
      value = selected.map((item) => item.value);
      if (mode !== "filter") {
        if (field.isRequired && (!value || value.length === 0)) {
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
      value = selected ? selected.value : "";
      if (mode !== "filter" && field.isRequired && value.length === 0) {
        isValid = false;
        const e = {
          type: "required",
          name: field.name,
          message: "This is required.",
        };
        setError([e]);
      }
    }

    if (isValid) {
      clearError(field.name);
      setValue(field.name, value);
    }
  }
  return React.useMemo(() => (
    <div className={styles.input__group}>
      <label className={styles.label}>
        {field.title ? field.title[currentLocale] : ""}
      </label>
      <Select
        name={field.name}
        ref={(e) => {
          selectRef.current = e;
        }}
        placeholder={field.description ? field.description[currentLocale] : ""}
        menuPlacement="top"
        closeMenuOnScroll={true}
        closeMenuOnSelect={!field.isList}
        options={field.options ? field.options : []}
        isMulti={field.isList === true ? true : false}
        isSearchable={true}
        isClearable
        isDisabled={mode === "view" ? true : false}
        styles={{
          placeholder: (base) => ({
            ...base,
            fontSize: "13px",
          }),
        }}
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
  ));
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

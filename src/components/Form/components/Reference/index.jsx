import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { useFormContext } from "react-hook-form";
import styles from "./../styles.module.scss";
import useGlobalState from "services/stateManager";
import { t } from "services/languageManager";
import { filterContents } from "Api/content-api";
import useLocale from "hooks/useLocale";

const ReferenceInput = ({ field, mode, initialValue }) => {
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
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const { currentLocale } = useLocale();
  const selectRef = React.useRef(null);

  const [options, setOptions] = useState();
  const [values, setValues] = useState();

  // set value to selected otions
  useEffect(() => {
    register({ name: field.name, type: "custom" });
    if (spaceInfo && field.references && field.references.length > 0) {
      filterContents()
        .onOk((result) => {
          if (result) {
            const r = result.map((item) => {
              item.value = item._id;
              return item;
            });
            setOptions(r);
            if (!initialValue) setValues(null);
            else initValue(r);
          }
        })
        .onServerError((result) => {})
        .onBadRequest((result) => {})
        .unAuthorized((result) => {})
        .notFound(() => {})
        .call(spaceInfo.id, undefined, field.references[0]);
    }
  }, []);
  function initValue(allData) {
    if (field.isList) {
      const selectedData = initialValue;
      const result = [];
      for (let i = 0; i < selectedData.length; i++) {
        const id = selectedData[i];
        for (let j = 0; j < allData.length; j++) {
          const refObj = allData[j];
          if (refObj.value === id) {
            result.push(refObj);
            break;
          }
        }
      }
      setValues(result.length > 0 ? result : null);
    } else {
      const v = allData.find((item) => item.value === initialValue);
      setValues(v);
    }
  }
  function handleChange(selected) {
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
    setValues(selected);
  }
  function initOptions(result) {
    return result;
  }
  function promiseOptions(inputValue) {
    return new Promise((resolve) => {
      filterContents()
        .onOk((result) => {
          if (result) resolve(initOptions(result));
        })
        .onServerError((result) => {})
        .onBadRequest((result) => {})
        .unAuthorized((result) => {})
        .notFound(() => {})
        .call(spaceInfo.id, undefined, [field.references]);
    });
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
          value={values}
          onChange={handleChange}
          options={options}
          isMulti={field.isList}
          // isSearchable={true}
          isDisabled={mode === "view" ? true : false}
          components={{ Option: CustomOption, MultiValueLabel, SingleValue }}
        />
        <span className={styles.info}>
          {errors[field.name] ? errors[field.name]["message"] : ""}
        </span>
      </div>
    ),
    [dirty, options, values]
  );
};

export default ReferenceInput;

const SingleValue = (props) => {
  const { data } = props;
  const { currentLocale } = useLocale();
  return (
    <components.SingleValue {...props}>
      <div className={styles.options_single_selected}>
        <div className={styles.custom_select_selected}>
          {data.contentType &&
            data.contentType["media"] &&
            data.contentType["media"].length > 0 && (
              <div className={styles.selectedItemImage}>
                <img src={data.contentType["media"][0][currentLocale]} alt="" />
              </div>
            )}
          <div className={styles.selectedItemName}>
            {data.fields
              ? data.fields.name
                ? data.fields.name[currentLocale]
                  ? data.fields.name[currentLocale]
                  : typeof data.fields.name === "string"
                  ? data.fields.name
                  : ""
                : ""
              : ""}
          </div>
        </div>
      </div>
    </components.SingleValue>
  );
};
const MultiValueLabel = (props) => {
  const { data } = props;
  const { currentLocale } = useLocale();
  return (
    <components.MultiValueLabel {...props}>
      <div className={styles.custom_select_selected} key={data._id}>
        {data.contentType["media"] && data.contentType["media"].length > 0 && (
          <div className={styles.selectedItemName}>
            <img src={data.contentType["media"][0][currentLocale]} alt="" />
          </div>
        )}
        <div className={styles.selectedItemName}>
          {data.fields
            ? data.fields.name
              ? data.fields.name[currentLocale]
                ? data.fields.name[currentLocale]
                : typeof data.fields.name === "string"
                ? data.fields.name
                : ""
              : ""
            : ""}
        </div>
      </div>
    </components.MultiValueLabel>
  );
};

const CustomOption = ({ innerProps, isDisabled, data }) => {
  const { currentLocale } = useLocale();
  if (!isDisabled) {
    return (
      <div {...innerProps} className={styles.custom_select_item}>
        <div className={styles.imageItem}>
          {data.contentType["media"] && data.contentType["media"].length > 0 ? (
            <img src={data.contentType["media"][0][currentLocale]} alt="" />
          ) : (
            <div className={styles.imageItem_empty}>No Image</div>
          )}
        </div>
        <div className={styles.itemName}>
          <span>
            {data.fields
              ? data.fields.name
                ? data.fields.name[currentLocale]
                  ? data.fields.name[currentLocale]
                  : typeof data.fields.name === "string"
                  ? data.fields.name
                  : ""
                : ""
              : ""}
          </span>
          <span>
            {data.fields
              ? data.fields.shortDesc
                ? data.fields.shortDesc[currentLocale]
                  ? data.fields.shortDesc[currentLocale]
                  : typeof data.fields.shortDesc === "string"
                  ? data.fields.shortDesc
                  : ""
                : ""
              : ""}
          </span>
        </div>
        <div className={styles.itemBy}>
          <span>{data.sys.issuer && data.sys.issuer.fullName}</span>
        </div>
        <div className={styles.itemStatus}>
          <span>
            {data.fields && data.fields.status && t(data.fields.status)}
          </span>
        </div>
      </div>
    );
  } else return null;
};

import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
// import AsyncCreatableSelect from "react-select/lib/AsyncCreatable";
import "./styles.scss";
import { useGlobalState, languageManager } from "services";
import { filterContents } from "Api/content-api";
import DateFormater from "./../DateFormater";
import { useLocale } from "hooks";

const ReferenceInput = (props) => {
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const { currentLocale } = useLocale();
  const { field, formData, updateMode } = props;

  const [options, setOptions] = useState();
  const [values, setValues] = useState();

  // set value to selected otions
  useEffect(() => {
    if (formData[field.name]) {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, true);
    } else {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, false);
    }

    if (spaceInfo) {
      filterContents()
        .onOk((result) => {
          if (result) {
            const r = result.map((item) => {
              item.value = item._id;
              return item;
            });
            setOptions(r);
            if (formData[field.name] === undefined) {
              setValues(null);
            } else {
              initValue(r);
            }
          }
        })
        .onServerError((result) => {})
        .onBadRequest((result) => {})
        .unAuthorized((result) => {})
        .notFound(() => {})
        .call(spaceInfo.id, undefined, [field.references]);
    }
  }, [formData]);
  function initValue(allData) {
    if (field.isList) {
      const selectedData = formData[field.name];
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
      const v = allData.find((item) => item.value === formData[field.name]);
      setValues(v);
    }
  }
  function setValueToParentForm(input) {
    if (field.isList) {
      let s = [];
      if (input) {
        for (let i = 0; i < input.length; i++) {
          s.push(input[i].value);
        }
      }
      if (field.isRequired) {
        let isValid = false;
        if (s.length > 0) {
          isValid = true;
        }
        if (props.onChangeValue) props.onChangeValue(field, s, isValid);
      } else {
        if (props.onChangeValue) props.onChangeValue(field, s, true);
      }
    } else {
      if (field.isRequired) {
        let isValid = false;
        if (input && input.value.length > 0) {
          isValid = true;
        }
        if (props.onChangeValue)
          props.onChangeValue(field, input ? input.value : "", isValid);
      } else {
        if (props.onChangeValue) props.onChangeValue(field, input ? input.value : "", true);
      }
    }
  }
  function handleChange(selecteds) {
    setValues(selecteds);
    setValueToParentForm(selecteds);
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
  return (
    <div className="form-group">
      <label>{field.title && field.title[currentLocale]}</label>
      {/* <AsyncCreatableSelect
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
        menuPlacement="top"
        closeMenuOnScroll={true}
        closeMenuOnSelect={!field.isList}
        value={selectedOptions}
        onChange={handleChange}
        options={options}
        isMulti={field.isList}
        isSearchable={true}
        components={{ Option: CustomOption, MultiValueLabel, SingleValue }}
      /> */}
      <Select
        menuPlacement="top"
        closeMenuOnScroll={true}
        closeMenuOnSelect={!field.isList}
        value={values}
        onChange={handleChange}
        options={options}
        isMulti={field.isList}
        isSearchable={true}
        isClearable
        isDisabled={props.viewMode}
        components={{ Option: CustomOption, MultiValueLabel, SingleValue }}
      />
      <small className="form-text text-muted">
        {field.description[currentLocale]}
      </small>
    </div>
  );
};

export default ReferenceInput;

const SingleValue = (props) => {
  const { data } = props;
  const { currentLocale } = useLocale();
  return (
    <components.SingleValue {...props}>
      <div className="options-single-selected">
        <div className="custome-select-selected">
          {data.contentType &&
            data.contentType["media"] &&
            data.contentType["media"].length > 0 && (
              <div className="selectedItemImage">
                <img src={data.contentType["media"][0][currentLocale]} alt="" />
              </div>
            )}
          <div className="selectedItemName">
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
      <div className="custome-select-selected" key={data._id}>
        {data.contentType["media"] && data.contentType["media"].length > 0 && (
          <div className="selectedItemImage">
            <img src={data.contentType["media"][0][currentLocale]} alt="" />
          </div>
        )}
        <div className="selectedItemName">
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
      <div {...innerProps} className="custom-select-item">
        <div className="imageItem">
          {data.contentType["media"] && data.contentType["media"].length > 0 ? (
            <img src={data.contentType["media"][0][currentLocale]} alt="" />
          ) : (
            <div className="imageItem-empty">No Image</div>
          )}
        </div>
        <div className="itemName">
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
        <div className="itemBy">
          <span>{data.sys.issuer && data.sys.issuer.fullName}</span>
          <span>
            {data.sys.issueDate && <DateFormater data={data.sys.issueDate} />}
          </span>
        </div>
        <div className="itemStatus">
          <span>
            {data.fields &&
              data.fields.status &&
              languageManager.translate(data.fields.status)}
          </span>
        </div>
      </div>
    );
  } else return null;
};

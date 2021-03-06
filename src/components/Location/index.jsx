import React, { useState, useEffect, useRef } from "react";
import "./styles.scss";
import { languageManager } from "services";
import { useLocale } from "hooks";

const LocationInput = props => {
  const { currentLocale } = useLocale();
  let autocomplete;
  const autocompleteInput = useRef(null);

  const { field, formData, updateMode } = props;
  const [latitude, setLatitude] = useState(
    field.defaultValue ? field.defaultValue.latitude : ""
  );
  const [longitude, setLongitude] = useState(
    field.defaultValue ? field.defaultValue.longitude : ""
  );

  // set value to input update time and reset form time
  useEffect(() => {
    if (formData[field.name]) {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, true);
      setValueToInput(props.formData[field.name]);
    } else {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, false);
      if (field.defaultValue) {
        setValueToInput(field.defaultValue);
        if (props.onChangeValue)
          props.onChangeValue(field, field.defaultValue, true);
      } else setValueToInput({});
    }
  }, [formData]);

  function setValueToInput(obj) {
    setLatitude(obj.latitude ? obj.latitude : "");
    setLongitude(obj.longitude ? obj.longitude : "");
  }

  function setValueToParentForm(lat, long) {
    let value = {
      latitude: lat,
      longitude: long
    };

    if (field.isRequired) {
      let isValid = false;
      if (lat.length > 0 && long.length > 0) {
        isValid = true;
      }
      if (props.onChangeValue) props.onChangeValue(field, value, isValid);
    } else {
      if (props.onChangeValue) props.onChangeValue(field, value, true);
    }
  }
  function handleLatitudeChange(e) {
    setLatitude(e.target.value);
    setValueToParentForm(e.target.value, longitude);
  }
  function handleLongitudeChange(e) {
    setLongitude(e.target.value);
    setValueToParentForm(latitude, e.target.value);
  }

  function handlePlaceSelect() {
    // let addressObject = autocomplete.getPlace();
    // let address = addressObject.address_components;
    // Check if address is valid
    // if (address) {
    //   console.log(address);
    // Set State
    // this.setState({
    //   city: address[0].long_name,
    //   query: addressObject.formatted_address,
    // });
  }
  return field.appearance === undefined || field.appearance === "default" ? (
    <div className="form-group">
      <label>{field.title[currentLocale]}</label>
      <div className="row">
        <div className="col">
          <input
            id="autocomplete"
            ref={autocompleteInput}
            type="text"
            className="form-control"
            placeholder={languageManager.translate("LATITUDE")}
            value={latitude}
            onChange={handleLatitudeChange}
            readOnly={props.viewMode}
          />
        </div>
        <div className="col">
          <input
            type="number"
            placeholder={languageManager.translate("LONGITUDE")}
            className="form-control"
            value={longitude}
            onChange={handleLongitudeChange}
            readOnly={props.viewMode}
          />
        </div>
      </div>
      <small className="form-text text-muted">
        {field.description[currentLocale]}
      </small>
    </div>
  ) : (
    <>
      <div className="form-group">
        <label>{field.title[currentLocale]}</label>
        <input
          id="autocomplete"
          ref={autocompleteInput}
          type="text"
          className="form-control"
          placeholder={languageManager.translate("enter your address")}
          // value={latitude}
          // onChange={handleLatitudeChange}
          readOnly={props.viewMode}
        />
        <small className="form-text text-muted">
          {field.description[currentLocale]}
        </small>
      </div>
    </>
  );
};

export default LocationInput;

import React, { useState, useEffect, useRef } from "react";
import "./styles.scss";
import { languageManager, utility } from "../../services";
import SVGIcon from "./svg";

const UploaderView = props => {
  const currentLang = languageManager.getCurrentLanguage().name;

  const { field, formData } = props;
  const [dropZoneViewBox, toggleDropZoneViewBox] = useState(false);
  const [dropZoneFile, setDropZoneFile] = useState();

  const [files, setFiles] = useState([{}]);

  useEffect(() => {
    if (formData[field.name]) {
      setDropZoneFile({
        id: Math.random(),
        url: formData[field.name],
      });
    }
  }, [formData]);
  function download() {
    window.open(dropZoneFile.url[currentLang], );
  }
  return (
    <div className="ad-uploader">
      <div className="ad-uploader__header">
        <div className="ad-uploader__header__left">
          {field.title && (
            <span className="title">{field.title[currentLang]}</span>
          )}
          {field.description && (
            <span className="description">
              {field.description[currentLang]}
            </span>
          )}
        </div>
        <div className="ad-uploader__header__right">
          <button className="btn btn-light btn-sm" onClick={download}>
            Downlaod
          </button>
        </div>
      </div>
     
      <div className="dropBox">
        {dropZoneFile ? (
          <div className="dropbox-uploadedFile">
            {utility.getRequestMediaComponentByURL(
              dropZoneFile.url[currentLang],
              "unknowIcon"
            )}
          </div>
        ) : (
          <div className="dropbox-content">
            <SVGIcon />
            <span>There is no uploaded file</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploaderView;

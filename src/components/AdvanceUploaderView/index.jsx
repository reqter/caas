import React, { useState, useEffect, useRef } from "react";
import "cropperjs/dist/cropper.css";
import "./styles.scss";
import { languageManager, utility } from "../../services";
import SVGIcon from "./svg";
import ListItem from "./ListItem";

const UploaderView = props => {
  const currentLang = languageManager.getCurrentLanguage().name;

  const { field, formData } = props;
  const [dropZoneViewBox, toggleDropZoneViewBox] = useState(false);
  const [dropZoneFile, setDropZoneFile] = useState();

  const [files, setFiles] = useState([{}]);

  useEffect(() => {
    if (formData[field.name] && formData[field.name].length > 0) {
      if (field.isList === true) {
        const d = formData[field.name].map(item => {
          return {
            id: Math.random(),
            url: item,
          };
        });
        setFiles(d);
        setDropZoneFile(d[0]);
      } else {
        setDropZoneFile({
          id: Math.random(),
          url: formData[field.name][0],
        });
      }
    }
  }, [formData]);

  // is list functions

  function handlePreview(file) {
    setDropZoneFile(file);
  }
  function download() {
    window.open(dropZoneFile.url[currentLang]);
  }
  return (
    <>
      <div className="ad-uploader">
        <div className="ad-uploader__header">
          <div className="ad-uploader__header__left">
            {field.title && (
              <span className="title">{field.title[currentLang]}</span>
            )}

            <span className="description">
              {field.description && field.description.length > 0
                ? field.description[currentLang]
                : "No Description"}
            </span>
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
      {field.isList === true && (
        <div className="isList-files">
          {files.map(file => (
            <ListItem
              key={file.id}
              file={file}
              selectedFile={dropZoneFile}
              onPreview={handlePreview}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default UploaderView;

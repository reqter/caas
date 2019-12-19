import React, { useState, useEffect, useRef } from "react";
import "cropperjs/dist/cropper.css";
import "./styles.scss";
import { utility } from "../../services";
import SVGIcon from "./svg";
import ListItem from "./ListItem";
import { useLocale } from "hooks";

const UploaderView = props => {
  const { currentLocale } = useLocale();

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
            url: item
          };
        });
        setFiles(d);
        setDropZoneFile(d[0]);
      } else {
        setDropZoneFile({
          id: Math.random(),
          url: formData[field.name][0]
        });
      }
    }
  }, [formData]);

  // is list functions

  function handlePreview(file) {
    setDropZoneFile(file);
  }
  function download() {
    window.open(dropZoneFile.url[currentLocale]);
  }
  return (
    <>
      <div className="ad-uploader">
        <div className="ad-uploader__header">
          <div className="ad-uploader__header__left">
            {field.title && (
              <span className="title">{field.title[currentLocale]}</span>
            )}

            <span className="description">
              {field.description && field.description.length > 0
                ? field.description[currentLocale]
                : "No Description"}
            </span>
          </div>
          <div className="ad-uploader__header__right">
            <button className="btn btn-light btn-sm" onClick={download}>
              Download
            </button>
          </div>
        </div>

        <div className="dropBox">
          {dropZoneFile ? (
            <div className="dropbox-uploadedFile">
              {utility.getRequestMediaComponentByURL(
                dropZoneFile.url
                  ? dropZoneFile.url[currentLocale]
                    ? dropZoneFile.url[currentLocale].replace("https://app-spanel.herokuapp.com", "https://assets.reqter.com")
                    : dropZoneFile.url.replace("https://app-spanel.herokuapp.com", "https://assets.reqter.com")
                  : null,
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

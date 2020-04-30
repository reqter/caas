import React, { useState, useEffect } from "react";
import "./styles.scss";
import { useLocale } from "hooks";
import SVGIcon from "./svg";

const UploaderView = (props) => {
  const { currentLocale } = useLocale();
  const { field, formData, updateMode } = props;
  const [dropZoneFile, setDropZoneFile] = useState();

  useEffect(() => {
    if (formData) {
      setDropZoneFile(formData);
    }
  }, [formData]);
  function download() {
    const url = dropZoneFile.url[currentLocale]
      ? dropZoneFile.url[currentLocale].replace(
          "https://app-spanel.herokuapp.com",
          "https://assets.reqter.com"
        )
      : dropZoneFile.url
          .toString()
          .replace(
            "https://app-spanel.herokuapp.com",
            "https://assets.reqter.com"
          );
    window.open(url);
  }
  const imgs = ["jpg", "jpeg", "gif", "bmp", "png"];
  const videos = ["mp4", "3gp", "ogg", "wmv", "flv", "avi"];
  const audios = ["wav", "mp3", "ogg"];
  function getAssetComponentByType(file, customClass) {
    const url = file.url[currentLocale]
      ? file.url[currentLocale].replace(
          "https://app-spanel.herokuapp.com",
          "https://assets.reqter.com"
        )
      : file.url
          .toString()
          .replace(
            "https://app-spanel.herokuapp.com",
            "https://assets.reqter.com"
          );
    if (url) {
      const ext = url.split("/").pop().split(".").pop();
      const cls = "unkownFileType " + customClass;

      if (!ext) {
        return (
          <div className={cls}>
            <i className="icon-file-text un-icon" />
            <span className="un-text">uknown</span>
          </div>
        );
      } else {
        if (imgs.indexOf(ext.toLowerCase()) !== -1) {
          return <img src={url} alt="" />;
        } else if (videos.indexOf(ext.toLowerCase()) !== -1) {
          return (
            <video controls>
              <source src={url} />
            </video>
          );
        } else if (audios.indexOf(ext.toLowerCase()) !== -1) {
          return (
            <audio controls>
              <source src={url} />
            </audio>
          );
        } else {
          return (
            <div className={cls}>
              <i className="icon-file-text un-icon" />
              <span className="un-text">{file.name}</span>
            </div>
          );
        }
      }
    }
  }
  return (
    <div className="ad-uploader">
      <div className="ad-uploader__header">
        <div className="ad-uploader__header__left">
          {field.title && (
            <span className="title">{field.title[currentLocale]}</span>
          )}
          {field.description && (
            <span className="description">
              {field.description[currentLocale]}
            </span>
          )}
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
            {getAssetComponentByType(dropZoneFile, "unknowIcon")}
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

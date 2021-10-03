import React, { useState, useEffect } from "react";
import "./styles.scss";
import { utility } from "services";
import AssetBrowser from "./../AssetBrowser";
import { useLocale } from "hooks";

const MediaInput = props => {
  const { currentLocale, makeLocalesValue } = useLocale();
  const { field, formData, updateMode } = props;
  const [assetBrowser, toggleAssetBrowser] = useState(false);
  const [files, setFiles] = useState([]);

  // set form value update time
  useEffect(() => {
    if (formData[field.name] && formData[field.name].length > 0) {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, true);
      const d = formData[field.name].map(item => {
        return {
          id: Math.random(),
          url: item
        };
      });
      setFiles(d);
    } else {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, false);
      if (files.length > 0) setFiles([]);
    }
  }, [formData]);

  useEffect(() => {
    // send value to form after updating
    let result = files.map(item => item.url);
    if (result.length === 0) result = [];
    if (field.isRequired === true) {
      if (result === undefined || result.length === 0)
        if (props.onChangeValue) props.onChangeValue(field, result, false);
        else {
          if (props.onChangeValue) props.onChangeValue(field, result, true);
        }
    } else {
      if (props.onChangeValue) props.onChangeValue(field, result, true);
    }
  }, [files]);

  function handleChooseAsset(asset) {
    toggleAssetBrowser(false);
    if (asset) {
      let obj = {
        id: Math.random()
      };
      if (field.isTranslate) {
        obj["url"] = makeLocalesValue(
          updateMode && formData ? formData[field.name].length > 0 ? formData[field.name][0] : {} : {},
          asset.url && asset.url[currentLocale]
            ? asset.url[currentLocale].toString().replace(
              "https://app-spanel.herokuapp.com",
              "https://assets.iran.liara.run"
            )
            : asset.url.toString().replace(
              "https://app-spanel.herokuapp.com",
              "https://assets.iran.liara.run"
            )
        );
      } else
        obj["url"] =
          asset.url && asset.url[currentLocale]
            ? asset.url[currentLocale].toString().replace(
              "https://app-spanel.herokuapp.com",
              "https://assets.iran.liara.run"
            )
            : asset.url.toString().replace(
              "https://app-spanel.herokuapp.com",
              "https://assets.iran.liara.run"
            );
      if (field.isList !== undefined && field.isList) {
        const newFiles = [...files, obj];
        setFiles(newFiles);
      } else {
        let fs = [];
        fs.push(obj);
        setFiles(fs);
      }
    }
  }

  function removeFile(f) {
    const fs = files.filter(file => file.id !== f.id);
    setFiles(fs);
  }
  function openAssetBrowser() {
    toggleAssetBrowser(true);
  }
  return (
    <>
      <div className="up-uploader">
        <span className="title">{field.title[currentLocale]}</span>
        {field.description && (
          <span className="description">
            {field.description && field.description[currentLocale]}
          </span>
        )}
        <div className="files">
          {props.viewMode && (!files || files.length === 0) ? (
            <div className="files-uploaded">
              <div className="updatedFileType" style={{ fontSize: 17 }}>
                empty
              </div>
            </div>
          ) : (
            files.map(file => (
              <div key={file.id} className="files-uploaded">
                {!props.viewMode && (
                  <div
                    className="files-uploaded-icon"
                    onClick={() => removeFile(file)}
                  >
                    <i className="icon-bin" />
                  </div>
                )}
                <div className="updatedFileType">
                  {field.mediaType === "image" ? (
                    <img
                      src={
                        file.url
                          ? file.url[currentLocale]
                            ? file.url[currentLocale].toString().replace(
                              "https://app-spanel.herokuapp.com",
                              "https://assets.iran.liara.run"
                            )
                            : file.url.toString().replace(
                              "https://app-spanel.herokuapp.com",
                              "https://assets.iran.liara.run"
                            )
                          : null
                      }
                      alt=""
                    />
                  ) : field.mediaType === "video" ? (
                    <i className="icon-video" />
                  ) : field.mediaType === "audio" ? (
                    <i className="icon-audio" />
                  ) : field.mediaType === "pdf" ? (
                    <i className="icon-pdf" />
                  ) : field.mediaType === "spreadsheet" ? (
                    <i className="icon-spreadsheet" />
                  ) : (
                    utility.getAssetIconByURL(
                      file.url
                        ? file.url[currentLocale]
                          ? file.url[currentLocale].toString().replace(
                            "https://app-spanel.herokuapp.com",
                            "https://assets.iran.liara.run"
                          )
                          : file.url.toString().replace(
                            "https://app-spanel.herokuapp.com",
                            "https://assets.iran.liara.run"
                          )
                        : null
                    )
                  )}
                </div>
              </div>
            ))
          )}
          {!props.viewMode && (
            <div className="files-input" onClick={openAssetBrowser}>
              {field.mediaType === "file" ? (
                <i className="icon-file-plus-o" />
              ) : field.mediaType === "image" ? (
                <i className="icon-camera" />
              ) : (
                <i className="icon-file-plus-o" />
              )}
            </div>
          )}
        </div>
      </div>

      {assetBrowser && (
        <AssetBrowser
          isOpen={assetBrowser}
          onCloseModal={handleChooseAsset}
          mediaType={field.mediaType ? [field.mediaType] : undefined}
        />
      )}
    </>
  );
};

export default MediaInput;

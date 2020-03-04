import React, { useState, useEffect } from "react";
import { utility } from "services";
import { useLocale } from "hooks";

const ListItem = props => {
  const { currentLocale } = useLocale();
  const [isActive, setActive] = useState(false);
  const { file } = props;
  useEffect(() => {
    if (props.selectedFile) {
      if (props.selectedFile.id === props.file.id) {
        setActive(true);
      } else {
        setActive(false);
      }
    } else setActive(false);
  }, [props.selectedFile]);

  function preview() {
    props.onPreview(props.file);
  }
  function getFileByType() {
    return file.url ? (
      utility.getRequestMediaThumbComponentByURL(
        file.url[currentLocale] ? file.url[currentLocale] : file.url,
        "unkownFile"
      )
    ) : (
      <div />
    );
  }

  return (
    <div className="listItem">
      <div
        className={"listItem-preview " + (isActive ? "active" : "")}
        onClick={preview}
      >
        {getFileByType()}
      </div>
      {isActive && (
        <div className="listItem-selected">
          <i className="icon-checkmark" />
        </div>
      )}
      <div className="listItem-name">{file.name || ""}</div>
    </div>
  );
};

export default ListItem;

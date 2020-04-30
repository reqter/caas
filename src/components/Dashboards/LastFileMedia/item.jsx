import React from "react";
import { withRouter } from "react-router-dom";
import AssetFile from "../../AssetFile";
import styles from "./styles.module.scss";
import useLocale from "hooks/useLocale";
import DateFormatter from "components/DateFormater";

const Item = ({ history, file }) => {
  const { currentLocale } = useLocale();
  function view() {
    history.push(`/asset/view/${file._id}?ref=dashboard`);
  }
  return (
    <div className={styles.item}>
      <div className={styles.imageBox}>
        {file.fileType.toLowerCase().includes("image") ? (
          <img
            src={
              file.url
                ? file.url[currentLocale]
                  ? file.url[currentLocale].replace(
                      "https://app-spanel.herokuapp.com",
                      "https://assets.reqter.com"
                    )
                  : file.url
                      .toString()
                      .replace(
                        "https://app-spanel.herokuapp.com",
                        "https://assets.reqter.com"
                      )
                : null
            }
            alt=""
          />
        ) : file.fileType.toLowerCase().includes("video") ? (
          <i className="icon-video" />
        ) : file.fileType.toLowerCase().includes("audio") ? (
          <i className="icon-audio" />
        ) : file.fileType.toLowerCase().includes("pdf") ? (
          <i className="icon-pdf" />
        ) : file.fileType.toLowerCase().includes("spreadsheet") ? (
          <i className="icon-spreadsheet" />
        ) : (
          <AssetFile file={file} className="assetFile" />
        )}
      </div>
      <div className={styles.textBox}>
        <span>{file.title && file.title[currentLocale]}</span>
        <span>
          <DateFormatter date={file.sys.issueDate} />
        </span>
      </div>
      <button
        className={styles.btn + " btn btn-outline-primary btn-sm"}
        onClick={view}
      >
        View
      </button>
    </div>
  );
};
export default withRouter(Item);

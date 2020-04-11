import React, { useState } from "react";
import { t } from "services/languageManager";
import useGlobalState from "services/stateManager";
import utility from "services/utility";
import { useLocale } from "hooks";
import styles from "./styles.module.scss";

const ContentTypeItem = ({ contentType, history }) => {
  const [{}, dispatch] = useGlobalState();
  const { currentLocale } = useLocale();
  const { media, title, description } = contentType;

  const browseData = () => {
    dispatch({
      type: "SAVE_CONTENT_TYPE",
      payload: contentType,
    });
    history.push(`/panel/contents/${contentType._id}`);
  };
  const newContent = (e) => {
    e.stopPropagation();
    history.push(`/contents/new/${contentType._id}`);
  };
  const openContentNewTab = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(window.origin + `/panel/contents/${contentType._id}`, "_blank");
  };
  return (
    <div
      className={styles.contentTypeItem + " animated fadeIn"}
      onClick={browseData}
    >
      {media === undefined || media.length === 0 ? (
        <div className={styles.contentTypeItem__icon}>
          <div className={styles.contentIcon}>
            <i className="icon-item-type" />
          </div>
        </div>
      ) : (
        <div className={styles.contentTypeItem__img}>
          <div className={styles.contentTypeItem__ext}>
            {utility.getAssetIconByURL(
              media && media.length > 0
                ? media[0][currentLocale]
                  ? media[0][currentLocale].replace(
                      "https://app-spanel.herokuapp.com",
                      "https://assets.reqter.com"
                    )
                  : media[0]
                      .toString()
                      .replace(
                        "https://app-spanel.herokuapp.com",
                        "https://assets.reqter.com"
                      )
                : null
            )}
          </div>
        </div>
      )}
      <div className={styles.contentTypeItem__text}>
        <a
          href=""
          className={styles.contentTypeItem__name}
          onClick={openContentNewTab}
        >
          {title && title[currentLocale] ? title[currentLocale] : ""}
        </a>
        <span className={styles.contentTypeItem__desc}>
          {description && description[currentLocale]}
        </span>
      </div>
      <button className="btn btn-light btn-sm" onClick={newContent}>
        New Item
      </button>
      <button className="btn btn-light btn-sm">Browse</button>
    </div>
  );
};
export default ContentTypeItem;

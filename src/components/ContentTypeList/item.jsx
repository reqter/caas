import React, { useState } from "react";
import { Link } from "react-router-dom";
import { t } from "services/languageManager";
import useGlobalState from "services/stateManager";
import utility from "services/utility";
import { useLocale } from "hooks";
import styles from "./styles.module.scss";

const ContentTypeItem = ({
  contentType,
  isLinkableName,
  onClickLink,
  onClickRow,
  renderActions,
}) => {
  const [{}, dispatch] = useGlobalState();
  const { currentLocale } = useLocale();
  const { media, title, description } = contentType;

  const clickLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClickLink) onClickLink(contentType);
  };
  function clickRow() {
    if (onClickRow) onClickRow(contentType);
  }
  return (
    <div
      className={styles.contentTypeItem + " animated fadeIn"}
      onClick={clickRow}
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
        {isLinkableName ? (
          <a
            href=""
            className={styles.contentTypeItem__name}
            onClick={clickLink}
          >
            {title && title[currentLocale] ? title[currentLocale] : ""}
          </a>
        ) : (
          <span className={styles.contentTypeItem__name}>
            {title && title[currentLocale] ? title[currentLocale] : ""}
          </span>
        )}

        <span className={styles.contentTypeItem__desc}>
          {description && description[currentLocale]}
        </span>
      </div>
      {renderActions && renderActions(contentType)}
    </div>
  );
};
export default ContentTypeItem;

import React from "react";
import useLocale from "hooks/useLocale";
import styles from "../styles.module.scss";
const ContentTypeBox = ({ contentType, formMode = "new" }) => {
  const { currentLocale } = useLocale();
  const updateMode = formMode === "edit" ? true : false;
  const viewMode = formMode === "view" ? true : false;

  return (
    <div className={styles.content_title}>
      <div className={styles.categoryBox + " animated fadeIn"}>
        {contentType && contentType.media && contentType.media.length > 0 ? (
          <div className={styles.selectedCategory_img}>
            <img src={contentType.media[0][currentLocale]} alt="" />
          </div>
        ) : (
          <div className={styles.selectedCategory_icon}>
            <div className={styles.contentIcon}>
              <i className="icon-item-type" />
            </div>
          </div>
        )}
        <span>
          {contentType.title
            ? contentType.title[currentLocale]
              ? contentType.title[currentLocale]
              : contentType.title
            : contentType.title}
        </span>
      </div>
    </div>
  );
};
export default ContentTypeBox;

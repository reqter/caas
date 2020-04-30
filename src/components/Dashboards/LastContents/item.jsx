import React from "react";
import { withRouter } from "react-router-dom";
import styles from "./styles.module.scss";
import DateFormatter from "components/DateFormater";
import useLocale from "hooks/useLocale";
import { t } from "services/languageManager";

const Item = ({ history, data, i }) => {
  const { currentLocale } = useLocale();
  const { fields, contentType, status } = data;
  function view() {
    history.push({
      pathname: `/contents/view/${data._id}?ref=dashboard`,
    });
  }
  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <div className={styles.index}>{i}</div>
        <div className={styles.imageBox}>
          {data.contentType["media"] && data.contentType["media"].length > 0 ? (
            <img
              src={
                data.contentType["media"][0][currentLocale]
                  ? data.contentType["media"][0][currentLocale]
                      .toString()
                      .replace(
                        "https://app-spanel.herokuapp.com",
                        "https://assets.reqter.com"
                      )
                  : data.contentType["media"][0]
                      .toString()
                      .replace(
                        "https://app-spanel.herokuapp.com",
                        "https://assets.reqter.com"
                      )
              }
              alt=""
            />
          ) : (
            <div className={styles.noImage}>
              <i className="icon-item-type" />
            </div>
          )}
        </div>
      </div>
      <div className={styles.center}>
        <div className={styles.textBox}>
          <span>
            {fields["name"]
              ? fields["name"][currentLocale]
                ? fields["name"][currentLocale]
                : typeof fields["name"] === "string"
                ? fields["name"]
                : ""
              : ""}
          </span>
          <span>
            {fields["description"]
              ? fields["description"][currentLocale]
                ? fields["description"][currentLocale]
                : typeof fields["description"] === "string"
                ? fields["description"]
                : ""
              : ""}
          </span>
        </div>
        <div className={styles.label + " badge badge-light"}>
          {contentType["title"][currentLocale]}
        </div>
        <div className={styles.date}>
          <DateFormatter date={data.sys.issueDate} />
        </div>
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

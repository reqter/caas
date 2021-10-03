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
      pathname: `/app/contents/view/${data._id}?ref=dashboard`,
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
                        "https://assets.iran.liara.run"
                      )
                  : data.contentType["media"][0]
                      .toString()
                      .replace(
                        "https://app-spanel.herokuapp.com",
                        "https://assets.iran.liara.run"
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
        <div
          className={styles.textBox}
          title={
            fields["name"]
              ? fields["name"][currentLocale]
                ? fields["name"][currentLocale]
                : typeof fields["name"] === "string"
                ? fields["name"]
                : ""
              : ""
          }
        >
          <span>
            {fields["name"]
              ? fields["name"][currentLocale]
                ? fields["name"][currentLocale]
                : typeof fields["name"] === "string"
                ? fields["name"]
                : ""
              : ""}
          </span>
        </div>
        <div
          className={"badge badge-light " + styles.label}
          title={contentType["title"][currentLocale]}
        >
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

import React from "react";
import errorTypes from "./../error-types";
import styles from "../styles.module.scss";

const {
  GET_CONTENT__CONTENT_TYPE,
  GET_CONTENT__FETCH_FAILED,
  GET_CONTENT__TYPE__FETCH_FAILED,
} = errorTypes;

const Error = ({ error }) => {
  const { sender } = error;
  return (
    <div className={styles.error}>
      {sender === GET_CONTENT__CONTENT_TYPE
        ? "There is no content type for this id"
        : "error"}
    </div>
  );
};
export default React.memo(Error);

import React from "react";
import styles from "./styles.module.scss";
import useLocale from "hooks/useLocale";
const String = ({ field, row }) => {
  const { currentLocale, makeLocalesValue } = useLocale();

  const type = typeof row["fields"][field.name];
  let value;
  if (type === "object" && row["fields"][field.name] !== null) {
    value = row["fields"][field.name][currentLocale];
  } else value = row["fields"][field.name];

  return <div className={styles.string}>{value}</div>;
};

export default String;

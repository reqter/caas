import React from "react";
import Form from "../Form";
import styles from "./styles.module.scss";

export default function Filters({ selectedContentType }) {
  const formRef = React.useRef(null);
  return (
    <Form
      ref={formRef}
      mode="filter"
      rowColumns={2}
      filters={{}}
      initialValues={{}}
      fieldsArray={selectedContentType.fields.filter(
        (item) => item.allowFilter === true
      )}
    />
  );
}

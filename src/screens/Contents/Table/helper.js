import React from "react";
import Column from "rsuite-table/lib/Column";
import HeaderCell from "rsuite-table/lib/HeaderCell";
import Cell from "rsuite-table/lib/Cell";
import styles from "./styles.module.scss";
import {
  Actions,
  Boolean,
  DateTime,
  JsonObject,
  KeyValue,
  Location,
  Media,
  Number,
  Reference,
  RichText,
  String
} from "./components/cells";
export const getColumns = (fields, columnWidth, lang) => {
  let c = fields.map(f => {
    return (
      <Column width={columnWidth} key={f.name} resizable sortable>
        <HeaderCell>{f.title[lang]}</HeaderCell>
        <Cell>{rowData => <String field={f} row={rowData} />}</Cell>
      </Column>
    );
  });

  return c;
};
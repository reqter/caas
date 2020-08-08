import React from "react";
import { ColumnWrapper, String, Option, Reference } from "./components";
export const renderFields = (
  mode,
  rowColumns,
  fieldsArray = [],
  initialValues = {},
  filters = {}
) => {
  const length = fieldsArray.length;
  return fieldsArray.map((item) => {
    const type = item.type ? item.type.toLowerCase() : "string";

    switch (type) {
      case "string":
        return (
          <ColumnWrapper
            fieldsLength={length}
            key={item.name}
            rowColumns={rowColumns}
            colSpan={item.colSpan}
          >
            <String
              field={item}
              mode={mode}
              initialValue={initialValues && initialValues[item.name]}
              filter={filters && filters[item.name]}
            />
          </ColumnWrapper>
        );
      case "keyvalue":
        return (
          <ColumnWrapper
            fieldsLength={length}
            key={item.name}
            rowColumns={rowColumns}
            colSpan={item.colSpan}
          >
            <Option
              field={item}
              mode={mode}
              initialValue={initialValues && initialValues[item.name]}
              filter={filters && filters[item.name]}
            />
          </ColumnWrapper>
        );
      case "reference":
        return (
          <ColumnWrapper
            fieldsLength={length}
            key={item.name}
            rowColumns={rowColumns}
            colSpan={item.colSpan}
          >
            <Reference
              field={item}
              mode={mode}
              initialValue={initialValues && initialValues[item.name]}
              filter={filters && filters[item.name]}
            />
          </ColumnWrapper>
        );
      default:
        return null;
    }
  });
};

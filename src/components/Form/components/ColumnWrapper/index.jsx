import React from "react";
import style from "./styles.module.scss";
const ColumnWrapper = ({
  fieldsLength,
  rowColumns = 1,
  colSpan = 1,
  children,
}) => {
  const colSpanClass = () => {
    if (fieldsLength === 1) return style.col_1_of_1;
    switch (rowColumns) {
      case 1:
        return style.col_1_of_1;
      case 2:
        if (colSpan === 1) return style.col_1_of_2;
        if (colSpan === 2) return style.col_2_of_2;
      case 3:
        if (colSpan === 1) return style.col_1_of_3;
        if (colSpan === 2) return style.col_2_of_3;
        if (colSpan === 3) return style.col_3_of_3;
      case 4:
        if (colSpan === 1) return style.col_1_of_4;
        if (colSpan === 2) return style.col_2_of_4;
        if (colSpan === 3) return style.col_3_of_4;
        if (colSpan === 4) return style.col_4_of_4;
      default:
        return style.col_1_of_1;
    }
  };

  return (
    <div className={style.columnWrapper + " " + colSpanClass()}>{children}</div>
  );
};
export default ColumnWrapper;

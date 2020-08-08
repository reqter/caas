import React, { useState, useEffect } from "react";
import { t } from "services/languageManager";
import { useLocale } from "hooks";
import ContentTypeList from "components/ContentTypeList";
import BoxLayout from "components/BoxLayout";

const List = ({
  handleEditType,
  handleDeleteType,
  handleShowFields,
  onVisibleToClicked,
  rightContent,
}) => {
  const [selected, setSelected] = useState({});
  const { currentLocale } = useLocale();
  useEffect(() => {
    if (!rightContent) {
      setSelected({});
    }
  }, [rightContent]);
  return (
    <BoxLayout>
      <ContentTypeList
        renderActions={(contentType) => {
          return (
            <div className="ct__actions">
              <button
                className="btn btn-light"
                size="xs"
                onClick={() => handleEditType(contentType)}
              >
                <i className="icon-pencil" />
              </button>
              <button
                className="btn btn-light"
                size="xs"
                onClick={() => handleDeleteType(contentType)}
              >
                <i className="icon-bin" />
              </button>
              <button
                className="btn btn-light"
                size="xs"
                onClick={() => {
                  setSelected(contentType);
                  handleShowFields(contentType);
                }}
              >
                <span style={{ fontSize: 12 }}>{t("ITEM_TYPES_FIELDS")}</span>
              </button>
              <button
                className="btn btn-light"
                size="xs"
                onClick={() => {
                  onVisibleToClicked(contentType);
                }}
              >
                <span style={{ fontSize: 12 }}>
                  {t("ITEM_TYPES_ACCESS_RIGHT")}
                </span>
              </button>
            </div>
          );
        }}
      />
    </BoxLayout>
  );
};
export default List;

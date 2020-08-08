import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { t } from "services/languageManager";
import useGlobalState from "services/stateManager";
import PageLayout from "components/PageLayout";
import BoxLayout from "components/BoxLayout";
import ContentTypeList from "components/ContentTypeList";

const ContentTypes = ({ history }) => {
  const [{}, dispatch] = useGlobalState();
  return (
    <PageLayout
      title={t("HOME_SIDE_NAV_CONTENTS")}
      description={t("HOME_SIDE_NAV_CONTENTS_DESC")}
      renderHeader={() => <div></div>}
    >
      <BoxLayout>
        <ContentTypeList
          title="Select content type to browse its data"
          isLinkableName={true}
          onClickLink={(contentType) =>
            window.open(
              window.origin + `/panel/contents/${contentType._id}`,
              "_blank"
            )
          }
          onClickRow={(contentType) => {
            dispatch({
              type: "SAVE_CONTENT_TYPE",
              payload: contentType,
            });
            history.push(`/panel/contents/${contentType._id}`);
          }}
          renderActions={(contentType) => {
            return (
              <>
                <Link
                  className="btn btn-light btn-sm"
                  to={`/contents/new/${contentType._id}`}
                >
                  Add New
                </Link>
                <button className="btn btn-light btn-sm">Browse</button>
              </>
            );
          }}
        />
      </BoxLayout>
    </PageLayout>
  );
};
export default ContentTypes;

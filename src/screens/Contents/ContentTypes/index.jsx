import React, { useEffect, useState } from "react";
import { t } from "services/languageManager";
import useGlobalState from "services/stateManager";
import { getContentTypes } from "Api/content-api";
import useFetch from "hooks/useFetch";
import styles from "./styles.module.scss";
import PageLayout from "components/PageLayout";
import BoxLayout from "components/BoxLayout";
import Item from "./item";
import EmptyListIcon from "components/Commons/ErrorsComponent/EmptyList";
import Loading from "components/Commons/Loading";

const ContentTypes = ({ history }) => {
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const [loading, data, error] = useFetch(getContentTypes, {
    spaceId: spaceInfo.id
  });

  return (
    <PageLayout
      title={t("HOME_SIDE_NAV_CONTENTS")}
      description={t("HOME_SIDE_NAV_CONTENTS_DESC")}
      renderHeader={() => <div></div>}
    >
      <BoxLayout>
        <h4 className={styles.boxTitle}>
          Select content type to browse its data
        </h4>
        <div className={styles.input}>
          <input className="form-control input-lg" placeholder="Search..." />
          <button className="btn btn-info">Search</button>
        </div>
        {loading ? (
          <Loading />
        ) : error ? (
          "error"
        ) : data && data.length > 0 ? (
          data.map(type => (
            <Item key={type._id} contentType={type} history={history} />
          ))
        ) : (
          <EmptyListIcon />
        )}
      </BoxLayout>
    </PageLayout>
  );
};
export default ContentTypes;

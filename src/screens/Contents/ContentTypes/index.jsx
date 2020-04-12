import React, { useEffect, useState, useRef } from "react";
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
import useLocale from "hooks/useLocale";

const ContentTypes = ({ history }) => {
  const allData = useRef([]);
  const { currentLocale } = useLocale();
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const [loading, data, error, localSearch] = useFetch(getContentTypes, {
    spaceId: spaceInfo.id,
  });
  function handleSearchText(e) {
    const value = e.target.value;
    if (value.length === 0) {
      localSearch((allData) => allData);
    } else {
      localSearch((allData) => {
        const d = allData.filter((item) => {
          const title = item.title ? item.title[currentLocale] : "";
          if (title.includes(value)) {
            return item;
          }
          return false;
        });
        return d;
      });
    }
  }
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
          <input
            className="form-control input-lg"
            placeholder="Search by name"
            onChange={handleSearchText}
          />
          <button className="btn btn-info">Search</button>
        </div>
        {loading ? (
          <Loading />
        ) : error ? (
          "error"
        ) : data && data.length > 0 ? (
          data.map((type) => (
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

import React, { useEffect, useState, useRef } from "react";
import { t } from "services/languageManager";
import useGlobalState from "services/stateManager";
import styles from "./styles.module.scss";
import PageLayout from "components/PageLayout";
import BoxLayout from "components/BoxLayout";
import Item from "./item";
import EmptyListIcon from "components/Commons/ErrorsComponent/EmptyList";
import Loading from "components/Commons/Loading";
import useLocale from "hooks/useLocale";
import useContentTypeApi from "hooks/useContentTypeApi";

const ContentTypes = ({
  title,
  showSearchInput,
  isLinkableName = false,
  onClickLink,
  onClickRow,
  renderActions,
}) => {
  const { _getContentTypes } = useContentTypeApi();
  const allData = useRef([]);
  const { currentLocale } = useLocale();
  const [{ contentTypes, spaceInfo }, dispatch] = useGlobalState();

  const [state, setState] = useState({
    loading: true,
    error: false,
    data: [],
  });
  const { loading, error } = state;
  const updateState = (changes) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };
  React.useEffect(() => {
    _getContentTypes(
      (result) => {
        allData.current = result;
        updateState({ loading: false, error: false });
      },
      () => {
        updateState({ loading: false, error: true });
      }
    );
  }, []);
  function handleSearchText(e) {
    const value = e.target.value;
    if (value.length === 0) {
      dispatch({
        type: "SET_CONTENT_TYPES",
        payload: allData.current,
      });
    } else {
      const d = allData.current.filter((item) => {
        const title = item.title ? item.title[currentLocale] : "";
        if (title.includes(value)) {
          return item;
        }
        return false;
      });
      dispatch({
        type: "SET_CONTENT_TYPES",
        payload: d,
      });
    }
  }
  return (
    <>
      {title && <h4 className={styles.boxTitle}>{title}</h4>}
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
      ) : contentTypes && contentTypes.length > 0 ? (
        contentTypes.map((type) => (
          <Item
            key={type._id}
            contentType={type}
            isLinkableName={isLinkableName}
            onClickLink={onClickLink}
            onClickRow={onClickRow}
            renderActions={renderActions}
          />
        ))
      ) : (
        <EmptyListIcon message="There aren't any created content type." />
      )}
    </>
  );
};
export default ContentTypes;

import React, { useState, useEffect, useMemo } from "react";
import styles from "./styles.module.scss";
import useGlobalState from "services/stateManager";
import { t, currentLang } from "services/languageManager";
import { getContentById, getContentTypeById } from "Api/content-api";
import { useLocale } from "hooks";
import Header from "./components/Header";
import Error from "./components/Error";
import ContentTypeBox from "./components/ContentTypeBox";
import Form from "./components/Form";
import Loading from "components/Commons/Loading";
import errorTypes from "./error-types";
import getQueryParam from "utils/getQueryParam";

const UpsertContent = ({ match, history }) => {
  const { currentLocale } = useLocale();
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const updateMode = useMemo(() => (match.url.includes("edit") ? true : false));
  const viewMode = useMemo(() => (match.url.includes("view") ? true : false));

  const [state, setState] = useState({
    loading: true,
    error: false,
    contentType: null,
    item: null,
  });
  function updateState(changes) {
    setState((prevState) => ({ ...prevState, ...changes }));
  }
  useEffect(() => {
    if (updateMode || viewMode) {
      const id = match.params.id.split("?")[0];
      _getContentById(id);
    } else _getContentTypeById(match.params.id);
  }, [match.params.id]);

  function _getContentById(contentId) {
    getContentById()
      .onOk((result) => {
        if (result) {
          if (!result.contentType) {
            updateState({
              loading: false,
              error: { sender: errorTypes.GET_CONTENT__CONTENT_TYPE },
            });
          } else {
            let ctype = result.contentType;
            delete result.contentType;
            updateState({
              loading: false,
              item: result,
              contentType: ctype,
            });
          }
        }
      })
      .onServerError((result) => {
        updateState({
          loading: false,
          error: { sender: errorTypes.GET_CONTENT__FETCH_FAILED },
        });
      })
      .onBadRequest((result) => {
        updateState({
          loading: false,
          error: { sender: errorTypes.GET_CONTENT__FETCH_FAILED },
        });
      })
      .unAuthorized((result) => {
        updateState({
          loading: false,
          error: { sender: errorTypes.GET_CONTENT__FETCH_FAILED },
        });
      })
      .notFound(() => {
        updateState({
          loading: false,
          error: { sender: errorTypes.GET_CONTENT__FETCH_FAILED },
        });
      })
      .call(spaceInfo.id, contentId);
  }
  function _getContentTypeById(contentTypeId) {
    getContentTypeById()
      .onOk((result) => {
        updateState({
          loading: false,
          contentType: result,
          error: false,
        });
      })
      .onServerError((result) => {
        updateState({
          loading: false,
          error: { sender: errorTypes.GET_CONTENT__TYPE__FETCH_FAILED },
        });
      })
      .onBadRequest((result) => {
        updateState({
          loading: false,
          error: { sender: errorTypes.GET_CONTENT__TYPE__FETCH_FAILED },
        });
      })
      .unAuthorized((result) => {
        updateState({
          loading: false,
          error: { sender: errorTypes.GET_CONTENT__TYPE__FETCH_FAILED },
        });
      })
      .notFound(() => {
        updateState({
          loading: false,
          error: { sender: errorTypes.GET_CONTENT__TYPE__FETCH_FAILED },
        });
      })
      .call(spaceInfo.id, contentTypeId);
  }
  function backToProducts() {
    history.push("/panel/contents");
  }
  const { error, loading, contentType, item } = state;
  function handleBackButtonClicked() {
    const refParam = getQueryParam("ref");
    if (contentType && refParam) {
      if (refParam === "list")
        history.push(`/panel/contents/${contentType._id}`);
      if (refParam === "dashboard") history.push(`/panel/home`);
    } else history.push("/panel/contents");
  }
  return (
    <div className={styles.wrapper}>
      <Header
        formMode={updateMode ? "edit" : viewMode ? "view" : "new"}
        contentType={contentType}
        onBackButtonClicked={handleBackButtonClicked}
      />
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : error ? (
        <Error error={error} />
      ) : (
        <div className={styles.content}>
          <ContentTypeBox contentType={contentType} />
          <Form
            formMode={updateMode ? "edit" : viewMode ? "view" : "new"}
            contentType={contentType}
            item={item}
            onSubmitClose={handleBackButtonClicked}
          />
        </div>
      )}
    </div>
  );
};

export default UpsertContent;

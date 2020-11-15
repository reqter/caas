import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import useLocale from "hooks/useLocale";
import Alert from "components/PopupAlert";
import { t } from "services/languageManager";
import useGlobalState from "services/stateManager";
import styles from "../styles.module.scss";
import {
  deleteContent,
  publish,
  unPublish,
  archive,
  unArchive,
} from "Api/content-api";

const Actions = ({ row, onStartAction, onEndAction, history }) => {
  const { status } = row;
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const { currentLocale } = useLocale();
  const [alertData, setAlertData] = useState();

  const showwMsg = (message, type) =>
    dispatch({
      type: "ADD_NOTIFY",
      value: {
        type,
        message,
      },
    });
  const _publish = (e) => {
    e.stopPropagation();
    if (onStartAction) onStartAction();
    publish()
      .onOk((result) => {
        showwMsg("Published Successfully", "success");
        if (onEndAction) onEndAction("success");
      })
      .onServerError((result) => {
        showwMsg("Error occurred", "error");
        if (onEndAction) onEndAction("error");
      })
      .onBadRequest((result) => {
        showwMsg("Error occurred", "error");
        if (onEndAction) onEndAction("error");
      })
      .unAuthorized((result) => {
        history.push("/app/login");
      })
      .notFound((result) => {
        showwMsg("Error occurred", "error");
        if (onEndAction) onEndAction("error");
      })
      .call(spaceInfo.id, row._id);
  };
  const _archive = (e) => {
    e.stopPropagation();
    if (onStartAction) onStartAction();
    archive()
      .onOk((result) => {
        showwMsg("Archived Successfully", "success");
        if (onEndAction) onEndAction("success");
      })
      .onServerError((result) => {
        showwMsg("Error occurred", "error");
        if (onEndAction) onEndAction("error");
      })
      .onBadRequest((result) => {
        showwMsg("Error occurred", "error");
        if (onEndAction) onEndAction("error");
      })
      .unAuthorized((result) => {
        history.push("/app/login");
      })
      .notFound((result) => {
        showwMsg("Error occurred", "error");
        if (onEndAction) onEndAction("error");
      })
      .call(spaceInfo.id, row._id);
  };
  const _unPublish = (e) => {
    e.stopPropagation();
    if (onStartAction) onStartAction();
    unPublish()
      .onOk((result) => {
        showwMsg("UnPublished Successfully", "success");
        if (onEndAction) onEndAction("success");
      })
      .onServerError((result) => {
        showwMsg("Error occurred", "error");
        if (onEndAction) onEndAction("error");
      })
      .onBadRequest((result) => {
        showwMsg("Error occurred", "error");
        if (onEndAction) onEndAction("error");
      })
      .unAuthorized((result) => {
        history.push("/app/login");
      })
      .notFound((result) => {
        showwMsg("Error occurred", "error");
        if (onEndAction) onEndAction("error");
      })
      .call(spaceInfo.id, row._id);
  };
  const _unArchive = (e) => {
    e.stopPropagation();
    if (onStartAction) onStartAction();
    unArchive()
      .onOk((result) => {
        showwMsg("UnArchived Successfully", "success");
        if (onEndAction) onEndAction("success");
      })
      .onServerError((result) => {
        showwMsg("Error occurred", "error");
        if (onEndAction) onEndAction("error");
      })
      .onBadRequest((result) => {
        showwMsg("Error occurred", "error");
        if (onEndAction) onEndAction("error");
      })
      .unAuthorized((result) => {
        history.push("/app/login");
      })
      .notFound((result) => {
        showwMsg("Error occurred", "error");
        if (onEndAction) onEndAction("error");
      })
      .call(spaceInfo.id, row._id);
  };
  const showRemoveAlert = (e) => {};
  const edit = (e) => {
    if (onStartAction) onStartAction("edit");
    e.stopPropagation();
    history.push({
      pathname: `/app/contents/edit/${row._id}?ref=list`,
    });
  };
  const remove = (e) => {
    e.stopPropagation();
    setAlertData({
      type: "error",
      title: "Remove Content",
      message: "Are you sure to remove?",
      isAjaxCall: true,
      okTitle: "Remove",
      cancelTitle: "Don't remove",
      onOk: () => {
        e.stopPropagation();
        deleteContent()
          .onOk((result) => {
            setAlertData();
            showwMsg("Item removed succefully", "success");
            if (onEndAction) onEndAction("success");
          })
          .onServerError((result) => {
            setAlertData();
            showwMsg("Failed to remove item", "error");
            if (onEndAction) onEndAction("error");
          })
          .onBadRequest((result) => {
            setAlertData();
            showwMsg("Failed to remove item", "error");
            if (onEndAction) onEndAction("error");
          })
          .unAuthorized((result) => {
            setAlertData();
            showwMsg("Failed to remove item", "error");
            if (onEndAction) onEndAction("error");
          })
          .notFound((result) => {
            setAlertData();
            showwMsg("Failed to remove item", "error");
            if (onEndAction) onEndAction("error");
          })
          .call(spaceInfo.id, row._id);
      },
      onCancel: () => {
        setAlertData();
      },
    });
  };
  return (
    <div className={styles.content_actions}>
      <button className="btn btn-outline-info btn-sm" onClick={(e) => edit(e)}>
        Edit
      </button>
      {status !== "published" && status !== "archived" && (
        <button
          className="btn btn-outline-info btn-sm"
          onClick={(e) => remove(e)}
        >
          <i className="icon-bin" />
        </button>
      )}
      {status === "draft" ? (
        <>
          <button
            className="btn btn-outline-info btn-sm"
            onClick={(e) => _publish(e)}
          >
            {t("PUBLISH")}
          </button>
          <button
            className="btn btn-outline-info btn-sm"
            onClick={(e) => _archive(e)}
          >
            {t("ARCHIVE")}
          </button>
        </>
      ) : status === "changed" ? (
        <>
          <button
            className="btn btn-outline-info btn-sm"
            onClick={(e) => _publish(e)}
          >
            {t("PUBLISH")}
          </button>
          <button
            className="btn btn-outline-info btn-sm"
            onClick={(e) => _archive(e)}
          >
            {t("ARCHIVE")}
          </button>
        </>
      ) : status === "archived" ? (
        <button
          className="btn btn-outline-info btn-sm"
          onClick={(e) => _unArchive(e)}
        >
          {t("UN_ARCHIVE")}
        </button>
      ) : status === "published" ? (
        <button
          className="btn btn-outline-info btn-sm"
          onClick={(e) => _unPublish(e)}
        >
          {t("UN_PUBLISH")}
        </button>
      ) : (
        ""
      )}
      {alertData && <Alert data={alertData} />}
    </div>
  );
};

export default withRouter(Actions);

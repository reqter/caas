import React, { useState, useEffect } from "react";
import "./styles.scss";
import { languageManager, useGlobalState } from "services";
import Alert from "components/PopupAlert";
import CircleSpinner from "components/CircleSpinner";
import AssetRow from "./AssetRow";
import {
  getAssets,
  deleteAsset,
  filterAssets,
  publish,
  unPublish,
  archive,
  unArchive
} from "Api/asset-api";
import { useLocale } from "hooks";
const filters = [
  {
    id: "0",
    name: "all",
    title: {
      en: "All Assets",
      fa: "همه"
    },
    icon: "icon-folder"
  },
  {
    id: "1",
    name: "image",
    title: {
      en: "Image",
      fa: "تصاویر"
    },
    icon: "icon-images"
  },
  {
    id: "2",
    name: "video",
    title: {
      en: "Video",
      fa: "ویدیو"
    },
    icon: "icon-video"
  },
  {
    id: "3",
    name: "audio",
    title: {
      en: "Audio",
      fa: "فایل صوتی"
    },
    icon: "icon-audio"
  },
  {
    id: "4",
    name: "application/pdf",
    title: {
      en: "PDF",
      fa: "پی دی اف"
    },
    icon: "icon-pdf"
  }
];

const pageTitle = languageManager.translate("HOME_SIDE_NAV_ASSETS_MANAGER");
const pageDescription = languageManager.translate(
  "HOME_SIDE_NAV_ASSETS_MANAGER_DESC"
);
const currentLang = languageManager.getCurrentLanguage().name;
const limit = 50;
const Assets = props => {
  const { currentLocale } = useLocale();
  let didCancel = false;

  const [{ assets, status, spaceInfo }, dispatch] = useGlobalState();
  const [spinner, toggleSpinner] = useState(true);
  const [skip, setSkip] = useState(0);

  const [selectedFileType, setFileType] = useState(filters[0]);
  const [selectedStatus, setStatus] = useState({});
  const [alertData, setAlertData] = useState();

  useEffect(() => {
    doFilter(selectedFileType.name, undefined, skip, limit);
    //    getAssets()
    // .onOk(result => {
    //   if (!didCancel) {
    //     toggleSpinner(false);
    //     dispatch({
    //       type: "SET_ASSETS",
    //       value: result
    //     });
    //   }
    // })
    // .onServerError(result => {
    //   if (!didCancel) {
    //     toggleSpinner(false);
    //     dispatch({
    //       type: "ADD_NOTIFY",
    //       value: {
    //         type: "error",
    //         message: languageManager.translate("ASSET_GET_ON_SERVER_ERROR")
    //       }
    //     });
    //   }
    // })
    // .onBadRequest(result => {
    //   if (!didCancel) {
    //     toggleSpinner(false);
    //     dispatch({
    //       type: "ADD_NOTIFY",
    //       value: {
    //         type: "error",
    //         message: languageManager.translate("ASSET_GET_ON_BAD_REQUEST")
    //       }
    //     });
    //   }
    // })
    // .unAuthorized(result => {
    //   if (!didCancel) {
    //     props.history.replace("/login");
    //     dispatch({
    //       type: "ADD_NOTIFY",
    //       value: {
    //         type: "warning",
    //         message: languageManager.translate("ASSET_GET_UN_AUTHORIZED")
    //       }
    //     });
    //   }
    // })
    // .notFound(result => {
    //   if (!didCancel) {
    //     toggleSpinner(false);
    //   }
    // })
    // .call(spaceInfo.id);

    return () => {
      didCancel = true;
    };
  }, []);

  function translate(key) {
    return languageManager.translate(key);
  }
  const prevPage = () => {
    setSkip(prev => prev - 1);
    doFilter(
      selectedFileType.name,
      selectedStatus.name,
      (skip - 1) * limit,
      limit
    );
  };
  const nextPage = () => {
    setSkip(prev => prev + 1);
    doFilter(
      selectedFileType.name,
      selectedStatus.name,
      (skip + 1) * limit,
      limit
    );
  };
  function doFilter(fileType, status, skip, limit) {
    if (assets && assets.length > 0)
      dispatch({
        type: "SET_ASSETS",
        value: []
      });
    toggleSpinner(true);
    filterAssets()
      .onOk(result => {
        toggleSpinner(false);
        const data =
          result &&
          result.map((item, index) => {
            return {
              ...item,
              index: skip + parseInt(index) + 1
            };
          });
        dispatch({
          type: "SET_ASSETS",
          value: data
        });
      })
      .onServerError(result => {
        toggleSpinner(false);
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("ASSET_GET_ON_SERVER_ERROR")
          }
        });
      })
      .onBadRequest(result => {
        toggleSpinner(false);
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("ASSET_GET_ON_BAD_REQUEST")
          }
        });
      })
      .unAuthorized(result => {
        toggleSpinner(false);
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "warning",
            message: languageManager.translate("ASSET_GET_UN_AUTHORIZED")
          }
        });
      })
      .notFound(result => {
        toggleSpinner(false);
      })
      .call(
        spaceInfo.id,
        fileType === "all" ? undefined : [fileType],
        status ? [status] : undefined,
        skip,
        limit
      );
  }
  function handleFileTypeClick(selected) {
    setSkip(0);
    setFileType(selected);
    doFilter(selected.name, selectedStatus.name, 0, limit);
  }
  function handleStatusClick(selected) {
    setSkip(0);
    setStatus(selected);
    doFilter(selectedFileType.name, selected.name, 0, limit);
  }
  function openUploader() {
    props.history.push("/asset/new");
  }
  function openUploaderForEdit(e, file) {
    props.history.push(`/asset/edit/${file._id}`);
    e.stopPropagation();
  }
  function viewAsset(file) {
    props.history.push(`/asset/view/${file._id}`);
  }
  function showRemoveAlert(e, item) {
    setAlertData({
      type: "error",
      title: "Remove Asset",
      message: "Are you sure to remove ?",
      isAjaxCall: true,
      okTitle: "Remove",
      cancelTitle: "Don't remove",
      onOk: () => removeAsset(e, item),
      onCancel: () => {
        setAlertData();
      }
    });
    e.stopPropagation();
  }
  function removeAsset(e, item) {
    e.stopPropagation();
    const deletedItem = item;
    deleteAsset()
      .onOk(result => {
        setAlertData();
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: languageManager.translate("ASSET_DELETE_ON_OK")
          }
        });
        dispatch({
          type: "DELETE_ASSET",
          value: deletedItem
        });
      })
      .onServerError(result => {
        setAlertData();
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("ASSET_DELETE_ON_SERVER_ERROR")
          }
        });
      })
      .onBadRequest(result => {
        setAlertData();
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("ASSET_DELETE_ON_BAD_REQUEST")
          }
        });
      })
      .unAuthorized(result => {
        setAlertData();
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "warning",
            message: languageManager.translate("ASSET_DELETE_UN_AUTHORIZED")
          }
        });
      })
      .notFound(result => {
        setAlertData();
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("ASSET_DELETE_NOT_FOUND")
          }
        });
      })
      .call(spaceInfo ? spaceInfo.id : undefined, item._id);
  }
  function archiveAsset(e, file) {
    e.stopPropagation();
    archive()
      .onOk(result => {
        doFilter(selectedFileType.name, selectedStatus.name);
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: languageManager.translate("The asset is archived")
          }
        });
        dispatch({
          type: "ARCHIVE_ASSET",
          value: result
        });
      })
      .onServerError(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Internal server error")
          }
        });
      })
      .onBadRequest(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Bad request")
          }
        });
      })
      .unAuthorized(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Un Authorized")
          }
        });
      })
      .notFound(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Asset not found")
          }
        });
      })
      .call(spaceInfo.id, file._id);
  }
  function unArchiveAsset(e, file) {
    e.stopPropagation();
    unArchive()
      .onOk(result => {
        doFilter(selectedFileType.name, selectedStatus.name);
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: languageManager.translate("The asset is unarchived")
          }
        });
        dispatch({
          type: "UN_ARCHIVE_ASSET",
          value: result
        });
      })
      .onServerError(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Internal server error")
          }
        });
      })
      .onBadRequest(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Bad request")
          }
        });
      })
      .unAuthorized(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Un Authorized")
          }
        });
      })
      .notFound(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Asset not found")
          }
        });
      })
      .call(spaceInfo.id, file._id);
  }
  function publishAsset(e, file) {
    e.stopPropagation();
    publish()
      .onOk(result => {
        doFilter(selectedFileType.name, selectedStatus.name);
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: languageManager.translate("The asset is published")
          }
        });
        dispatch({
          type: "PUBLISH_ASSET",
          value: result
        });
      })
      .onServerError(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Internal server error")
          }
        });
      })
      .onBadRequest(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Bad request")
          }
        });
      })
      .unAuthorized(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Un Authorized")
          }
        });
      })
      .notFound(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Asset not found")
          }
        });
      })
      .call(spaceInfo.id, file._id);
  }
  function unPublishAsset(e, file) {
    e.stopPropagation();
    unPublish()
      .onOk(result => {
        doFilter(selectedFileType.name, selectedStatus.name);
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: languageManager.translate("The asset is unpublished")
          }
        });
        dispatch({
          type: "UN_PUBLISH_ASSET",
          value: result
        });
      })
      .onServerError(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Internal server error")
          }
        });
      })
      .onBadRequest(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Bad request")
          }
        });
      })
      .unAuthorized(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Un Authorized")
          }
        });
      })
      .notFound(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("Asset not found")
          }
        });
      })
      .call(spaceInfo.id, file._id);
  }

  return (
    <>
      <div className="as-wrapper">
        <div className="as-header">
          <div className="as-header-left">
            <span className="as-header-title">{pageTitle}</span>
            <span className="as-header-description">{pageDescription}</span>
          </div>
          <div className="as-header-right" />
        </div>
        <div className="as-content">
          <div className="as-content-left">
            <div className="left-text">{translate("ASSET_FILTER_TITLE")}</div>
            <div className="left-btnContent">
              <button className="btn btn-primary" onClick={openUploader}>
                {translate("ASSET_FILTER_BTN_TEXT")}
              </button>
            </div>
            <div className="filterContent">
              <div className="left-filters">
                <div className="title">
                  {translate("ASSET_FILTER_BY_TYPE_TITLE")}
                </div>
                {filters.map(f => (
                  <div
                    className="filter"
                    key={f.id}
                    onClick={() => handleFileTypeClick(f)}
                    style={{
                      color:
                        f.id === selectedFileType.id
                          ? "rgb(56,132,255)"
                          : "black"
                    }}
                  >
                    <i className={["icon", f.icon].join(" ")} />
                    <span className="name">
                      {f.title && f.title[currentLang]}
                    </span>
                    <span
                      className="icon-circle-o iconSelected"
                      style={{
                        display: f.id === selectedFileType.id ? "block" : "none"
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="left-filters">
                <div className="title">
                  {translate("ASSET_FILTER_BY_STATUS_TITLE")}
                </div>
                {status.map(f => (
                  <div
                    className="filter"
                    key={f.id}
                    onClick={() => handleStatusClick(f)}
                    style={{
                      color:
                        f.id === selectedStatus.id ? "rgb(56,132,255)" : "black"
                    }}
                  >
                    <i className={["icon", f.icon].join(" ")} />
                    <span className="name">{translate(f.name)}</span>
                    <span
                      className="icon-circle-o iconSelected"
                      style={{
                        display: f.id === selectedStatus.id ? "block" : "none"
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="as-content-right">
            <div className="header">
              {translate("ASSET_TABLE_HEADER_ALL_ASSETS")}&nbsp;&nbsp;
              <CircleSpinner show={spinner} size="small" />
              <div className="as-content-pagination">
                {skip === 0 && assets.length < limit ? null : (
                  <>
                    <button
                      className="pagination-btn btn-left"
                      disabled={skip === 0}
                      onClick={prevPage}
                    >
                      <i className="icon-circle-left" />
                    </button>
                    <span className="pagination-text">Page {skip + 1}</span>
                    <button
                      className="pagination-btn btn-right"
                      disabled={!assets || assets.length < 50}
                      onClick={nextPage}
                    >
                      <i className="icon-circle-right" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="rightTable">
              <table className="table">
                <thead className="table__head">
                  <tr>
                    <th>#</th>
                    <th>{translate("ASSET_TABLE_HEAD_PREVIEW")}</th>
                    <th>{translate("ASSET_TABLE_HEAD_NAME")}</th>
                    <th>{translate("ASSET_TABLE_HEAD_BY")}</th>
                    <th>{translate("ASSET_TABLE_HEAD_STATUS")}</th>
                    <th>{translate("ASSET_TABLE_HEAD_ACTIONS")}</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((file, index) => (
                    <AssetRow
                      key={index}
                      file={file}
                      viewAsset={viewAsset}
                      publishAsset={publishAsset}
                      archiveAsset={archiveAsset}
                      unArchiveAsset={unArchiveAsset}
                      unPublishAsset={unPublishAsset}
                      openUploaderForEdit={openUploaderForEdit}
                      showRemoveAlert={showRemoveAlert}
                      t={languageManager}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {alertData && <Alert data={alertData} />}
    </>
  );
};

export default Assets;

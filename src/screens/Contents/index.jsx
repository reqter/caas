import React, { useEffect, useState, useRef } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { useGlobalState, languageManager } from "../../services";
import {
  getContents,
  filterContents,
  deleteContent,
  publish,
  unPublish,
  archive,
  unArchive
} from "Api/content-api";
import "./styles.scss";
import { useLocale } from "hooks";

import Alert from "components/PopupAlert";
import CircleSpinner from "components/CircleSpinner";
import DateFormater from "components/DateFormater";
import {
  ContentTypesFilter,
  StatusFilter
} from "components/Commons/ContentFilters";

const Contents = props => {
  const { currentLocale } = useLocale();
  let didCancel = false;
  //#region controller
  const currentLang = languageManager.getCurrentLanguage().name;
  let columns = [
    {
      Header: "#",
      //show: false,
      width: 70,
      headerStyle: {
        display: "none"
      },
      Cell: props => {
        return (
          <div className="p-number">
            <div className="p-number-value">{props.index + 1}</div>
          </div>
        );
      }
    },
    {
      width: 100,
      Header: () => <div className="p-header-td">Thumbnail</div>,
      //show: false,
      headerStyle: {
        display: "none"
      },
      accessor: "contentType",
      Cell: props => {
        return (
          <div className="p-image">
            {props.value ? (
              props.value.media && props.value.media.length > 0 ? (
                getAssetUi(props.value.media[0][currentLocale])
              ) : (
                <div className="p-thumbnail-file empty">
                  {/* <i className="file-text" /> */}
                  empty
                </div>
              )
            ) : (
              <div className="p-thumbnail-file empty">
                {/* <i className="file-text" /> */}
                empty
              </div>
            )}
          </div>
        );
      }
    },
    {
      Header: () => <div className="p-header-td">Name</div>,
      //show: false,
      headerStyle: {
        display: "none"
      },
      accessor: "fields",
      Cell: props => {
        return (
          <div className="p-name">
            <span>
              {props.value
                ? props.value["name"]
                  ? props.value["name"][currentLocale]
                    ? props.value["name"][currentLocale]
                    : typeof props.value["name"] === "string"
                    ? props.value["name"]
                    : ""
                  : ""
                : ""}
            </span>
            <span>
              {props.value
                ? props.value["shortDesc"]
                  ? props.value["shortDesc"][currentLocale]
                    ? props.value["shortDesc"][currentLocale]
                    : typeof props.value["shortDesc"] === "string"
                    ? props.value["shortDesc"]
                    : ""
                  : ""
                : ""}
            </span>
          </div>
        );
      }
    },
    {
      Header: () => <div className="p-header-td">Issuer</div>,
      width: 130,
      //show: false,
      headerStyle: {
        display: "none"
      },
      accessor: "sys",
      Cell: props => (
        <div className="p-issuer">
          <span>{props.value.issuer && props.value.issuer.fullName}</span>
          <span>
            <DateFormater date={props.value.issueDate} />
          </span>
        </div>
      )
    },
    {
      Header: () => <div className="p-header-td">Content Type</div>,
      width: 110,
      //show: false,
      headerStyle: {
        display: "none"
      },
      accessor: "contentType",
      Cell: props => {
        return (
          <div className="p-contentType">
            <span className="badge badge-light">
              {props.value
                ? props.value.title && props.value.title[currentLocale]
                  ? props.value.title[currentLocale]
                  : props.value.title
                : ""}
            </span>
          </div>
        );
      }
    },
    {
      Header: () => <div className="p-header-td">Status</div>,
      width: 110,
      //show: false,
      headerStyle: {
        display: "none"
      },
      accessor: "status",
      Cell: props => (
        <div className="p-contentType">
          <span className="badge badge-primary">
            {languageManager.translate(props.value)}
          </span>
        </div>
      )
    },
    {
      Header: "Actions",
      //show: false,
      headerStyle: {
        display: "none"
      },
      clickable: false,
      Cell: props => {
        const { status } = props.original;
        return (
          <div className="p-actions">
            <button
              className="btn btn-light btn-sm"
              onClick={() => handleEditRow(props)}
            >
              Edit
            </button>
            {status !== "published" && status !== "archived" && (
              <button
                className="btn btn-light btn-sm"
                onClick={() => handleDeleteRow(props)}
              >
                <i className="icon-bin" />
              </button>
            )}
            {status === "draft" ? (
              <>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => publishContent(props)}
                >
                  {languageManager.translate("PUBLISH")}
                </button>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => archiveContent(props)}
                >
                  {languageManager.translate("ARCHIVE")}
                </button>
              </>
            ) : status === "changed" ? (
              <>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => publishContent(props)}
                >
                  {languageManager.translate("PUBLISH")}
                </button>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => archiveContent(props)}
                >
                  {languageManager.translate("ARCHIVE")}
                </button>
              </>
            ) : status === "archived" ? (
              <button
                className="btn btn-light btn-sm"
                onClick={() => unArchiveContent(props)}
              >
                {languageManager.translate("UN_ARCHIVE")}
              </button>
            ) : status === "published" ? (
              <button
                className="btn btn-light btn-sm"
                onClick={() => unPublishContent(props)}
              >
                {languageManager.translate("UN_PUBLISH")}
              </button>
            ) : (
              ""
            )}
          </div>
        );
      }
    }
  ];
  const pageTitle = languageManager.translate("HOME_SIDE_NAV_CONTENTS");
  const pageDescription = languageManager.translate(
    "HOME_SIDE_NAV_CONTENTS_DESC"
  );

  // variables
  const [
    { contents, contentTypes, spaceInfo, contentPage },
    dispatch
  ] = useGlobalState();

  const tableBox = useRef(null);
  const [contentActions, toggleContentActions] = useState({});
  const [headerActions, toggleHeaderActions] = useState(false);
  const [spinner, toggleSpinner] = useState(true);
  const [leftContent, toggleLeftContent] = useState(contentPage.filterBox);
  const [alertData, setAlertData] = useState();

  const [searchText, setSearchText] = useState("");
  const [selectedContentType, setSelectedContentType] = useState({});
  const [selectedNode, setSelectedNode] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});

  const [dataFilters, setFilters] = useState(contentPage.filters);
  const [dataStatus, toggleDataStatus] = useState(false);

  useEffect(() => {
    if (!contentPage.filters || contentPage.filters.length === 0) toggleFilterBox();
    else {
      let text, contentTypeID, status;
      const c = contentPage.filters.find(
        item => item.sys.type == "contentType"
      );
      if (c) {
        setSelectedContentType(c);
        contentTypeID = c._id;
      }
      const s = contentPage.filters.find(item => item.sys.type == "status");
      if (s) {
        setSelectedStatus(s);
        status = s.name;
      }
      filterData(text, contentTypeID, undefined, status);
    }
    // loadContents();
    return () => {
      didCancel = true;
    };
  }, []);

  function loadContents() {
    getContents()
      .onOk(result => {
        if (!didCancel) {
          dispatch({
            type: "SET_CONTENTS",
            value: result
          });
          toggleSpinner(false);
        }
      })
      .onServerError(result => {
        if (!didCancel) {
          toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: languageManager.translate("CONTENTS_ON_SERVER_ERROR")
            }
          });
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
          toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: languageManager.translate("CONTENTS_ON_BAD_REQUEST")
            }
          });
        }
      })
      .unAuthorized(result => {
        if (!didCancel) {
          toggleSpinner(false);
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "warning",
              message: languageManager.translate("CONTENTS_UN_AUTHORIZED")
            }
          });
        }
      })
      .call(spaceInfo.id);
  }
  // methods
  function handleContentActions(id) {
    let newObj = { ...contentActions };
    newObj[id] = !newObj[id];
    toggleContentActions(newObj);
  }
  const imgs = ["jpg", "jpeg", "gif", "bmp", "png"];
  const videos = ["mp4", "3gp", "ogg", "wmv", "flv", "avi"];
  const audios = ["wav", "mp3", "ogg"];
  function getAssetUi(url) {
    const ext = url
      .split("/")
      .pop()
      .split(".")
      .pop();
    if (imgs.indexOf(ext.toLowerCase()) !== -1)
      return <img className="p-image-value" src={url} alt="" />;
    else if (videos.indexOf(ext.toLowerCase()) !== -1)
      return (
        <div className="p-thumbnail-file">
          <i className="icon-video" />
        </div>
      );
    else if (audios.indexOf(ext.toLowerCase()) !== -1)
      return (
        <div className="p-thumbnail-file">
          <i className="icon-audio" />
        </div>
      );
    else
      return (
        <div className="p-thumbnail-file unknown">
          <i className="icon-file-text" />
          .file
        </div>
      );
  }

  function toggleFilterBox() {
    toggleLeftContent(prevState => !prevState);
  }
  function newRequest() {
    props.history.push({
      pathname: "/requests/new",
      params: {
        requestFromContents: true
      }
    });
  }

  function removeFilter(filter) {
    let f = dataFilters.filter(item => item.sys.type !== filter.sys.type);
    setFilters(f);
    let text = searchText;
    let contentTypeID = selectedContentType
      ? selectedContentType._id
      : undefined;
    let categoryID = selectedNode ? selectedNode._id : undefined;
    let status = selectedStatus.name;
    if (filter.sys.type === "text") {
      text = undefined;
      setSearchText("");
    } else if (filter.sys.type === "contentType") {
      contentTypeID = undefined;
      setSelectedContentType({});
    } else if (filter.sys.type === "category") {
      categoryID = undefined;
      setSelectedNode({});
    } else if (filter.sys.type === "status") {
      status = undefined;
      setSelectedStatus({});
    }
    filterData(text, contentTypeID, categoryID, status);
  }
  function handleSearchChanged() {
    let f = [...dataFilters].filter(item => item.sys.type !== "text");
    if (searchText.length !== 0)
      f.push({
        sys: {
          type: "text"
        },
        name: searchText,
        title: searchText
      });
    setFilters(f);

    filterData(
      searchText,
      selectedContentType ? selectedContentType._id : undefined,
      selectedNode ? selectedNode._id : undefined,
      selectedStatus.name
    );
  }
  function handleContentTypeSelect(selected) {
    let f = dataFilters.filter(item => item.sys.type !== "contentType");
    f.push(selected);
    setFilters(f);
    setSelectedContentType(selected);
    filterData(
      searchText,
      selected._id,
      selectedNode ? selectedNode._id : undefined,
      selectedStatus.name
    );
  }

  function handleClickCategory(selected) {
    let f = dataFilters.filter(item => item.sys.type !== "category");
    f.push(selected);
    setFilters(f);
    setSelectedNode(selected);

    filterData(
      searchText,
      selectedContentType ? selectedContentType._id : undefined,
      selected._id,
      selectedStatus.name
    );
  }
  function handleStatusSelected(selected) {
    let f = dataFilters.filter(item => item.sys.type !== "status");
    selected.sys = {
      type: "status"
    };
    f.push(selected);
    setFilters(f);
    setSelectedStatus(selected);

    filterData(
      searchText,
      selectedContentType ? selectedContentType._id : undefined,
      selectedNode ? selectedNode._id : undefined,
      selected.name
    );
  }

  function filterData(text, contentTypeId, categoryId, status) {
    toggleSpinner(true);
    filterContents()
      .onOk(result => {
        toggleSpinner(false);
        dispatch({
          type: "SET_CONTENTS",
          value: result
        });
        if (dataStatus) toggleDataStatus(false);
      })
      .onServerError(result => {
        toggleSpinner(false);
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("CONTENTS_ON_SERVER_ERROR")
          }
        });
      })
      .onBadRequest(result => {
        toggleSpinner(false);
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: languageManager.translate("CONTENTS_ON_BAD_REQUEST")
          }
        });
      })
      .unAuthorized(result => {
        toggleSpinner(false);
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "warning",
            message: languageManager.translate("CONTENTS_UN_AUTHORIZED")
          }
        });
      })
      .call(
        spaceInfo.id,
        text,
        contentTypeId ? [contentTypeId] : undefined,
        categoryId ? [categoryId] : undefined,
        status ? [status] : undefined
      );
  }
  function handleDeleteRow(row) {
    setAlertData({
      type: "error",
      title: "Remove Content",
      message: "Are you sure to remove ?",
      isAjaxCall: true,
      okTitle: "Remove",
      cancelTitle: "Don't remove",
      onOk: () => {
        const deleted = row.original;
        deleteContent()
          .onOk(result => {
            setAlertData();
            dispatch({
              type: "DELETE_CONTENT",
              value: deleted
            });
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "success",
                message: languageManager.translate("CONTENTS_DELETE_ON_OK")
              }
            });
          })
          .onServerError(result => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "CONTENTS_DELETE_ON_SERVER_ERROR"
                )
              }
            });
          })
          .onBadRequest(result => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate(
                  "CONTENTS_DELETE_ON_BAD_REQUEST"
                )
              }
            });
          })
          .unAuthorized(result => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "warning",
                message: languageManager.translate(
                  "CONTENTS_DELETE_UN_AUTHORIZED"
                )
              }
            });
          })
          .notFound(result => {
            setAlertData();
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: languageManager.translate("CONTENTS_DELETE_NOT_FOUND")
              }
            });
          })
          .call(spaceInfo.id, row.original._id);
      },
      onCancel: () => {
        setAlertData();
      }
    });
  }
  function openNewItemBox() {
    props.history.push({
      pathname: "/contents/new"
    });
    dispatch({
      type: "SET_CONTENT_PAGE_STATUS",
      value: {
        filterBox: leftContent,
        filters: dataFilters
      }
    });
  }

  function handleEditRow(row) {
    props.history.push({
      pathname: `/contents/edit/${row.original._id}`
    });
    dispatch({
      type: "SET_CONTENT_PAGE_STATUS",
      value: {
        filterBox: leftContent,
        filters: dataFilters
      }
    });
  }
  function viewContent(row) {
    props.history.push({
      pathname: `/contents/view/${row._id}`,
      viewMode: true
    });
    dispatch({
      type: "SET_CONTENT_PAGE_STATUS",
      value: {
        filterBox: leftContent,
        filters: dataFilters
      }
    });
  }

  useEffect(() => {
    if (dataStatus) {
      filterData(
        searchText,
        selectedContentType ? selectedContentType._id : undefined,
        selectedNode ? selectedNode._id : undefined,
        selectedStatus.name
      );
    }
  }, [dataStatus]);
  function archiveContent(row) {
    archive()
      .onOk(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: languageManager.translate("The content is archived")
          }
        });
        toggleDataStatus(true);
        // dispatch({
        //   type: "CHANGE_CONTENT_STATUS",
        //   value: result,
        // });
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
      .call(spaceInfo.id, row.original._id);
  }
  function unArchiveContent(row) {
    unArchive()
      .onOk(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: languageManager.translate("The content is unarchived")
          }
        });
        toggleDataStatus(true);
        // dispatch({
        //   type: "CHANGE_CONTENT_STATUS",
        //   value: result,
        // });
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
      .call(spaceInfo.id, row.original._id);
  }
  function publishContent(row) {
    publish()
      .onOk(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: languageManager.translate("The content is published")
          }
        });
        toggleDataStatus(true);

        // dispatch({
        //   type: "CHANGE_CONTENT_STATUS",
        //   value: result,
        // });
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
      .call(spaceInfo.id, row.original._id);
  }
  function unPublishContent(row) {
    unPublish()
      .onOk(result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: languageManager.translate("The content is unpublished")
          }
        });
        toggleDataStatus(true);
        // dispatch({
        //   type: "CHANGE_CONTENT_STATUS",
        //   value: result,
        // });
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
      .call(spaceInfo.id, row.original._id);
  }
  //#endregion controller

  return (
    <>
      <div className="p-wrapper">
        <div className="p-header">
          <div className="p-header-left">
            <span className="p-header-title">{pageTitle}</span>
            <span className="p-header-description">{pageDescription}</span>
          </div>
          <div className="p-header-right">
            <div className="input-group">
              <div
                className="input-group-prepend"
                onClick={handleSearchChanged}
              >
                <span className="input-group-text searchBtn">Search</span>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Enter content name then click Search button"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={toggleFilterBox}>
              <i className="icon-filter" />
            </button>
            <button className="btn btn-primary" onClick={openNewItemBox}>
              New Content
            </button>
          </div>
        </div>
        <div className="p-content">
          {leftContent && (
            <div className="p-content-left animated fadeIn faster">
              <div className="filterBox">
                <div className="filter-header">Selected Filters</div>
                <div className="filter-body">
                  <div className="selectedFilters">
                    {dataFilters.length === 0 && (
                      <div className="empty-dataFilter">
                        There is no selected filter
                      </div>
                    )}
                    {dataFilters.map(filter => (
                      <div key={filter.id} className="filterItem">
                        <span className="filterText">
                          {filter.sys.type === "status"
                            ? languageManager.translate(filter.name)
                            : filter.title
                            ? filter.title[currentLocale]
                            : filter.title}
                        </span>
                        <span
                          className="icon-cross icon"
                          onClick={() => removeFilter(filter)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <ContentTypesFilter
                filters={dataFilters}
                leftContent={leftContent}
                data={contentTypes}
                onContentTypeSelect={selected =>
                  handleContentTypeSelect(selected)
                }
              />
              <StatusFilter
                filters={dataFilters}
                leftContent={leftContent}
                onStatusSelected={selected => handleStatusSelected(selected)}
              />
            </div>
          )}
          <div className="p-content-right" ref={tableBox}>
            <div className="p-content-right-header">
              <div className="p-content-header-title">
                All Data &nbsp;
                <CircleSpinner show={spinner} size="small" />
              </div>
            </div>
            <div className="p-content-right-body">
              <ReactTable
                data={contents}
                defaultPageSize={100000}
                minRows={2}
                columns={columns}
                showPaginationTop={false}
                showPaginationBottom={false}
                style={{
                  border: "none",
                  overflow: "auto",
                  height: "100%" // This will force the table body to overflow and scroll, since there is not enough room
                }}
                getTdProps={(state, rowInfo, column, instance) => {
                  return {
                    onClick: (e, handleOriginal) => {
                      if (handleOriginal) {
                        if (column.clickable === undefined)
                          viewContent(rowInfo.original);
                      }
                    }
                  };
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {alertData && <Alert data={alertData} />}
    </>
  );
};

export default Contents;

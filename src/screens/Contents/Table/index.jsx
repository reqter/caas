import React, { useState, useEffect, useRef } from "react";
import Table from "rsuite-table/lib/Table";
import Column from "rsuite-table/lib/Column";
import HeaderCell from "rsuite-table/lib/HeaderCell";
import Cell from "rsuite-table/lib/Cell";
import "rsuite-table/dist/css/rsuite-table.css";
import useFetch from "hooks/useFetch";
import useLocale from "hooks/useLocale";
import { getColumns } from "./helper";
// import Item from "./Item";
import { t } from "services/languageManager";
import useGlobalState from "services/stateManager";
import { filterContents, getContentTypeById } from "Api/content-api";
import PageLayout from "components/PageLayout";
import BoxLayout from "components/BoxLayout";
import EmptyListIcon from "components/Commons/ErrorsComponent/EmptyList";
import Loading from "components/Commons/Loading";
import DateFormater from "components/DateFormater";
import { Actions } from "./components/cells";
import Filters from "./components/Filters";
import Pagination from "./components/Pagination";
import styles from "./styles.module.scss";

const limit = 50;
const DataTable = ({ match, history }) => {
  const boxRef = useRef(null);
  const [{ spaceInfo, selectedContentType }] = useGlobalState();
  const { currentLocale } = useLocale();
  const [state, setState] = useState({
    loading: selectedContentType ? false : true,
    tableLoading: selectedContentType ? true : false,
    error: false,
    allData: [],
    tableData: [],
    contentType: selectedContentType ? selectedContentType : undefined,
    skip: 0,
    status: null,
    text: null,
    category: null
  });
  const {
    loading,
    allData,
    tableData,
    error,
    contentType,
    tableLoading,
    skip,
    text,
    status,
    category
  } = state;
  const updateState = changes => {
    setState(prevState => ({ ...prevState, ...changes }));
  };
  useEffect(() => {
    if (selectedContentType) {
      updateState({ tableLoading: true });
      getData(text, selectedContentType, category, status, skip, limit);
    } else {
      getContentTypeColumns();
    }
  }, []);
  const getContentTypeColumns = () => {
    getContentTypeById()
      .onOk(result => {
        updateState({
          loading: false,
          tableLoading: true,
          contentType: result
        });
        getData(text, result, category, status, skip, limit);
      })
      .onServerError(result => {
        updateState({ loading: false, error: true });
      })
      .onBadRequest(result => {
        updateState({ loading: false, error: true });
      })
      .unAuthorized(result => {
        updateState({ loading: false, error: true });
      })
      .call(spaceInfo.id, match.params.id);
  };
  const getData = (text, cType, category, status, skip, limit) => {
    filterContents()
      .onOk(result => {
        const d = result.map((item, index) => {
          return {
            index: skip + parseInt(index) + 1,
            ...item
          };
        });
        updateState({
          tableLoading: false,
          allData: d,
          tableData: d,
          error: false
        });
      })
      .onServerError(result => {
        updateState({ tableLoading: false, error: true });
      })
      .onBadRequest(result => {
        updateState({ tableLoading: false, error: true });
      })
      .notFound(result => {
        updateState({ tableLoading: false, error: true });
      })
      .unAuthorized(result => {
        updateState({ tableLoading: false, error: true });
      })
      .call(spaceInfo.id, text, cType._id, category, status, skip, limit);
  };
  function handleStartAction() {
    updateState({ tableLoading: true });
  }
  function handleEndAction(result) {
    updateState({ tableLoading: false });
    if (result === "success")
      getData(text, contentType, category, status, skip, limit);
  }
  const getTableColumns = () => {
    if (!boxRef.current) return;
    const boxWidth = boxRef.current.offsetWidth;
    let w = 200;
    if (boxWidth > 1000) {
      if (contentType.fields.length === 1) w = boxWidth - 400;
      else if (contentType.fields.length === 2) w = (boxWidth - 400) / 2;
      else w = 300;
    }
    const c = getColumns(contentType.fields, w, currentLocale);
    return c;
  };
  const prevPage = () => {
    updateState({ tableLoading: true, skip: skip - 1 });
    getData(text, contentType, category, status, (skip - 1) * limit, limit);
  };
  const nextPage = () => {
    updateState({ tableLoading: true, skip: skip + 1 });
    getData(text, contentType, category, status, (skip + 1) * limit, limit);
  };
  const handleChangedStatus = s => {
    updateState({ tableLoading: true, status: s });
    getData(text, contentType, category, s, skip, limit);
  };
  const handleChangedSearchInput = txt => {
    updateState({ tableLoading: true, text: txt });
    getData(txt, contentType, category, status, skip, limit);
    // const d = allData.filter(item => {
    //   const { fields } = item;
    //   const name = fields["name"]
    //     ? fields["name"][currentLocale]
    //       ? fields["name"][currentLocale]
    //       : typeof fields["name"] === "string"
    //       ? fields["name"]
    //       : null
    //     : null;
    //   if (name && name.includes(txt)) return true;
    //   return false;
    // });
    // updateState({ tableData: d });
  };
  const viewRowData = data => {
    history.push({
      pathname: `/contents/view/${data._id}`,
      viewMode: true
    });
  };
  function newContent() {
    history.push("/contents/new");
  }
  function viewNewTab(e, data) {
    e.preventDefault();
    e.stopPropagation();
    window.open(window.origin + `/contents/view/${data._id}`, "_blank");
  }
  return (
    <PageLayout
      title={t("HOME_SIDE_NAV_CONTENTS")}
      description={t("HOME_SIDE_NAV_CONTENTS_DESC")}
      renderHeader={() => (
        <div>
          <button className="btn btn-info btn-md" onClick={newContent}>
            New Content
          </button>
        </div>
      )}
    >
      <Filters
        onChangeStatus={handleChangedStatus}
        onChangeInput={handleChangedSearchInput}
      />
      <BoxLayout ref={boxRef}>
        <div className={styles.boxTop}>
          <h4 className={styles.boxTitle}>
            {contentType
              ? contentType.title && contentType.title[currentLocale]
                ? contentType.title[currentLocale]
                : contentType.title
              : ""}
          </h4>
          <Pagination
            data={tableData}
            skip={skip}
            limit={limit}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        </div>
        {loading ? (
          <Loading />
        ) : error ? (
          "error"
        ) : tableData ? (
          <Table
            autoHeight
            affixHeader
            loading={tableLoading}
            data={tableData}
            onRowClick={viewRowData}
          >
            <Column width={70} fixed="left">
              <HeaderCell>#</HeaderCell>
              <Cell>
                {rowData => {
                  return <div className={styles.rowIndex}>{rowData.index}</div>;
                }}
              </Cell>
            </Column>
            <Column width={250} resizable>
              <HeaderCell>Name</HeaderCell>
              <Cell>
                {rowData => {
                  const { fields } = rowData;
                  return (
                    <a
                      href=""
                      target="_blank"
                      className={styles.name}
                      onClick={e => viewNewTab(e, rowData)}
                    >
                      {fields["name"]
                        ? fields["name"][currentLocale]
                          ? fields["name"][currentLocale]
                          : typeof fields["name"] === "string"
                          ? fields["name"]
                          : ""
                        : ""}
                    </a>
                  );
                }}
              </Cell>
            </Column>
            <Column width={150}>
              <HeaderCell>Description</HeaderCell>
              <Cell>
                {rowData => {
                  const { fields } = rowData;
                  return (
                    <div className={styles.description}>
                      {fields["shortDesc"]
                        ? fields["shortDesc"][currentLocale]
                          ? fields["shortDesc"][currentLocale]
                          : typeof fields["shortDesc"] === "string"
                          ? fields["shortDesc"]
                          : ""
                        : ""}
                    </div>
                  );
                }}
              </Cell>
            </Column>
            <Column width={150}>
              <HeaderCell>Issuer</HeaderCell>
              <Cell>
                {rowData => {
                  const { sys } = rowData;
                  return (
                    <div className={styles.date}>
                      <h6>{sys.issuer && sys.issuer.fullName}</h6>
                      <span>
                        <DateFormater date={sys.issueDate} />
                      </span>
                    </div>
                  );
                }}
              </Cell>
            </Column>
            <Column width={150}>
              <HeaderCell>Status</HeaderCell>
              <Cell>
                {rowData => {
                  const { status } = rowData;
                  return (
                    <div className="p-contentType">
                      <span className="badge badge-primary">{t(status)}</span>
                    </div>
                  );
                }}
              </Cell>
            </Column>

            <Column width={300} fixed="right" align="center">
              <HeaderCell>Action</HeaderCell>
              <Cell>
                {rowData => (
                  <Actions
                    row={rowData}
                    onStartAction={handleStartAction}
                    onEndAction={handleEndAction}
                  />
                )}
              </Cell>
            </Column>
          </Table>
        ) : (
          <EmptyListIcon />
        )}
      </BoxLayout>
    </PageLayout>
  );
};
export default DataTable;
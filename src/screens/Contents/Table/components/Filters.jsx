import React, { useState, useRef, useEffect } from "react";
import styles from "../styles.module.scss";
import useGlobalState from "services/stateManager";
import { t } from "services/languageManager";
import Form from "components/Form";

const Filters = ({
  currentFilter,
  onChangeStatus,
  onChangeInput,
  onPagingStart,
  contentFilter,
  onApplyFilterClicked,
  advanceFilterFields = [],
}) => {
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const [{ status }] = useGlobalState();
  const [selectedStatus, setStatus] = useState(() => {
    if (
      contentFilter &&
      contentFilter.status &&
      contentFilter.status !== "all"
    ) {
      const s = status.find((item) => item.name === contentFilter.status);
      return s;
    }
    return undefined;
  });
  const [searchInput, setSearchText] = useState(
    contentFilter && contentFilter.text ? contentFilter.text : ""
  );
  const [isSearched, toggleIsSearched] = useState(false);
  const [advanceFilterBox, toggleAdvanceFilter] = useState(
    contentFilter && contentFilter.advanceFilterValues ? true : false
  );

  const handleToggleAdvanceFilterBox = () => {
    toggleAdvanceFilter((prev) => !prev);
  };

  useEffect(() => {
    if (onPagingStart) if (searchInput.length > 0) setSearchText("");
  }, [onPagingStart]);

  const changeStatus = (s) => {
    if (onChangeStatus) onChangeStatus(s.name === "all" ? null : s.name);
    setStatus(s);
  };
  const search = () => {
    if (inputRef.current) {
      const val = inputRef.current.value;
      toggleIsSearched(true);
      if (onChangeInput) onChangeInput(val);
    }
  };
  function handleSearchInput(e) {
    setSearchText(e.target.value);
    if (isSearched && e.target.value.length === 0) {
      if (onChangeInput) onChangeInput("");
    }

    // if (onChangeInput) {
    //   onChangeInput(e.target.value);
    // }
  }
  function submitAdvanceFilter() {
    const values = formRef.current.getValues();
    if (onApplyFilterClicked) onApplyFilterClicked(values);
  }
  function resetAdvanceFilter() {
    const { formState } = formRef.current;
    const { reset } = formRef.current;
    reset();
    if (onApplyFilterClicked) onApplyFilterClicked({});
  }
  return (
    <>
      <div className={styles.filters}>
        <div className={styles.left}>
          <button
            className={
              `btn btn-sm btn-filter ` +
              (!selectedStatus || selectedStatus.name === "all"
                ? "btn-primary"
                : "btn-light")
            }
            onClick={() => changeStatus({ name: "all" })}
          >
            <span>All</span>
          </button>
          {status.map((s) => {
            return (
              <button
                key={s.name}
                className={
                  `btn btn-sm ` +
                  (selectedStatus && selectedStatus.id === s.id
                    ? "btn-primary"
                    : "btn-light")
                }
                onClick={() => changeStatus(s)}
              >
                <span className={s.icon}></span>
                <span>{t(s.name)}</span>
              </button>
            );
          })}
        </div>
        <div className={styles.right}>
          <div className={styles.input}>
            <input
              className="form-control input-lg"
              placeholder="Search by name"
              value={searchInput}
              ref={inputRef}
              onChange={handleSearchInput}
            />
            <button className="btn btn-light searchBtn" onClick={search}>
              Search
            </button>
            {advanceFilterFields && advanceFilterFields.length > 0 && (
              <button
                className="btn btn-light"
                onClick={handleToggleAdvanceFilterBox}
                title="Advance filters"
              >
                <i className="icon-filter" />
              </button>
            )}
          </div>
        </div>
      </div>
      {advanceFilterBox && (
        <div className={styles.advanceFiltersBox + " animated fadeIn"}>
          <div className={styles.advanceFiltersBox__header}>
            <h4>Advance Filters</h4>
            <span>Filters will applied at the press apply button</span>
          </div>
          <Form
            ref={formRef}
            mode="filter"
            rowColumns={3}
            filters={
              contentFilter && contentFilter.advanceFilterValues
                ? contentFilter.advanceFilterValues
                : undefined
            }
            initialValues={{}}
            fieldsArray={advanceFilterFields}
          />
          <div className={styles.advanceFiltersBox_submit}>
            <button
              className="btn btn-light"
              onClick={submitAdvanceFilter}
              disabled={
                formRef.current &&
                Object.keys(formRef.current.errors).length > 0
                  ? true
                  : false
              }
            >
              Apply
            </button>
            {/* <button className="btn btn-light" onClick={resetAdvanceFilter}>
              Reset
            </button> */}
          </div>
        </div>
      )}
    </>
  );
};

export default Filters;

// [
//   {
//     type: "string",
//     name: "name",
//     appearance: "text",
//     title: { en: "Your name", fa: "نام شما" },
//     isRequired: true,
//     description: {
//       en: "Enter your name",
//       fa: "نام خود را وارد کنید",
//     },
//   },
//   {
//     type: "string",
//     name: "age",
//     appearance: "text",
//     colSpan: 2,
//     title: { en: "Your name", fa: "سن" },
//     isRequired: true,
//     description: {
//       en: "Enter your ",
//       fa: "سن خود را وارد کنید",
//     },
//   },
//   {
//     type: "string",
//     name: "city",
//     appearance: "text",
//     title: { en: "Your name", fa: "شهر" },
//     isRequired: true,
//     description: {
//       en: "Enter your ",
//       fa: "شهر خود را وارد کنید",
//     },
//   },
//   {
//     type: "string",
//     name: "familyName",
//     appearance: "text",
//     title: { en: "Your name", fa: "نام خانوادکی" },
//     colSpan: 2,
//     isRequired: true,
//     description: {
//       en: "Enter your ",
//       fa: "نام فامیلی را وارد کنید",
//     },
//   },
//   {
//     type: "string",
//     name: "address",
//     appearance: "text",
//     title: { en: "Your name", fa: "آدرس" },
//     colSpan: 2,
//     isRequired: true,
//     description: {
//       en: "Enter your ",
//       fa: "آدرس خود را وارد کنید",
//     },
//   },
// ];

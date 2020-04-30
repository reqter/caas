import React, { useState, useRef, useEffect } from "react";
import styles from "../styles.module.scss";
import Dropdown from "reactstrap/lib/Dropdown";
import DropdownToggle from "reactstrap/lib/DropdownToggle";
import DropdownMenu from "reactstrap/lib/DropdownMenu";
import DropdownItem from "reactstrap/lib/DropdownItem";
import useGlobalState from "services/stateManager";
import { t } from "services/languageManager";
import Form from "components/Form";
import { dateRanges } from "../helper";

const Filters = ({
  currentFilter,
  onChangeStatus,
  onChangeInput,
  onPagingStart,
  onDateRangeSelect,
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
    contentFilter &&
      contentFilter.advanceFilterValues &&
      Object.keys(contentFilter.advanceFilterValues).length > 0
      ? true
      : false
  );
  const [dropDownVisibility, toggleDropdown] = useState(false);
  const [selectedTime, setTime] = useState(dateRanges[3]);
  function handleSelectTime(item) {
    setTime(item);
    if (onDateRangeSelect) {
      onDateRangeSelect(item);
    }
  }
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
  function handleSearchInputKeyPress(e) {
    const key = e.keyCode || e.which;
    if (key === 13) search();
  }
  function handleSearchInput(e) {
    setSearchText(e.target.value);
    if (isSearched && e.target.value.length === 0) {
      if (onChangeInput) onChangeInput("");
    }
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
  // React.useEffect(() => {
  //   if (formRef.current) console.log(formRef.current.errors);
  // }, [formRef.current]);
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
              onKeyPress={handleSearchInputKeyPress}
              onChange={handleSearchInput}
            />
            <button className="btn btn-light searchBtn" onClick={search}>
              Search
            </button>
            <Dropdown
              isOpen={dropDownVisibility}
              toggle={() => toggleDropdown((prev) => !prev)}
            >
              <DropdownToggle className="btn btn-light">
                {selectedTime.displayName} <i className="icon-caret-down" />
              </DropdownToggle>
              <DropdownMenu>
                {dateRanges.map((item) => (
                  <DropdownItem onClick={() => handleSelectTime(item)}>
                    {item.displayName}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {advanceFilterFields && advanceFilterFields.length > 0 && (
              <button
                className="btn btn-light"
                onClick={handleToggleAdvanceFilterBox}
                title={
                  !advanceFilterBox ? "Advance filters" : "Close filter box"
                }
              >
                <i
                  className={!advanceFilterBox ? "icon-filter" : "icon-cross"}
                />
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
              // disabled={
              //   formRef.current && formRef.current.errors ? true : false
              // }
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

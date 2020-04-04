import React, { useState, useRef, useEffect } from "react";
import styles from "../styles.module.scss";
import useGlobalState from "services/stateManager";
import { t } from "services/languageManager";
const Filters = ({
  currentFilter,
  onChangeStatus,
  onChangeInput,
  onPageingStart
}) => {
  const inputRef = useRef(null);
  const [{ status }] = useGlobalState();
  const [selectedStatus, setStatus] = useState();
  const [searchInput, setSearchText] = useState("");
  const [isSearched, toggleIsSearched] = useState(false);

  useEffect(() => {
    if (onPageingStart) if (searchInput.length > 0) setSearchText("");
  }, [onPageingStart]);

  const changeStatus = s => {
    if (onChangeStatus) onChangeStatus(s.name === "all" ? null : s.name);
    setStatus(s);
    if (searchInput.length > 0) setSearchText("");
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
  return (
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
        {status.map(s => {
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
          <button className="btn btn-light" onClick={search}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;

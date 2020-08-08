import React from "react";
import styles from "../styles.module.scss";
const Pagination = ({ data, skip, limit, nextPage, prevPage }) => {
  return skip === 0 && data.length < limit ? null : (
    <div className={styles.paginationBox}>
      {skip !== 0 && (
        <button
          className={styles.pagination_btn + " btn-left"}
          disabled={skip === 0}
          onClick={prevPage}
          title="Previous Page"
        >
          <i className="icon-circle-left" />
        </button>
      )}
      <span className={styles.pagination_text}>Page {skip + 1}</span>
      <button
        className={styles.pagination_btn + " btn-right"}
        disabled={!data || data.length < limit}
        onClick={nextPage}
        title="Next Page"
      >
        <i className="icon-circle-right" />
      </button>
    </div>
  );
};

export default Pagination;

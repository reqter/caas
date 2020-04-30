import React from "react";
import styles from "./styles.module.scss";
import Box from "./../../BoxLayout";
import Item from "./item";
import EmptyListIcon from "components/Commons/ErrorsComponent/EmptyList";
import Error from "components/Commons/ErrorsComponent/Wrong";
import Loading from "components/Commons/Loading";
import useDashboardApi from "hooks/useDashboardApi";
import useLocale from "hooks/useLocale";
const intervalTime = process.env.REACT_APP_AUTO_REFRESH_INTERVAL_TIME || 30000;

const RecentContents = ({ title }) => {
  const { _getRecentContents } = useDashboardApi();
  const { currentLocale } = useLocale();
  const chartInterval = React.useRef(null);
  const [state, setState] = React.useState({
    loading: true,
    data: [],
    error: false,
    isAutoRefresh: false,
  });
  const { error, loading, isAutoRefresh, data } = state;

  React.useEffect(() => {
    getData();
    return () => {
      if (chartInterval.current) clearInterval(chartInterval.current);
    };
  }, []);

  function getData() {
    _getRecentContents(
      (result) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: false,
          data: result,
        }));
      },
      () => {
        setState((prev) => ({ ...prev, loading: false, error: true }));
      }
    );
  }

  function refresh() {
    setState((prev) => ({ ...prev, loading: true }));
    getData();
  }
  function autoRefresh() {
    setState((prev) => ({ ...prev, isAutoRefresh: !prev.isAutoRefresh }));
    if (chartInterval.current) {
      clearInterval(chartInterval.current);
      chartInterval.current = null;
    } else {
      chartInterval.current = setInterval(() => {
        getData();
      }, intervalTime);
    }
  }
  return (
    <Box customClass={styles.table}>
      <div className={styles.header}>
        <span>{title}</span>
        {!loading && (
          <div className={styles.actions}>
            {!isAutoRefresh && (
              <button className="btn btn-light btn-sm" onClick={refresh}>
                <span className="icon-refresh"></span>
              </button>
            )}
            {!error && (
              <button
                className={
                  "btn btn-sm " + (isAutoRefresh ? "btn-primary" : "btn-light")
                }
                title="Auto Refresh"
                onClick={autoRefresh}
              >
                <span className="icon-shield"></span>
              </button>
            )}
          </div>
        )}
      </div>
      <div className={styles.content}>
        {loading ? (
          <div style={{ marginTop: 20 }}>
            <Loading />
          </div>
        ) : error ? (
          <Error
            message="Failed to load the data.try again"
            width={200}
            height={200}
          />
        ) : !data || data.length === 0 ? (
          <EmptyListIcon
            width={200}
            height={200}
            message="There aren't any data for you"
          />
        ) : (
          data.map((item, index) => (
            <Item key={item._id} i={index + 1} data={item} />
          ))
        )}
      </div>
    </Box>
  );
};

export default RecentContents;

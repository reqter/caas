import React from "react";
import styles from "./styles.module.scss";
import { Bar } from "react-chartjs-2";
import Box from "./../../BoxLayout";
import EmptyListIcon from "components/Commons/ErrorsComponent/EmptyList";
import Error from "components/Commons/ErrorsComponent/Wrong";
import Loading from "components/Commons/Loading";
import useDashboardApi from "hooks/useDashboardApi";
import useLocale from "hooks/useLocale";
const intervalTime = process.env.REACT_APP_AUTO_REFRESH_INTERVAL_TIME || 3000;

const ColumnChart = ({ title }) => {
  const { _getAssetsByType } = useDashboardApi();
  const { currentLocale } = useLocale();
  const chartInterval = React.useRef(null);
  const [state, setState] = React.useState({
    loading: true,
    columnChartData: {},
    error: false,
    isAutoRefresh: false,
  });
  const { error, loading, columnChartData, isAutoRefresh } = state;

  React.useEffect(() => {
    getData();
    return () => {
      if (chartInterval.current) clearInterval(chartInterval.current);
    };
  }, []);
  function getCount(arr, id) {
    const item = arr.find((item) => item._id === id);
    return item ? item.count : 0;
  }

  function getData() {
    _getAssetsByType(
      (result) => {
        setState((prev) => {
          const d = {
            ...prev,
            loading: false,
            error: false,
            columnChartData: {
              labels: result.map((item) => item._id),
              datasets: [
                {
                  label: "My First dataset",
                  backgroundColor: "#3784ff",
                  borderColor: "#3784ff",
                  borderWidth: 1,
                  hoverBackgroundColor: "blue",
                  hoverBorderColor: "rgba(255,99,132,",
                  data: result.map((item) => item.count),
                },
              ],
            },
          };
          return d;
        });
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
    <>
      <Box customClass={styles.columnChart}>
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
                    "btn btn-sm " +
                    (isAutoRefresh ? "btn-primary" : "btn-light")
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
          ) : !columnChartData.datasets[0].data ||
            columnChartData.datasets[0].data.length === 0 ? (
            <EmptyListIcon
              width={200}
              height={200}
              message="There aren't any data for you"
            />
          ) : (
            <Bar
              data={columnChartData}
              width={100}
              height={250}
              options={{
                maintainAspectRatio: false,
              }}
            />
          )}
        </div>
      </Box>
    </>
  );
};

export default ColumnChart;

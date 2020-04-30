import React from "react";
import styles from "./styles.module.scss";
import { Pie } from "react-chartjs-2";
import Box from "./../../BoxLayout";
import EmptyListIcon from "components/Commons/ErrorsComponent/EmptyList";
import Error from "components/Commons/ErrorsComponent/Wrong";
import Loading from "components/Commons/Loading";
import useDashboardApi from "hooks/useDashboardApi";
import useLocale from "hooks/useLocale";

const intervalTime = process.env.REACT_APP_AUTO_REFRESH_INTERVAL_TIME || 30000;

const PieChart = ({
  title,
  contentType,
  height,
  text,
  category,
  status,
  advanceFilterValues,
  dateRange = { name: "thismonth" },
}) => {
  const { _getContentsByStatus, _getContentsStatusByCType } = useDashboardApi();
  const { currentLocale } = useLocale();
  const chartInterval = React.useRef(null);
  const [state, setState] = React.useState({
    loading: true,
    pieChartData: {},
    error: false,
    isAutoRefresh: false,
  });
  const { error, loading, pieChartData, isAutoRefresh } = state;

  React.useEffect(() => {
    if (!loading) {
      setState((prev) => ({ ...prev, loading: true }));
    }
    getData();
    return () => {
      if (chartInterval.current) clearInterval(chartInterval.current);
    };
  }, [text, contentType, category, status, advanceFilterValues, dateRange]);
  function getCount(arr, id) {
    const item = arr.find((item) => item._id === id);
    return item ? item.count : 0;
  }
  function getData() {
    if (contentType) getPieDataByContentType();
    else getPieData();
  }
  function getPieData() {
    _getContentsByStatus(
      text,
      category,
      status,
      advanceFilterValues,
      dateRange,
      (result) => {
        setState((prev) => {
          const d = {
            ...prev,
            loading: false,
            error: false,
            pieChartData: makePieFromData(result),
          };
          return d;
        });
      },
      () => {
        setState((prev) => ({ ...prev, loading: false, error: true }));
      }
    );
  }
  function getPieDataByContentType() {
    _getContentsStatusByCType(
      text,
      contentType._id,
      category,
      status,
      advanceFilterValues,
      dateRange,
      (result) => {
        setState((prev) => {
          const d = {
            ...prev,
            loading: false,
            error: false,
            pieChartData: makePieFromData(result),
          };
          return d;
        });
      },
      () => {
        setState((prev) => ({ ...prev, loading: false, error: true }));
      }
    );
  }
  const makePieFromData = (result) => {
    return {
      labels: ["Changed", "Drafts", "Published", "Archived"],
      datasets: [
        {
          backgroundColor: [
            "rgb(129,69,233)",
            "rgb(236,81,81)",
            "#3784ff",
            "rgb(30,200,136)",
          ],
          hoverBackgroundColor: [
            "rgb(129,69,233)",
            "rgb(236,81,81)",
            "#3784ff",
            "rgb(30,200,136)",
          ],
          data: [
            getCount(result, "changed"),
            getCount(result, "draft"),
            getCount(result, "published"),
            getCount(result, "changed"),
          ],
        },
      ],
    };
  };
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
      <Box customClass={styles.piChart}>
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
          ) : !pieChartData.datasets[0].data ||
            pieChartData.datasets[0].data.length === 0 ? (
            <EmptyListIcon
              width={200}
              height={200}
              message="There aren't any data for you"
            />
          ) : (
            <Pie data={pieChartData} />
          )}
        </div>
      </Box>
    </>
  );
};

export default PieChart;

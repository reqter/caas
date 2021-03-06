import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import { Line } from "react-chartjs-2";
import Box from "./../../BoxLayout";
import EmptyListIcon from "components/Commons/ErrorsComponent/EmptyList";
import Error from "components/Commons/ErrorsComponent/Wrong";
import Loading from "components/Commons/Loading";
import { t } from "services/languageManager";
import FilterModal from "./../../FilterModal";
import useDashboardApi from "hooks/useDashboardApi";
import useLocale from "hooks/useLocale";

const intervalTime = process.env.REACT_APP_AUTO_REFRESH_INTERVAL_TIME || 30000;

const LineChart = ({
  title,
  contentType = null,
  height = null,
  text = null,
  category = null,
  status = null,
  advanceFilterValues = null,
  dateRange = { name: "thismonth" },
}) => {
  const { _getDailyInputs, _getDailyInputsByCType } = useDashboardApi();
  const { currentLocale } = useLocale();
  const chartInterval = React.useRef(null);
  const [dropDownVisibility, toggleDropdown] = React.useState(false);
  const [state, setState] = React.useState({
    loading: true,
    lineChartData: {},
    error: false,
    isAutoRefresh: false,
  });
  const { error, loading, lineChartData, isAutoRefresh } = state;
  React.useEffect(() => {
    if (!loading) {
      setState((prev) => ({ ...prev, loading: true }));
    }
    getData();
    return () => {
      if (chartInterval.current) clearInterval(chartInterval.current);
    };
  }, [text, contentType, category, status, advanceFilterValues, dateRange]);
  function getData() {
    if (contentType) getLineDataByContentType();
    else getLineData();
  }
  function getLineData() {
    _getDailyInputs(
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
            lineChartData: makeLineChart(result),
          };
          return d;
        });
      },
      () => {
        setState((prev) => ({ ...prev, loading: false, error: true }));
      }
    );
  }
  function getLineDataByContentType() {
    _getDailyInputsByCType(
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
            lineChartData: makeLineChart(result),
          };
          return d;
        });
      },
      () => {
        setState((prev) => ({ ...prev, loading: false, error: true }));
      }
    );
  }
  function makeLineChart(data) {
    function getLabels(data) {
      return data.map((item) => item._id);
    }
    function getCounts() {
      return data.map((item) => item.count);
    }
    return {
      labels: getLabels(data),
      datasets: [
        {
          label: "Counts",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "#3784ff",
          borderColor: "#3784ff",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: getCounts(data),
        },
      ],
    };
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
      <Box customClass={styles.lineChart}>
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
            <Loading />
          ) : error ? (
            <Error
              message="Failed to load the data.try again"
              width={200}
              height={200}
            />
          ) : !lineChartData.datasets[0].data ||
            lineChartData.datasets[0].data.length === 0 ? (
            <EmptyListIcon message="There aren't any data for you" />
          ) : (
            <Line data={lineChartData} height={height ? height : undefined} />
          )}
        </div>
      </Box>
    </>
  );
};

export default React.memo(LineChart);

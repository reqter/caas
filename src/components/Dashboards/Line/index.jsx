import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import { Line } from "react-chartjs-2";
import Box from "./../../BoxLayout";
import EmptyListIcon from "components/Commons/ErrorsComponent/EmptyList";
import Error from "components/Commons/ErrorsComponent/Wrong";
import Loading from "components/Commons/Loading";
import Dropdown from "reactstrap/lib/Dropdown";
import DropdownToggle from "reactstrap/lib/DropdownToggle";
import DropdownMenu from "reactstrap/lib/DropdownMenu";
import DropdownItem from "reactstrap/lib/DropdownItem";
import { t } from "services/languageManager";
import FilterModal from "./../../FilterModal";
import useDashboardApi from "hooks/useDashboardApi";
import useLocale from "hooks/useLocale";

//  <Dropdown
//                 isOpen={dropDownVisibility}
//                 toggle={() => toggleDropdown((prev) => !prev)}
//               >
//                 <DropdownToggle className="btn btn-light btn-sm">
//                   This Month <i className="icon-caret-down" />
//                 </DropdownToggle>
//                 <DropdownMenu>
//                   <DropdownItem>{t("Today")}</DropdownItem>
//                   <DropdownItem>{t("This Week")}</DropdownItem>
//                   <DropdownItem>{t("This Month")}</DropdownItem>
//                   <DropdownItem>{t("This Year")}</DropdownItem>
//                 </DropdownMenu>
//               </Dropdown>

const LineChart = ({ title, contentType, height }) => {
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
    getData();
    return () => {
      if (chartInterval.current) clearInterval(chartInterval.current);
    };
  }, []);
  function getData() {
    if (contentType) getLineDataByContentType();
    else getLineData();
  }
  function getLineData() {
    _getDailyInputs(
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
      contentType._id,
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
          label: "Contents per day",
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
      }, 3000);
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
              width={250}
              height={250}
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

export default LineChart;

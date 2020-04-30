import React from "react";
import styles from "./styles.module.scss";
import Stat from "./../Stat";
import useDashboardApi from "hooks/useDashboardApi";
const Stats = () => {
  const { _getStats } = useDashboardApi();
  const [state, setState] = React.useState({
    loading: true,
    data: {},
  });
  const { data, loading } = state;
  React.useEffect(() => {
    _getStats((data) => {
      setState((prev) => ({ ...prev, loading: false, data }));
    });
  }, []);
  return (
    <div className={styles.statsBox}>
      <Stat
        title="Content Types"
        value={data["contentTypes"]}
        link="/panel/contentType"
        icon="icon-item-type"
        color="rgb(56,132,255)"
      />
      <Stat
        title="Content"
        value={data["contents"]}
        link="/panel/contents"
        icon="icon-product"
        color="rgb(56,132,255)"
      />
      <Stat
        title="Media"
        value={data["media"]}
        link="/panel/assets"
        icon="icon-images"
        color="rgb(56,132,255)"
      />
      <Stat
        title="Connected Apps"
        value={data["apps"]}
        link=""
        icon="icon-shield"
        color="rgb(56,132,255)"
      />
    </div>
  );
};

export default Stats;

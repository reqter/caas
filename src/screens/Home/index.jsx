import React from "react";
import styles from "./styles.module.scss";
import { t } from "services/languageManager/";
import PageLayout from "components/PageLayout";
import Stats from "components/Dashboards/Stats";
import Pie from "components/Dashboards/Pie";
import Column from "components/Dashboards/Column";
import Line from "components/Dashboards/Line";
import LastFileMedia from "components/Dashboards/LastFileMedia";
import LastMediaContents from "components/Dashboards/LastContents";

export default function Home(props) {
  return (
    <PageLayout
      title={t("HOME_SIDE_NAV_HOME")}
      description={t("HOME_SIDE_NAV_HOME_DESC")}
    >
      <div className={styles.headerTop}>
        <Stats />
      </div>
      <div className={styles.center}>
        <div className={styles.center__left}>
          <Pie title="Contents" />
        </div>
        <div className={styles.center__right}>
          <Column title="Media Types" />
        </div>
      </div>
      <div className={styles.row}>
        <Line title="Last 30 Days Contents" height={100} />
      </div>
      <div className={styles.row}>
        <div className={styles.mediaFile}>
          <LastFileMedia title="Last Files/Media" />
        </div>
        <div className={styles.lastContentFiles}>
          <LastMediaContents title="Last Recently Content" />
        </div>
      </div>
    </PageLayout>
  );
}

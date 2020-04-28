import React from "react";
import Item from "./item";
import Box from "./../../BoxLayout";
import styles from "./styles.module.scss";

const LastFileMedia = ({ title }) => {
  const [state, setState] = React.useState({
    data: [{}, {}, {}, {}],
  });
  const { data } = state;
  return (
    <Box customClass={styles.table}>
      <div className={styles.header}>
        <span>{title}</span>
      </div>
      <div className={styles.content}>
        {data.map((item, index) => (
          <Item key={index} data={item} />
        ))}
      </div>
    </Box>
  );
};
export default LastFileMedia;

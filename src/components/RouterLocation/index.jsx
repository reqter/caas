import React from "react";
import { withRouter } from "react-router-dom";
import useGlobalState from "services/stateManager";
const LocationChanged = ({ location, history }) => {
  const [{ contentFilter }, dispatch] = useGlobalState();
  React.useEffect(() => {
    if (!location.pathname.includes("contents/")) {
      if (contentFilter) {
        dispatch({
          type: "SAVE_CONTENT_FILTER",
          payload: null,
        });
      }
    }
  }, [location]);
  return null;
};

export default withRouter(LocationChanged);

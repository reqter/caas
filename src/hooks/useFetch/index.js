import { useEffect, useState, useRef } from "react";

const useFetch = (getFunc, args, sideEffectProp = []) => {
  const allData = useRef([]);
  const [state, setState] = useState({
    loading: true,
    error: false,
    data: [],
  });
  const updateState = (changes) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };
  useEffect(() => {
    if (!state.loading) updateState({ loading: true });
    const f = getFunc;
    f()
      .onOk((result) => {
        allData.current = result;
        updateState({ loading: false, data: result, error: false });
      })
      .onServerError((result) => {
        updateState({ loading: false, error: true });
      })
      .onBadRequest((result) => {
        updateState({ loading: false, error: true });
      })
      .unAuthorized((result) => {
        updateState({ loading: false, error: true });
      })
      .call(args);
  }, sideEffectProp);

  function localSearch(searchFunction) {
    const data = searchFunction(allData.current);
    updateState({ data });
  }

  return [state.loading, state.data, state.error, localSearch];
};
export default useFetch;

import { useEffect, useState } from "react";

const useFetch = (getFunc, args, sideEffectProp = []) => {
  const [state, setState] = useState({
    loading: true,
    error: false,
    data: []
  });
  const updateState = changes => {
    setState(prevState => ({ ...prevState, ...changes }));
  };
  useEffect(() => {
    if (!state.loading) updateState({ loading: true });
    const f = getFunc;
    f()
      .onOk(result => {
        updateState({ loading: false, data: result, error: false });
      })
      .onServerError(result => {
        updateState({ loading: false, error: true });
      })
      .onBadRequest(result => {
        updateState({ loading: false, error: true });
      })
      .unAuthorized(result => {
        updateState({ loading: false, error: true });
      })
      .call(args);
  }, sideEffectProp);

  return [state.loading, state.data, state.error];
};
export default useFetch;

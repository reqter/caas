import React, { useImperativeHandle, useRef, forwardRef } from "react";
import { useForm, FormContext } from "react-hook-form";
import { renderFields } from "./helper";
import "./styles.scss";

const Form = (
  { mode, rowColumns, fieldsArray = [], initialValues = {}, filters },
  ref
) => {
  const methods = useForm();
  const formRef = React.useRef(methods);
  useImperativeHandle(ref, () => formRef.current);

  return (
    <FormContext {...methods}>
      <form>
        <div className="customForm">
          {renderFields(mode, rowColumns, fieldsArray, initialValues, filters)}
        </div>
      </form>
    </FormContext>
  );
};

export default forwardRef(Form);

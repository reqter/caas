import React, { useImperativeHandle, useRef, forwardRef } from "react";
import { useForm, FormContext } from "react-hook-form";
import { renderFields } from "./helper";
import "./styles.scss";

const Form = (
  { mode, rowColumns, fieldsArray = [], initialValues = {} },
  ref
) => {
  const methods = useForm();
  const formRef = useRef(methods);
  useImperativeHandle(ref, () => formRef.current);

  return (
    <FormContext {...methods}>
      <form>
        <div className="customForm">
          {renderFields(mode, rowColumns, fieldsArray, initialValues)}
        </div>
      </form>
    </FormContext>
  );
};

export default forwardRef(Form);

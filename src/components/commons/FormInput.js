import React from "react";
import { Form } from "react-bootstrap";

const FormInput = ({ handleChange, label, ...otherProps }) => (
  <React.Fragment>
    {label ? <Form.Label>{label}</Form.Label> : null}

    <Form.Control onChange={(e) => handleChange(e)} {...otherProps} />
    {/* <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text> */}
  </React.Fragment>
);

export default FormInput;

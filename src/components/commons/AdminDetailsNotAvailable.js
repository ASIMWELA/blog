import React from "react";
import "./adminDetailsNotAvailable.css";

export default function AdminDetailsNotAvailable({ message }) {
  return (
    <div className="text-center align-vertically">
      <strong>
        <h3>404</h3>
      </strong>
      <strong>Sorry No {message} Details Added. Check Next Time!</strong>
    </div>
  );
}

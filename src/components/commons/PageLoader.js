import React from "react";

export default function PageLoader() {
  return (
    <div style={{ marginTop: "15%" }}>
      <div className="d-flex justify-content-center">
        <div
          className="spinner-grow text-warning"
          role="status"
          style={{ height: "4rem", width: "4rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <div
          className="spinner-grow text-secondary"
          role="status"
          style={{ height: "4rem", width: "4rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
}

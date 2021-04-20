import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import cellEditFactory from "react-bootstrap-table2-editor";
import BootstrapTable from "react-bootstrap-table-next";
import { Modal } from "react-bootstrap";

import { API_BASE_URL } from "../../constants";
import Axios from "axios";

export default function AdminEducation({ authAdmin }) {
  const [deleteDetails, setDeteleEduDetails] = useState();
  const [education, setEduction] = useState([]);
  const [deleteBtnDisable, setDeleteBtnDisable] = useState(false);
  const [state, setState] = useState({
    erroMessage: "",
    successMessage: "",
  });
  const [show, setModalShow] = useState(false);
  useEffect(() => {
    if (authAdmin) {
      if ("education" in authAdmin.user) {
        setEduction(authAdmin.user.education);
      } else {
        setEduction([]);
      }
    }
  }, [authAdmin]);
  const deleteIconFormatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <div
        style={{ textAlign: "center", cursor: "pointer", lineHeight: "normal" }}
      >
        <FaTrash
          size={25}
          color={"red"}
          onClick={() => setDeleteEdu(row.institution)}
        />
      </div>
    );
  };
  const setDeleteEdu = (rowName) => {
    setModalShow(true);
    console.log(rowName);
    setDeteleEduDetails(rowName);
  };
  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];
  const tableColumns = [
    {
      dataField: "institution",
      text: "Instituion",
      sort: true,
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Institution are required",
          });
        }
        return true;
      },
    },
    {
      dataField: "awards",
      text: "Awards",
      headerStyle: (colum, colIndex) => {
        return { width: "47%" };
      },
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Awards are required",
          });
        }
        return true;
      },
    },
    {
      dataField: "period",
      text: "Period",
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Priod is required",
          });
        }
        return true;
      },
    },
    {
      dataField: "actions",
      text: "Action",
      isDummyField: true,
      editable: false,
      formatter: deleteIconFormatter,
    },
  ];

  const onTableChange = (
    type,
    { data, cellEdit: { rowId, dataField, newValue } }
  ) => {
    let result = data.find((data) => data.institution === rowId);
    let changedRow = { ...result };
    changedRow[dataField] = newValue;

    const awardsArray = changedRow.awards.split(",");
    const eduData = { ...changedRow, awards: awardsArray };

    Axios({
      method: "put",
      url: API_BASE_URL + "/education/update/" + changedRow.institution,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authAdmin.access_TOKEN}`,
      },
      data: JSON.stringify(eduData),
    })
      .then((res) => {
        if (res.data.code === 200) {
          setState({
            ...state,
            successMessage:
              res.data.message + ". Reflesh the page to see changes",
          });
        }
      })
      .catch((err) => {
        setState({
          ...state,
          errorMessage: err.message || "Server failed to process your request",
        });
      });
  };

  const noData = () => {
    return <div>No Data</div>;
  };

  const deleteEducation = () => {
    setDeleteBtnDisable(true);
    Axios.delete(
      API_BASE_URL +
        "/education/" +
        authAdmin.user.userName +
        "/" +
        deleteDetails,
      {
        headers: {
          Authorization: `Bearer ${authAdmin.access_TOKEN}`,
        },
      }
    )
      .then((res) => {
        if (res.data.code === 200) {
          setDeleteBtnDisable(false);
          setModalShow(false);
          setState({
            ...state,
            successMessage: res.data.message + ". Reflesh page to see chenges",
          });
        }
      })
      .catch((err) => {
        setDeleteBtnDisable(false);
        setModalShow(false);
        setState({
          ...state,
          errorMessage: err.message || "Delete operation not successfull",
        });
      });
  };
  return (
    <div>
      <div className="text-center">
        {state.errorMessage && (
          <span className="badge  bg-danger text-light p-2 mb-2">
            {state.err}
          </span>
        )}

        {state.successMessage && (
          <span className="badge  bg-dark text-light p-2 mb-2">
            {state.successMessage}
          </span>
        )}
      </div>

      <Modal
        size="sm"
        show={show}
        backdrop="static"
        onHide={() => setModalShow(false)}
        animation={true}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Education Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are You Sure?</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-info mr-5"
            onClick={() => setModalShow(false)}
          >
            No
          </button>
          <button
            className=" btn btn-danger ml-3"
            onClick={deleteEducation}
            disabled={deleteBtnDisable}
          >
            Yes
          </button>
        </Modal.Footer>
      </Modal>
      <BootstrapTable
        bootstrap4
        remote={{ cellEdit: true }}
        noDataIndication={noData}
        keyField="institution"
        defaultSorted={defaultSorted}
        data={education}
        columns={tableColumns}
        onTableChange={onTableChange}
        cellEdit={cellEditFactory({
          mode: "dbclick",
          blurToSave: true,
        })}
        classes="table-responsive"
      />
    </div>
  );
}

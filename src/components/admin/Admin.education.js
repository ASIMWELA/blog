import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import cellEditFactory from "react-bootstrap-table2-editor";
import BootstrapTable from "react-bootstrap-table-next";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import ApiUtil from "../../ApiUtil/ApiUtil";
import { API_BASE_URL } from "../../constants";
import Axios from "axios";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useForm } from "react-hook-form";

export default function AdminEducation({ authAdmin }) {
  const [deleteDetails, setDeteleEduDetails] = useState();
  const [education, setEduction] = useState([]);
  const [deleteBtnDisable, setDeleteBtnDisable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { errors, handleSubmit, register } = useForm();
  const [state, setState] = useState({
    erroMessage: "",
    successMessage: "",
    institution: "",
    awards: "",
    period: "",
    isSubmitting: false,
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

  useEffect(() => {
    refleshEduDetails();
  }, []);
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
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const setDeleteEdu = (rowName) => {
    setModalShow(true);
    setDeteleEduDetails(rowName);
  };
  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = () => {
    setState({
      ...state,
      isSubmitting: true,
      errorMessage: null,
    });
    let awards = null;
    if (state.awards.indexOf(",") < 0) {
      awards = new Array(state.awards);
    } else {
      awards = state.awards.split(",");
    }

    const eduData = {
      institution: state.institution,
      awards: awards,
      period: state.period,
    };

    Axios({
      method: "put",
      url: API_BASE_URL + "/education/" + authAdmin.user.userName,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authAdmin.access_TOKEN}`,
      },
      data: JSON.stringify(eduData),
    })
      .then((res) => {
        if (res.data.code === 200) {
          refleshEduDetails();
          setState({
            institution: "",
            awards: "",
            period: "",
            formTitle: "Add Education Details",
            successMessage: res.data.message,
          });
        }
      })
      .catch((err) => {
        setState({
          ...state,
          errorMessage: err.message,
        });
      });
  };

  const refleshEduDetails = async () => {
    await ApiUtil.getAdmin().then((res) => {
      if ("education" in res) {
        setEduction(res.education);
      } else {
        setEduction([]);
      }
    });
  };
  const defaultSorted = [
    {
      dataField: "institution",
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
          refleshEduDetails();
          setState({
            ...state,
            successMessage: res.data.message,
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
          refleshEduDetails();
          setDeleteBtnDisable(false);
          setModalShow(false);
          setState({
            ...state,
            successMessage: res.data.message,
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
    <div className="container-fluid">
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
          <Modal.Title>
            <small>Delete Education Details</small>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Are You Sure?</Modal.Body>
        <Modal.Footer>
          <button
            style={{ float: "left", borderRadius: "30px" }}
            className="btn btn-dark px-5 py-2"
            onClick={() => setModalShow(false)}
          >
            No
          </button>

          <button
            style={{ float: "right", borderRadius: "30px" }}
            className="btn btn-warning px-5 py-2"
            onClick={deleteEducation}
            disabled={deleteBtnDisable}
          >
            Yes
          </button>
        </Modal.Footer>
      </Modal>
      <OverlayTrigger
        placement={"right"}
        overlay={
          <Tooltip id="tooltip-disabled">
            Click to add a education details
          </Tooltip>
        }
      >
        <span className="d-inline-block">
          <BsFillPlusCircleFill
            size={30}
            color={"#203045"}
            onClick={() => setShowModal(true)}
          />
        </span>
      </OverlayTrigger>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
        size="sm"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <small>Add Education Details</small>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="form">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="institution"
                placeholder="institution"
                style={
                  errors.institution && {
                    borderColor: "red",
                    boxShadow: "none !important",
                  }
                }
                name="institution"
                value={state.institution}
                ref={register({ required: true, minLength: 2 })}
                onChange={handleInputChange}
              />
              {errors.institution && (
                <span style={{ color: "#f44336" }}>This field is required</span>
              )}
              {errors.institution &&
                errors.institution.type === "minLength" && (
                  <span style={{ color: "#f44336" }}>
                    Institution name should have atleast 2 letters
                  </span>
                )}
            </div>
            <div className="form-group">
              <textarea
                type="text"
                className="form-control"
                rows="2"
                placeholder="Bsc in comp, Msc in info, PHD in abc...."
                id="awards"
                style={
                  errors.awards && {
                    borderColor: "red",
                    boxShadow: "none !important",
                  }
                }
                name="awards"
                value={state.awards}
                ref={register({ required: true, maxLength: 150 })}
                onChange={handleInputChange}
              />
              {errors.awards && errors.awards.type === "required" && (
                <span style={{ color: "#f44336" }}>This field is required</span>
              )}

              {errors.awards && errors.awards.type === "maxLength" && (
                <span style={{ color: "#f44336" }}>Awards string too long</span>
              )}
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="period"
                name="period"
                style={
                  errors.period && {
                    borderColor: "red",
                    boxShadow: "none !important",
                  }
                }
                placeholder="e.g. 2018 - present"
                value={state.period}
                ref={register({ required: true })}
                onChange={handleInputChange}
              />
              {errors.period && (
                <span style={{ color: "#f44336" }}>This field is required</span>
              )}
            </div>
            <br />
            <div className="text-center">
              <button
                type="button"
                id="submitBtn"
                className="btn btn-dark px-5 py-2"
                style={{ borderRadius: "30px" }}
                onClick={handleSubmit(handleFormSubmit)}
                disabled={state.isSubmitting}
              >
                {state.isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </Modal.Body>
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

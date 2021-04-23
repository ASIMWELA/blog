import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import cellEditFactory from "react-bootstrap-table2-editor";
import BootstrapTable from "react-bootstrap-table-next";
import Axios from "axios";
import { API_BASE_URL } from "../../constants";
import { Tooltip, OverlayTrigger, Modal } from "react-bootstrap";
import ApiUtil from "../../ApiUtil/ApiUtil";
import { useForm } from "react-hook-form";
import { BsFillPlusCircleFill } from "react-icons/bs";

export default function AdminSkills({ authAdmin }) {
  const [employment, setEmployment] = useState([]);
  const [addEmpDetailsModalShow, setAddEmpDetailsModalShow] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectEmpDetails, setSelectEmpDetails] = useState();

  const [state, setState] = useState({
    company: "",
    accomplishments: [],
    duration: "",
    availability: "",
    isSubmitting: false,
    errorMessage: null,
    successMessage: null,
  });

  useEffect(() => {
    if ("employment" in authAdmin.user) {
      const empDetails = authAdmin.user.employment.map((emp, index) => {
        let empKey = { ...emp };
        empKey.key = index + 1;
        return empKey;
      });

      setEmployment(empDetails);
    } else {
      setEmployment([]);
    }
  }, [authAdmin.user]);

  const refreshEmpDetails = async () => {
    await ApiUtil.getAdmin().then((res) => {
      if ("employment" in res) {
        const empDetails = res.employment.map((emp, index) => {
          let empKey = { ...emp };
          empKey.key = index + 1;
          return empKey;
        });
        setEmployment(empDetails);
      } else {
        setEmployment([]);
      }
    });
  };

  useEffect(() => {
    refreshEmpDetails();
  }, []);

  //bootstrap table
  const deleteIconFormatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <div
        style={{ textAlign: "center", cursor: "pointer", lineHeight: "normal" }}
      >
        <FaTrash
          size={25}
          color={"red"}
          onClick={() => prepareDeleteEmpDetails(row.company)}
        />
      </div>
    );
  };
  const tableColumns = [
    {
      dataField: "key",
      text: "key",
      sort: true,
    },
    {
      dataField: "company",
      text: "Company",
      headerStyle: (colum, colIndex) => {
        return { width: "30%" };
      },
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Company is required",
          });
        }
        return true;
      },
    },
    {
      dataField: "availability",
      text: "Availability",
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Availability is required",
          });
        }
        return true;
      },
      headerStyle: (colum, colIndex) => {
        return { width: "15%" };
      },
    },
    {
      dataField: "duration",
      text: "Duration",
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Period required",
          });
        }

        return true;
      },
      headerStyle: (colum, colIndex) => {
        return { width: "15%" };
      },
    },
    {
      dataField: "accomplishments",
      text: "Accomplishments",
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Period required",
          });
        }

        return true;
      },
      headerStyle: (colum, colIndex) => {
        return { width: "40%" };
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

  const noData = () => {
    return <div>No Data</div>;
  };
  const defaultSorted = [
    {
      dataField: "key",
      order: "asc",
    },
  ];

  const deletEmpDetails = () => {
    setState({
      ...state,
      isSubmitting: true,
    });
    Axios.delete(
      API_BASE_URL +
        "/employment/" +
        authAdmin.user.userName +
        "/" +
        selectEmpDetails,
      {
        headers: {
          Authorization: `Bearer ${authAdmin.access_TOKEN}`,
        },
      }
    )
      .then((res) => {
        if (res.data.code === 200) {
          setState({
            ...state,
            isSubmitting: false,
          });
          setShowDeleteModal(false);
          refreshEmpDetails();
        }
      })
      .catch((err) => {
        setShowDeleteModal(false);
        setState({
          ...state,
          errorMessage: err.message || "failed to delete",
          isSubmitting: false,
        });
      });
  };
  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const onTableChange = (
    type,
    { data, cellEdit: { rowId, dataField, newValue } }
  ) => {
    let result = data.find((data) => data.key === rowId);
    const selectedComp = result.company;
    let changedRow = { ...result };
    changedRow[dataField] = newValue;
    delete changedRow.key;
    if (dataField === "accomplishments") {
      //changedRow.accomplishments.split(",");

      const acomplishmentData = changedRow.accomplishments.split(",");
      const empData = { ...changedRow, accomplishments: acomplishmentData };
      Axios({
        method: "put",
        url: API_BASE_URL + "/employment/update/" + selectedComp,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authAdmin.access_TOKEN}`,
        },
        data: JSON.stringify(empData),
      })
        .then((res) => {
          if (res.data.code === 200) {
            refreshEmpDetails();
            setState({
              ...state,
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
    } else {
      Axios({
        method: "put",
        url: API_BASE_URL + "/employment/update/" + selectedComp,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authAdmin.access_TOKEN}`,
        },
        data: JSON.stringify(changedRow),
      })
        .then((res) => {
          if (res.data.code === 200) {
            refreshEmpDetails();
            setState({
              ...state,
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
    }
  };

  const handleCloseModal = () => {
    setAddEmpDetailsModalShow(false);
    setState({
      ...state,
      company: "",
      accomplishments: [],
      duration: "",
      availability: "",
      isSubmitting: false,
      errorMessage: null,
      successMessage: null,
    });
  };

  const prepareDeleteEmpDetails = (rowName) => {
    setSelectEmpDetails(rowName);
    setShowDeleteModal(true);
  };
  const handleFormSubmit = () => {
    setState({
      ...state,
      isSubmitting: true,
      errorMessage: null,
    });

    let accomplishments = null;
    if (state.accomplishments.indexOf(",") < 0) {
      accomplishments = new Array(state.accomplishments);
    } else {
      accomplishments = state.accomplishments.split(",");
    }

    const empDetails = {
      company: state.company,
      duration: state.duration,
      availability: state.availability,
      accomplishments: accomplishments,
    };

    Axios({
      method: "put",
      url: API_BASE_URL + "/employment/" + authAdmin.user.userName,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authAdmin.access_TOKEN}`,
      },
      data: JSON.stringify(empDetails),
    })
      .then((res) => {
        if (res.data.code === 200) {
          refreshEmpDetails();
          setState({
            company: "",
            accomplishments: [],
            duration: "",
            availability: "",
            submitEdit: false,
            isSubmitting: false,
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

  return (
    <div className="container-fluid">
      <OverlayTrigger
        placement={"right"}
        overlay={
          <Tooltip id="tooltip-disabled">Click to add a new Project</Tooltip>
        }
      >
        <span className="d-inline-block mb-2">
          <BsFillPlusCircleFill
            size={30}
            color={"#203045"}
            onClick={() => setAddEmpDetailsModalShow(true)}
          />
        </span>
      </OverlayTrigger>
      <Modal
        size="sm"
        show={showDeleteModal}
        backdrop="static"
        onHide={() => setShowDeleteModal(false)}
        animation={true}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are You Sure?</Modal.Body>
        <Modal.Footer>
          <button
            style={{ float: "left", borderRadius: "30px" }}
            className="btn btn-dark px-5 py-2"
            onClick={() => setShowDeleteModal(false)}
          >
            No
          </button>

          <button
            style={{ float: "right", borderRadius: "30px" }}
            className="btn btn-warning px-5 py-2"
            onClick={deletEmpDetails}
            disabled={state.isSubmitting}
          >
            Yes
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={addEmpDetailsModalShow}
        backdrop="static"
        onHide={handleCloseModal}
        animation={true}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <small>Add Your Employment Details</small>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {state.errorMessage && (
            <span className="alert alert-danger my-1" role="alert">
              {state.errorMessage}
            </span>
          )}
          <form className="row g-4">
            <div className="form-group col-md-6">
              <label>
                Company<sup style={{ color: "#f44336" }}>*</sup>
              </label>
              <input
                type="text"
                className="form-control"
                id="company"
                name="company"
                style={
                  errors.company && {
                    borderColor: "red",
                    boxShadow: "none !important",
                  }
                }
                value={state.company}
                ref={register({ required: true, minLength: 2 })}
                onChange={handleInputChange}
              />
              {errors.company && (
                <span style={{ color: "#f44336" }}>This field is required</span>
              )}
              {errors.company && errors.company.type === "minLength" && (
                <span style={{ color: "#f44336" }}>
                  Institution name should have atleast 2 letters
                </span>
              )}
            </div>

            <div className="form-group col-md-6">
              <label>
                Period<sup style={{ color: "#f44336" }}>*</sup>
              </label>
              <input
                type="text"
                className="form-control"
                id="duration"
                name="duration"
                style={
                  errors.duration && {
                    borderColor: "red",
                    boxShadow: "none !important",
                  }
                }
                value={state.duration}
                ref={register({ required: true, minLength: 2 })}
                onChange={handleInputChange}
              />
              {errors.duration && (
                <span style={{ color: "#f44336" }}>This field is required</span>
              )}
              {errors.duration && errors.duration.type === "minLength" && (
                <span style={{ color: "#f44336" }}>
                  Institution name should have atleast 2 letters
                </span>
              )}
            </div>

            <div className="form-group col-md-6">
              <label>
                Availability <sup style={{ color: "#f44336" }}>*</sup>
              </label>
              <input
                type="text"
                className="form-control"
                id="availability"
                name="availability"
                style={
                  errors.availability && {
                    borderColor: "red",
                    boxShadow: "none !important",
                  }
                }
                placeholder="e.g. part time, full time"
                value={state.availability}
                ref={register({ required: true })}
                onChange={handleInputChange}
              />
              {errors.availability && (
                <span style={{ color: "#f44336" }}>This field is required</span>
              )}
            </div>
            <div className="form-group col-md-6">
              <label>
                Accomplishments<sup style={{ color: "#f44336" }}>*</sup>
              </label>
              <textarea
                type="text"
                className="form-control"
                rows="2"
                placeholder="e.g. intergrated abc api with xyz api, developed stand alone abc app...."
                id="accomplishments"
                name="accomplishments"
                style={
                  errors.accomplishments && {
                    borderColor: "red",
                    boxShadow: "none !important",
                  }
                }
                value={state.accomplishments}
                ref={register({ required: true, maxLength: 150 })}
                onChange={handleInputChange}
              />
              {errors.accomplishments &&
                errors.accomplishments.type === "required" && (
                  <span style={{ color: "#f44336" }}>
                    This field is required
                  </span>
                )}

              {errors.accomplishments &&
                errors.accomplishments.type === "maxLength" && (
                  <span style={{ color: "#f44336" }}>
                    Awards string too long
                  </span>
                )}
            </div>
            <div className="text-center col-md-12">
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
      <BootstrapTable
        bootstrap4
        remote={{ cellEdit: true }}
        noDataIndication={noData}
        keyField="key"
        defaultSorted={defaultSorted}
        data={employment}
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

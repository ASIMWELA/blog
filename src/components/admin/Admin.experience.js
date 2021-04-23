import React, { useState, useEffect } from "react";
import { Col, Row, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import Axios from "axios";
import { API_BASE_URL } from "../../constants";
import cellEditFactory from "react-bootstrap-table2-editor";
import BootstrapTable from "react-bootstrap-table-next";
import ApiUtil from "../../ApiUtil/ApiUtil";
import { useForm } from "react-hook-form";
export default function AdminExperience({ authAdmin }) {
  const [state, setState] = useState({
    name: "",
    beganOn: "",
    errorMessage: "",
    isSubmitting: false,
    successMessage: "",
    technology: "",
    skills: [],
  });
  const [selectDeleteExpName, selectDeleteExp] = useState();
  const [experience, setExperience] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [disableDltBnt, setDeleteBtnDisable] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { errors, handleSubmit, register } = useForm();
  const [skills, setSkills] = useState([]);
  const [disableDltSkillBtn, setDisableDeleteSkillBtn] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [selectSkill, setSelectSkill] = useState();
  const [showDeleteSkillModal, setShowDeleteSkillModal] = useState(false);
  useEffect(() => {
    if ("experience" in authAdmin.user) {
      const exp = authAdmin.user.experience.map((exp, index) => {
        let exKey = { ...exp };
        exKey.key = index + 1;
        return exKey;
      });

      setExperience(exp);
    } else {
      setExperience([]);
    }
    if ("skills" in authAdmin.user) {
      const skls = authAdmin.user.skills.map((skill, index) => {
        let sksKey = { ...skill };
        sksKey.key = index + 1;
        return sksKey;
      });
      setSkills(skls);
    } else {
      setSkills([]);
    }
  }, [authAdmin.user]);

  useEffect(() => {
    refreshExperienceDetails();
    refreshSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultSorted = [
    {
      dataField: "key",
      order: "asc",
    },
  ];
  const noData = () => {
    return <div>No Data</div>;
  };

  const refreshExperienceDetails = async () => {
    await ApiUtil.getAdmin().then((res) => {
      if ("experience" in res) {
        const exp = res.experience.map((exp, index) => {
          let exKey = { ...exp };
          exKey.key = index + 1;
          return exKey;
        });
        setExperience(exp);
      } else {
        setExperience([]);
      }
    });
  };
  const setDeleteExp = (rowName) => {
    setShowDeleteModal(true);
    selectDeleteExp(rowName);
  };
  const deleteExperience = (rowName) => {
    setDeleteBtnDisable(true);
    Axios.delete(
      API_BASE_URL +
        `/experience/${selectDeleteExpName}/${authAdmin.user.userName}`,
      {
        headers: { Authorization: "Bearer " + authAdmin.access_TOKEN },
      }
    )
      .then((res) => {
        if (res.data.code === 200) {
          setDeleteBtnDisable(false);
          setShowDeleteModal(false);
          refreshExperienceDetails();
        }
      })
      .catch((err) => {
        setState({
          ...state,
          errorMessage: err.message || "failed to delete",
        });
        setDeleteBtnDisable(false);
      });
  };
  const handleFormSubmit = () => {
    setState({
      ...state,
      isSubmitting: true,
    });

    let experienceData = {
      name: state.name,
      beganOn: state.beganOn,
    };
    Axios({
      method: "put",
      url: API_BASE_URL + `/experience/${authAdmin.user.userName}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authAdmin.access_TOKEN}`,
      },
      data: JSON.stringify(experienceData),
    })
      .then((res) => {
        if (res.data.code === 200) {
          refreshExperienceDetails();
          setState({
            name: "",
            beganOn: "",
            successMessage: res.data.message,
            isSubmitting: false,
          });
        }
      })
      .catch((err) => {
        if (err.message.indexOf("409") >= 0) {
          setState({
            ...state,
            isSubmitting: false,
            errorMessage:
              "Experience already added. Specify a new experience entity",
          });
        } else {
          setState({
            ...state,
            isSubmitting: false,
            errorMessage: err.message || ErrorEvent.statusText,
          });
        }
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setState({
      ...state,
      name: "",
      beganOn: "",
    });
  };
  const deleteIconFormatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <div
        style={{ textAlign: "center", cursor: "pointer", lineHeight: "normal" }}
      >
        <FaTrash
          size={25}
          color={"red"}
          onClick={() => setDeleteExp(row.name)}
        />
      </div>
    );
  };

  const deleteIconFormatterSkills = (cell, row, rowIndex, formatExtraData) => {
    return (
      <div
        style={{ textAlign: "center", cursor: "pointer", lineHeight: "normal" }}
      >
        <FaTrash
          size={25}
          color={"red"}
          onClick={() => prepareDeleteSkill(row.technology)}
        />
      </div>
    );
  };
  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };
  const tableColumns = [
    {
      dataField: "key",
      text: "#",
      sort: true,
    },
    {
      dataField: "name",
      text: "Name",
      editable: false,
      headerStyle: (colum, colIndex) => {
        return { width: "45%" };
      },
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Name is required",
          });
        }
        return true;
      },
    },
    {
      dataField: "beganOn",
      text: "Began On",
      editable: false,
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Priod is required",
          });
        }
        return true;
      },
      headerStyle: (colum, colIndex) => {
        return { width: "30%" };
      },
    },
    {
      dataField: "years",
      text: "Years",
      editable: false,
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

  const tableColumnsSkills = [
    {
      dataField: "key",
      text: "#",
      sort: true,
    },
    {
      dataField: "technology",
      text: "Technology",
      editable: false,
      headerStyle: (colum, colIndex) => {
        return { width: "45%" };
      },
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Tech is required",
          });
        }
        return true;
      },
    },
    {
      dataField: "skills",
      text: "Skills",
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Skills are required",
          });
        }
        return true;
      },
      headerStyle: (colum, colIndex) => {
        return { width: "50%" };
      },
    },
    {
      dataField: "actions",
      text: "Action",
      isDummyField: true,
      editable: false,
      formatter: deleteIconFormatterSkills,
    },
  ];
  const handleSkillsModalClose = () => {
    setShowSkillsModal(false);
    setState({
      ...state,
      technology: "",
      skills: "",
      dataSuccessMsg: "",
      dataError: "",
    });
  };
  const prepareDeleteSkill = (rowName) => {
    setShowDeleteSkillModal(true);
    setSelectSkill(rowName);
  };

  const refreshSkills = async () => {
    await ApiUtil.getAdmin().then((res) => {
      if ("skills" in res) {
        const skKey = res.skills.map((skill, index) => {
          let skil = { ...skill };
          skil.key = index + 1;
          return skil;
        });
        setSkills(skKey);
      } else {
        setSkills([]);
      }
    });
  };

  const onTableChange = (
    type,
    { data, cellEdit: { rowId, dataField, newValue } }
  ) => {
    let result = data.find((data) => data.key === rowId);
    let changedRow = { ...result };
    changedRow[dataField] = newValue;
    delete changedRow.key;
    let skillArray = changedRow.skills.split(",");
    const skillsData = { ...changedRow, skills: skillArray };
    Axios({
      method: "put",
      url: API_BASE_URL + `/skill/update/${authAdmin.user.userName}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authAdmin.access_TOKEN}`,
      },
      data: JSON.stringify(skillsData),
    })
      .then((res) => {
        if (res.data.code === 200) {
          setState({
            ...state,
            technology: "",
            skills: "",
            successMessage: res.data.message,
            isSubmitting: false,
            formTitle: "Add Skill",
            submitEdit: false,
          });

          refreshSkills();
        }
      })
      .catch((err) => {
        setState({
          ...state,
          technology: "",
          skills: "",
          submitEdit: true,
          errorMessage: "we are unable to update the skill",
          isSubmitting: false,
          formTitle: "Edit " + data.technology + "Skills",
        });
      });
  };

  const deleteSkill = () => {
    setDisableDeleteSkillBtn(true);
    Axios.delete(
      API_BASE_URL + `/skill/${selectSkill}/${authAdmin.user.userName}`,
      {
        headers: {
          Authorization: `Bearer ${authAdmin.access_TOKEN}`,
        },
      }
    )
      .then((res) => {
        if (res.data.code === 200) {
          setDisableDeleteSkillBtn(false);
          setShowDeleteSkillModal(false);
          refreshSkills();
        }
      })
      .catch((err) => {
        setState({
          ...state,
          errorMessage: err.message || "Operation failed",
        });
      });
  };
  const submitForm = () => {
    setState({
      ...state,
      isSubmitting: true,
    });

    let userSkills = null;
    if (state.skills.indexOf(",") < 0) {
      userSkills = new Array(state.skills);
    } else {
      userSkills = state.skills.split(",");
    }
    let skillsData = {
      technology: state.technology,
      skills: userSkills,
    };

    Axios({
      method: "put",
      url: API_BASE_URL + `/skill/${authAdmin.user.userName}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authAdmin.access_TOKEN}`,
      },
      data: JSON.stringify(skillsData),
    })
      .then((res) => {
        if (res.data.code === 200) {
          refreshSkills();
          setState({
            ...state,
            technology: "",
            skills: "",
            successMessage: res.data.message,
            isSubmitting: false,
          });
        }
      })
      .catch((err) => {
        if (
          err.message.indexOf("409") >= 0 ||
          ErrorEvent.statusText.indexOf("409") >= 0
        ) {
          setState({
            ...state,
            isSubmitting: false,
            errorMessage: "Skill already added. Specify a new skill",
          });
        } else {
          setState({
            ...state,
            isSubmitting: false,
            errorMessage: err.message || ErrorEvent.statusText,
          });
        }
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
      <Row>
        <Col
          sm={6}
          md={6}
          style={{ borderRight: "1px solid black", height: "100%" }}
        >
          <OverlayTrigger
            placement={"right"}
            overlay={
              <Tooltip id="tooltip-disabled">Click add exp details</Tooltip>
            }
          >
            <span
              className="d-inline-block mt-1 mb-2"
              style={{ cursor: "pointer" }}
              onClick={() => setShowModal(true)}
            >
              <BsFillPlusCircleFill size={30} color={"#203045"} />
            </span>
          </OverlayTrigger>
          <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            backdrop="static"
            keyboard={false}
            size="sm"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <small> Delete</small>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <strong>Are You Sure?</strong>
            </Modal.Body>
            <Modal.Footer>
              <button
                style={{ float: "left", borderRadius: "30px" }}
                className="btn btn-dark px-5 py-2"
                onClick={() => setShowDeleteModal(false)}
              >
                No
              </button>

              <button
                onClick={deleteExperience}
                style={{ float: "right", borderRadius: "30px" }}
                className="btn btn-warning px-5 py-2"
                disabled={disableDltBnt}
              >
                Yes
              </button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showDeleteSkillModal}
            onHide={() => setShowDeleteSkillModal(false)}
            backdrop="static"
            keyboard={false}
            size="sm"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <small> Delete</small>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <strong>Are You Sure?</strong>
            </Modal.Body>
            <Modal.Footer>
              <button
                style={{ float: "left", borderRadius: "30px" }}
                className="btn btn-dark px-5 py-2"
                onClick={() => setShowDeleteSkillModal(false)}
              >
                No
              </button>

              <button
                onClick={deleteSkill}
                style={{ float: "right", borderRadius: "30px" }}
                className="btn btn-warning px-5 py-2"
                disabled={disableDltSkillBtn}
              >
                Yes
              </button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={showSkillsModal}
            onHide={handleSkillsModalClose}
            backdrop="static"
            keyboard={false}
            size="sm"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <small>Add Skills Details</small>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form id="form">
                <div className="form-group">
                  <label>
                    Technology
                    <sup style={{ color: "#f44336", fontStyle: "bold" }}>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="technology"
                    name="technology"
                    style={
                      errors.technology && {
                        borderColor: "red",
                        boxShadow: "none !important",
                      }
                    }
                    ref={register({ required: true, minLength: 2 })}
                    value={state.technology}
                    placeholder="e.g. Java"
                    onChange={handleInputChange}
                  />
                  {errors.technology &&
                    errors.technology.type === "required" && (
                      <span style={{ color: "#f44336" }}>Tech is required</span>
                    )}
                  {errors.technology &&
                    errors.technology.type === "minLength" && (
                      <span style={{ color: "#f44336" }}>
                        Tech should have atleast 2 letters
                      </span>
                    )}
                </div>
                <div className="form-group">
                  <label>
                    Skills
                    <sup style={{ color: "#f44336", fontStyle: "bold" }}>*</sup>
                  </label>
                  <textarea
                    type="text"
                    rows="3"
                    style={
                      errors.skills && {
                        borderColor: "red",
                        boxShadow: "none !important",
                      }
                    }
                    className="form-control"
                    id="skills"
                    name="skills"
                    value={state.skills}
                    placeholder="e.g.  android 3.5, springboot 4, swing 2"
                    onChange={handleInputChange}
                    ref={register({ required: true })}
                  />
                  {errors.skills && (
                    <span style={{ color: "#f44336" }}>Field is required</span>
                  )}
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    id="submitBtn"
                    className="btn btn-dark px-5 py-2"
                    style={{ borderRadius: "30px" }}
                    onClick={handleSubmit(submitForm)}
                    disabled={state.isSubmitting}
                  >
                    {state.isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </Modal.Body>
          </Modal>

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
                <small>Add Experience Details</small>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form id="form">
                <div className="form-group">
                  <label>
                    name
                    <sup style={{ color: "#f44336", fontStyle: "bold" }}>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    ref={register({ required: true, minLength: 2 })}
                    value={state.name}
                    style={
                      errors.name && {
                        borderColor: "red",
                        boxShadow: "none !important",
                      }
                    }
                    placeholder="e.g. Java"
                    onChange={handleInputChange}
                  />
                  {errors.name && errors.name.type === "required" && (
                    <span style={{ color: "#f44336" }}>Tech is required</span>
                  )}
                  {errors.name && errors.name.type === "minLength" && (
                    <span style={{ color: "#f44336" }}>
                      Name should have atleast 2 letters
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Year Started
                    <sup style={{ color: "#f44336", fontStyle: "bold" }}>*</sup>
                  </label>
                  <br />
                  <input
                    type="date"
                    id="beganOn"
                    name="beganOn"
                    style={
                      errors.beganOn && {
                        borderColor: "red",
                        boxShadow: "none !important",
                      }
                    }
                    value={state.beganOn}
                    onChange={handleInputChange}
                    ref={register({ required: true })}
                  />
                  <br />
                  {errors.beganOn && (
                    <span style={{ color: "#f44336" }}>Field is required</span>
                  )}
                </div>

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
          <div className="text-center">
            <h3>
              <small>Experience Panel</small>
            </h3>
          </div>
          <BootstrapTable
            bootstrap4
            remote={{ cellEdit: true }}
            noDataIndication={noData}
            keyField="key"
            defaultSorted={defaultSorted}
            data={experience}
            columns={tableColumns}
            cellEdit={cellEditFactory({
              mode: "dbclick",
              blurToSave: true,
            })}
            classes="table-responsive"
          />
        </Col>
        <Col sm={6} md={6}>
          <OverlayTrigger
            placement={"right"}
            overlay={
              <Tooltip id="tooltip-disabled">
                Click to Add Skill Details
              </Tooltip>
            }
          >
            <span
              className="d-inline-block mt-1"
              style={{ cursor: "pointer" }}
              onClick={() => setShowSkillsModal(true)}
            >
              <BsFillPlusCircleFill size={30} color={"#203045"} />
            </span>
          </OverlayTrigger>
          <div className="text-center">
            <h3>
              <small>Skills Panel</small>
            </h3>
          </div>

          <BootstrapTable
            bootstrap4
            remote={{ cellEdit: true }}
            noDataIndication={noData}
            keyField="key"
            onTableChange={onTableChange}
            defaultSorted={defaultSorted}
            data={skills}
            columns={tableColumnsSkills}
            cellEdit={cellEditFactory({
              mode: "dbclick",
              blurToSave: true,
            })}
            classes="table-responsive"
          />
        </Col>
      </Row>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { projects } from "../../recoilState";
import { useRecoilState } from "recoil";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { Modal } from "react-bootstrap";
import { API_BASE_URL } from "../../constants";
import ApiUtil from "../../ApiUtil/ApiUtil";
import Axios from "axios";
import "./admin.project.css";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BsFillPlusCircleFill } from "react-icons/bs";
export default function AdminProjects({ authAdmin }) {
  const [projectList, setProjects] = useRecoilState(projects);
  const [deleteBtnDisable, setDeleteBtnDisable] = useState(false);
  const [projectDeleteName, setProjectDeleteName] = useState();
  const { register, handleSubmit, errors } = useForm();
  const [show, setModalShow] = useState(false);
  const [showAddProjectModal, setAddProjectModalShow] = useState(false);
  const [state, setState] = useState({
    name: "",
    description: "",
    collaborators: "",
    locationLink: "",
    role: "",
    filterProject: "",
    isSubmitting: false,
    errorMessage: null,
  });

  useEffect(() => {
    // setProjects(pro);
    if (localStorage.data) {
      const projects = JSON.parse(localStorage.getItem("data")).projects;
      if (projects != null) {
        setProjects(projects);
      } else {
        setProjects([]);
      }
    }
  }, [setProjects]);

  const deleteIconFormatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <div
        style={{ textAlign: "center", cursor: "pointer", lineHeight: "normal" }}
      >
        <FaTrash
          size={25}
          color={"red"}
          onClick={() => setDeleteProject(row.name)}
        />
      </div>
    );
  };
  const tableColumns = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
    },
    {
      dataField: "description",
      text: "Description",
      headerStyle: (colum, colIndex) => {
        return { width: "40%" };
      },
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Project Description is required",
          });
        }
        return true;
      },
    },
    {
      dataField: "role",
      text: "Role",
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Your role is required",
          });
        }
        return true;
      },
      headerStyle: (colum, colIndex) => {
        return { width: "15%" };
      },
    },
    {
      dataField: "locationLink",
      text: "Link",
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Project link required",
          });
        }

        return true;
      },
      formatter: (cell) => {
        return (
          <>
            <Link
              to={`//${cell}`}
              target="_blank"
              className="text-dark pro-location-link"
            >
              {cell}
            </Link>
          </>
        );
      },
    },
    {
      dataField: "collaborators",
      text: "Collaborators",
      headerStyle: (colum, colIndex) => {
        return { width: "18%" };
      },
      formatter: (cell) => {
        return (
          <>
            {cell.map((label, index) => (
              <li key={index}>{label}</li>
            ))}
          </>
        );
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
  const refreshProjectData = async () => {
    const projects = await ApiUtil.getProjects()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });

    if (projects != null) {
      setProjects(projects);
    } else {
      setProjects([]);
    }
  };
  const onTableChange = (
    type,
    { data, cellEdit: { rowId, dataField, newValue } }
  ) => {
    let result = data.find((data) => data.name === rowId);

    let changedRow = { ...result };

    let processedRow;

    changedRow[dataField] = newValue;
    if (!changedRow.collaborators) {
      processedRow = { ...changedRow };
    } else {
      let collabs = null;
      if (changedRow.collaborators.indexOf(",") < 0) {
        if (changedRow.collaborators === "") {
          collabs = null;
        } else {
          collabs = new Array(changedRow.collaborators);
        }
      } else {
        collabs = changedRow.collaborators.split(",");
      }
      processedRow = { ...changedRow, collaborators: collabs };
    }
    delete processedRow._links;
    let collabds;
    if (processedRow.collaborators) {
      collabds = [].concat.apply([], processedRow.collaborators);
      processedRow.collaborators = collabds;
    }
    Axios({
      method: "put",
      url: API_BASE_URL + `/projects/${processedRow.name}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authAdmin.access_TOKEN}`,
      },
      data: JSON.stringify(processedRow),
    })
      .then((res) => {
        if (res.data.code === 200) {
          refreshProjectData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];

  const setDeleteProject = (rowName) => {
    setModalShow(true);
    setProjectDeleteName(rowName);
  };
  const deleteProject = () => {
    setDeleteBtnDisable(true);
    Axios.delete(API_BASE_URL + "/projects/" + projectDeleteName, {
      headers: {
        Authorization: `Bearer ${authAdmin.access_TOKEN}`,
      },
    })
      .then((res) => {
        if (res.data.code === 200) {
          setDeleteBtnDisable(false);
          refreshProjectData();
          setModalShow(false);
        }
      })
      .catch((err) => {
        setDeleteBtnDisable(false);
        console.log(err);
        setModalShow(false);
      });
  };

  const noData = () => {
    return <div>No Data</div>;
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

    let collabs = null;
    if (state.collaborators.indexOf(",") < 0) {
      if (state.collaborators === "") {
        collabs = null;
      } else {
        collabs = new Array(state.collaborators);
      }
    } else {
      collabs = state.collaborators.split(",");
    }
    let projectData = {
      name: state.name,
      description: state.description,
      locationLink: state.locationLink,
      role: state.role,
      collaborators: collabs,
    };
    Axios({
      method: "post",
      url: API_BASE_URL + "/projects",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authAdmin.access_TOKEN}`,
      },
      data: JSON.stringify(projectData),
    })
      .then((res) => {
        if (res.data.code === 201) {
          refreshProjectData();
          setState({
            name: "",
            description: "",
            collaborators: "",
            locationLink: "",
            formTitle: res.data.message,
            role: "",
            successMessage: res.data.message,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        if (
          err.message.indexOf("409") >= 0 ||
          ErrorEvent.statusText.indexOf("409") >= 0
        ) {
          setState({
            ...state,
            isSubmitting: false,
            errorMessage: "Project Name Already Exist",
          });
        } else if (
          err.message.indexOf("500") >= 0 ||
          ErrorEvent.statusText.indexOf("500")
        ) {
          setState({
            ...state,
            isSubmitting: false,
            errorMessage: "We are unable to process your request",
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
      <OverlayTrigger
        placement={"right"}
        overlay={
          <Tooltip id="tooltip-disabled">Click to add a new Project</Tooltip>
        }
      >
        <span className="d-inline-block">
          <BsFillPlusCircleFill
            size={30}
            color={"#203045"}
            onClick={() => setAddProjectModalShow(true)}
          />
        </span>
      </OverlayTrigger>

      <Modal
        size="sm"
        show={show}
        backdrop="static"
        onHide={() => setModalShow(false)}
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
            onClick={() => setModalShow(false)}
          >
            No
          </button>

          <button
            style={{ float: "right", borderRadius: "30px" }}
            className="btn btn-warning px-5 py-2"
            onClick={deleteProject}
            disabled={deleteBtnDisable}
          >
            Yes
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="sm"
        show={showAddProjectModal}
        backdrop="static"
        onHide={() => setAddProjectModalShow(false)}
        animation={true}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {state.errorMessage && (
            <span className="alert alert-danger my-1" role="alert">
              {state.errorMessage}
            </span>
          )}
          <form>
            <input
              onChange={handleInputChange}
              type="text"
              name="name"
              className="form-control mt-2"
              placeholder="Name"
              value={state.name}
              ref={register({ required: true, minLength: 2 })}
              style={
                errors.name && {
                  borderColor: "red",
                  boxShadow: "none !important",
                }
              }
            />
            {errors.name && errors.name.type === "required" && (
              <span style={{ color: "#f44336" }}>This field is required</span>
            )}
            {errors.name && errors.name.type === "minLength" && (
              <span style={{ color: "#f44336" }}>
                <br />
                Project name should have atleast 2 letters
              </span>
            )}

            <input
              type="text"
              className="form-control mt-2"
              placeholder="Role"
              value={state.role}
              name="role"
              onChange={handleInputChange}
              ref={register({ required: true })}
              style={
                errors.role && {
                  borderColor: "red",
                  boxShadow: "none !important",
                }
              }
            />
            {errors.role && (
              <span style={{ color: "#f44336" }}>This field is required</span>
            )}
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Location Link"
              value={state.locationLink}
              name="locationLink"
              onChange={handleInputChange}
              ref={register({ required: true })}
              style={
                errors.locationLink && {
                  borderColor: "red",
                  boxShadow: "none !important",
                }
              }
            />
            {errors.locationLink && (
              <span style={{ color: "#f44336" }}>This field is required</span>
            )}
            <input
              type="text"
              className="form-control mt-2"
              placeholder="collaborators e.g. john, Michael"
              value={state.collaborators}
              name="collaborators"
              onChange={handleInputChange}
              style={
                errors.collaborators && {
                  borderColor: "red",
                  boxShadow: "none !important",
                }
              }
            />
            <textarea
              type="text"
              className="form-control mt-2"
              placeholder="Description"
              value={state.description}
              name="description"
              onChange={handleInputChange}
              style={
                errors.description && {
                  borderColor: "red",
                  boxShadow: "none !important",
                }
              }
              ref={register({ required: true, maxLength: 150 })}
            />
            {errors.description && errors.description.type === "required" && (
              <span style={{ color: "#f44336" }}>This field is required</span>
            )}

            {errors.description && errors.description.type === "maxLength" && (
              <span style={{ color: "#f44336" }}>
                <br />
                Description too long
              </span>
            )}
            <button
              type="button"
              id="submitBtn"
              className="btn btn-dark text-center px-5 py-2 mt-3"
              style={{ marginLeft: "20%", borderRadius: "30px" }}
              onClick={handleSubmit(handleFormSubmit)}
              disabled={state.isSubmitting}
            >
              {state.isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </Modal.Body>
      </Modal>
      <BootstrapTable
        bootstrap4
        remote={{ cellEdit: true }}
        noDataIndication={noData}
        keyField="name"
        defaultSorted={defaultSorted}
        data={projectList}
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

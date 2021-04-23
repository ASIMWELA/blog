import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  OverlayTrigger,
  Tooltip,
  Modal,
} from "react-bootstrap";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { API_BASE_URL } from "../../constants";
import Axios from "axios";

export default function AdminProfile({ authAdmin }) {
  const [state, setState] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    successMessage: "",
    isSubmitting: false,
    errorMessage: "",
    validatePassword: "",
  });
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, errors } = useForm();

  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmitForm = () => {
    setState({
      ...state,
      isSubmitting: true,
    });

    const adminData = {
      userName: state.userName,
      lastName: state.lastName,
      firstName: state.firstName,
      email: state.email,
      password: state.password,
    };
    Axios({
      method: "put",
      url: API_BASE_URL + `/users/${authAdmin.user.userName}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authAdmin.access_TOKEN}`,
      },
      data: JSON.stringify(adminData),
    })
      .then((res) => {
        if (res.data.code === 200) {
          setState({
            firstName: "",
            lastName: "",
            userName: "",
            password: "",
            validatePassword: "",
            email: "",
            successMessage: `${res.data.message} . \nRefresh page to see changes`,
            isSubmitting: false,
          });
        }
      })
      .catch((err) => {
        setState({ ...state, errorMessage: err.message });
      });
  };

  const setEditAdmin = () => {
    setShowModal(true);
    setState({
      ...state,
      formTitle: "Edit your details",
      firstName: authAdmin.user.firstName,
      lastName: authAdmin.user.lastName,
      userName: authAdmin.user.userName,
      email: authAdmin.user.email,
    });
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setState({
      ...state,
      firstName: "",
      lastName: "",
      userName: "",
      password: "",
      email: "",
      validatePassword: "",
      dob: "",
      formTitle: "",
      isSubmitting: false,
      successMessage: "",
      errorMessage: "",
      submitEdit: false,
    });
  };

  return (
    <Container fluid>
      <Row>
        <Col sm={3} md={3}>
          <OverlayTrigger
            placement={"right"}
            overlay={
              <Tooltip id="tooltip-disabled">Click to Edit you details</Tooltip>
            }
          >
            <span
              className="d-inline-block mt-1"
              style={{ float: "right", cursor: "pointer" }}
              onClick={setEditAdmin}
            >
              <BiEdit size={50} color={"#203045"} />
            </span>
          </OverlayTrigger>
        </Col>
        <Col sm={3} md={6} className="mt-5">
          <Card body style={{ zIndex: "-1" }}>
            <dl className="row">
              <div></div>
              <dt className="col-sm-3">
                <FaUser className="mr-1 mb-1" />
                User name
              </dt>
              <dd className="col-sm-9">
                <strong>{authAdmin.user.userName}</strong>
              </dd>

              <dt className="col-sm-3">
                <FaUser className="mr-1 mb-1" />
                First Name
              </dt>
              <dd className="col-sm-9">
                <strong>{authAdmin.user.firstName}</strong>
              </dd>

              <dt className="col-sm-3">
                <FaUser className="mr-1 mb-1" />
                Last Name
              </dt>
              <dd className="col-sm-9">
                <strong>{authAdmin.user.lastName}</strong>
              </dd>

              <dt className="col-sm-3 text-truncate">
                {" "}
                <FaEnvelope className="mr-1 mb-1" />
                Email
              </dt>
              <dd className="col-sm-9">
                <strong>{authAdmin.user.email}</strong>
              </dd>
            </dl>
          </Card>

          <Modal
            show={showModal}
            backdrop="static"
            onHide={handleCloseModal}
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
              {state.successMessage && (
                <span className="badge  bg-info text-dark">
                  {state.successMessage}
                </span>
              )}
              <form className="row g-4">
                <div className="col-md-6">
                  <input
                    onChange={handleInputChange}
                    type="text"
                    name="firstName"
                    className="form-control mt-2"
                    placeholder="first name"
                    value={state.firstName}
                    ref={register({ required: true, minLength: 3 })}
                    style={
                      errors.firstName && {
                        borderColor: "red",
                        boxShadow: "none !important",
                      }
                    }
                  />
                  {errors.firstName && errors.firstName.type === "required" && (
                    <span style={{ color: "#f44336" }}>
                      This field is required
                    </span>
                  )}
                  {errors.firstName &&
                    errors.firstName.type === "minLength" && (
                      <span style={{ color: "#f44336" }}>
                        First name should have atleast 3 letters
                      </span>
                    )}
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="last name"
                    name="lastName"
                    onChange={handleInputChange}
                    value={state.lastName}
                    ref={register({ required: true, minLength: 3 })}
                    style={
                      errors.lastName && {
                        borderColor: "red",
                        boxShadow: "none !important",
                      }
                    }
                  />
                  {errors.lastName && errors.lastName.type === "required" && (
                    <span style={{ color: "#f44336" }}>
                      This field is required
                    </span>
                  )}
                  {errors.lastName && errors.lastName.type === "minLength" && (
                    <span style={{ color: "#f44336" }}>
                      Last name should have atleast 3 letters
                    </span>
                  )}
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="user name"
                    value={state.userName}
                    name="userName"
                    onChange={handleInputChange}
                    style={
                      errors.userName && {
                        borderColor: "red",
                        boxShadow: "none !important",
                      }
                    }
                    ref={register({ required: true, minLength: 4 })}
                  />
                  {errors.userName && errors.userName.type === "required" && (
                    <span style={{ color: "#f44336" }}>
                      This field is required
                    </span>
                  )}
                  {errors.userName && errors.userName.type === "minLength" && (
                    <span style={{ color: "#f44336" }}>
                      User name should have atleast 4 letters
                    </span>
                  )}
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="email"
                    value={state.email}
                    name="email"
                    onChange={handleInputChange}
                    style={
                      errors.email && {
                        borderColor: "red",
                        boxShadow: "none !important",
                      }
                    }
                    ref={register({
                      required: true,
                      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    })}
                  />
                  {errors.email && errors.email.type === "required" && (
                    <span style={{ color: "#f44336" }}>
                      This field is required
                    </span>
                  )}
                  {errors.email && errors.email.type === "pattern" && (
                    <span style={{ color: "#f44336" }}>
                      Invalid email address
                    </span>
                  )}
                </div>

                <div className="col-md-6">
                  <input
                    type="password"
                    className="form-control mt-2"
                    id="password"
                    name="password"
                    placeholder="new password"
                    value={state.password}
                    onChange={handleInputChange}
                    style={
                      errors.password && {
                        borderColor: "red",
                        boxShadow: "none !important",
                      }
                    }
                    ref={register({ required: true, minLength: 5 })}
                  />
                  {errors.password && errors.password.type === "required" && (
                    <span style={{ color: "#f44336" }}>
                      This field is required
                    </span>
                  )}
                  {errors.password && errors.password.type === "minLength" && (
                    <span style={{ color: "#f44336" }}>
                      Password should have atleast 5 characters long
                    </span>
                  )}
                </div>
                <div className="col-md-6">
                  <input
                    type="password"
                    className="form-control mt-2"
                    id="validatePassword1"
                    placeholder="confirm password"
                    name="validatePassword"
                    value={state.validatePassword}
                    ref={register({
                      required: true,
                      validate: (value) => value === state.password,
                    })}
                    onChange={handleInputChange}
                    style={
                      errors.validatePassword && {
                        borderColor: "red",
                        boxShadow: "none !important",
                      }
                    }
                  />
                  {errors.validatePassword &&
                    errors.validatePassword.type === "validate" && (
                      <span style={{ color: "#f44336" }}>
                        Passwords do not match
                      </span>
                    )}

                  {errors.validatePassword &&
                    errors.validatePassword.type === "required" && (
                      <span style={{ color: "#f44336" }}>
                        This filed is required
                      </span>
                    )}
                </div>

                <div className="col-md-12 text-center">
                  <button
                    type="button"
                    id="submitBtn"
                    onClick={handleSubmit(handleSubmitForm)}
                    className="btn btn-dark text-center px-5 py-2 mt-3"
                    style={{ borderRadius: "30px" }}
                    disabled={state.isSubmitting}
                  >
                    {state.isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
          <div className="text-center">
            <strong>Address details</strong>
          </div>
        </Col>
        <Col sm={3} md={3}></Col>
      </Row>
    </Container>
  );
}

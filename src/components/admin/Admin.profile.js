import React, { useState, useEffect, useLayoutEffect } from "react";
import { OverlayTrigger, Tooltip, Modal, Card } from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaAddressBook,
  FaCity,
  FaAddressCard,
  FaTrash,
} from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { API_BASE_URL } from "../../constants";
import { BsFillPlusCircleFill, BsPhone } from "react-icons/bs";
import { FiUser, FiFlag } from "react-icons/fi";
import Axios from "axios";
import ApiUtil from "../../ApiUtil/ApiUtil";

export default function AdminProfile({ authAdmin }) {
  const [state, setState] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    city: "",
    physicalAddress: "",
    phoneNumber: "",
    country: "",
    successMessage: "",
    isSubmitting: false,
    errorMessage: "",
    validatePassword: "",
    formTitle: "",
  });
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const [selectedPhone, setSelectPhone] = useState();
  const [address, setAddress] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if ("contactInfo" in authAdmin.user) {
      setAddress(authAdmin.user.contactInfo);
    }
  }, [authAdmin.user]);

  useLayoutEffect(() => {
    refreshAddress();
  }, []);

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
  const refreshAddress = async () => {
    await ApiUtil.getAdmin().then((res) => {
      if ("contactInfo" in res) {
        setAddress(res.contactInfo);
      } else setAddress();
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

  const handleCloseAddAddressModal = () => {
    setShowAddAddressModal(false);
    setState({
      ...state,
      city: "",
      physicalAddress: "",
      phoneNumber: "",
      country: "",
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

  const saveEditedAddressDetails = () => {
    setState({
      ...state,
      isSubmitting: true,
      errorMessage: null,
    });
    const contactDetails = {
      city: state.city,
      country: state.country,
      physicalAddress: state.physicalAddress,
      phoneNumber: state.phoneNumber,
    };

    Axios({
      method: "put",
      url: API_BASE_URL + "/contact-info/update/" + selectedPhone,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authAdmin.access_TOKEN}`,
      },
      data: JSON.stringify(contactDetails),
    })
      .then((res) => {
        if (res.data.code === 200) {
          refreshAddress();

          setState({
            city: "",
            country: "",
            phoneNumber: "",
            physicalAddress: "",
            submitEdit: false,
            formTitle: "Add Education Details",
            successMessage: res.data.message,
            isSubmitting: false,
          });

          setTimeout(() => {
            setShowAddAddressModal(false);
          }, 3000);
        }
      })
      .catch((err) => {
        setState({
          ...state,
          errorMessage: err.message,
          isSubmitting: false,
        });
      });
  };

  const hanldeFormSubmitAddress = () => {
    setState({
      ...state,
      isSubmitting: true,
      errorMessage: null,
    });
    const address = {
      country: state.country,
      city: state.city,
      phoneNumber: state.phoneNumber,
      physicalAddress: state.physicalAddress,
    };

    Axios({
      method: "put",
      url: API_BASE_URL + "/contact-info/" + authAdmin.user.userName,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authAdmin.access_TOKEN}`,
      },
      data: JSON.stringify(address),
    })
      .then((res) => {
        if (res.data.code === 200) {
          refreshAddress();
          setState({
            city: "",
            physicalAddress: "",
            phoneNumber: "",
            country: "",
            submitEdit: false,
            isSubmitting: false,
            formTitle: "Add Education Details",
            successMessage: res.data.message,
          });
          setTimeout(() => {
            setShowAddAddressModal(false);
          }, 3000);
        }
      })
      .catch((err) => {
        setState({
          ...state,
          errorMessage: err.message,
        });
      });
  };

  const deleteAddressDetails = () => {
    setState({
      ...state,
      isSubmitting: true,
    });
    Axios.delete(
      API_BASE_URL +
        `/contact-info/${selectedPhone}/${authAdmin.user.userName}`,
      {
        headers: {
          Authorization: `Bearer ${authAdmin.access_TOKEN}`,
        },
      }
    )
      .then((res) => {
        if (res.data.code === 200) {
          refreshAddress();
          setState({
            ...state,
            isSubmitting: true,
          });
          setTimeout(() => {
            setShowDeleteModal(false);
          }, 1000);
        }
      })
      .catch((err) => {
        setState({
          ...state,
          errorMessage: err.message,
        });
      });
  };

  const prepareDeleteAddress = () => {
    setShowDeleteModal(true);
    setSelectPhone(address.phoneNumber);
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-4">
          <div style={{ marginLeft: "20%" }}>
            <div className="ml-4">
              <FiUser size={45} />
            </div>
            <div>
              <strong style={{ fontWeight: "bold" }}>Admin Details</strong>
            </div>
          </div>
          <dl className="row mt-2">
            <dt className="col-sm-5">
              <FaUser className="mb-1" />
              User name
            </dt>
            <dd className="col-sm-3">
              <strong>{authAdmin.user.userName}</strong>
            </dd>

            <dt className="col-sm-5">
              <FaUser className="mb-1" />
              First Name
            </dt>
            <dd className="col-sm-5">
              <strong>{authAdmin.user.firstName}</strong>
            </dd>

            <dt className="col-sm-5">
              <FaUser className="mb-1" />
              Last Name
            </dt>
            <dd className="col-sm-5">
              <strong>{authAdmin.user.lastName}</strong>
            </dd>
            <div className="text-center">
              <dt className="col-sm-12">
                <FaEnvelope className="mr-1 mb-1" />
                Email
              </dt>
              <dd className="col-sm-12 ml-2">
                <strong>{authAdmin.user.email}</strong>
              </dd>
            </div>
            <Card className="col-md-8">
              <Card.Body className="p-0">
                <OverlayTrigger
                  placement={"bottom"}
                  overlay={
                    <Tooltip id="tooltip-disabled">
                      Click to Edit you details
                    </Tooltip>
                  }
                >
                  <span
                    className="d-inline-block"
                    style={{ float: "left", cursor: "pointer" }}
                    onClick={setEditAdmin}
                  >
                    <BiEdit size={30} color={"#203045"} />
                  </span>
                </OverlayTrigger>
              </Card.Body>
            </Card>
          </dl>
          <div></div>
        </div>
        <div className="col-sm-1"></div>
        <div className="col-md-3" style={{ marginTop: "7%" }}>
          <div style={{ marginLeft: "24%" }}>
            <div className="ml-3">
              <FaAddressBook size={25} />
            </div>
            <div>
              <strong>Address</strong>
            </div>
          </div>

          {!address && (
            <div>
              <OverlayTrigger
                placement={"right"}
                overlay={
                  <Tooltip id="tooltip-disabled">
                    click To Add Address Details
                  </Tooltip>
                }
              >
                <span
                  className="d-inline-block mt-1 mb-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowAddAddressModal(true);
                    setState({
                      ...state,
                      formTitle: "Add Address Details",
                    });
                  }}
                >
                  <BsFillPlusCircleFill size={30} color={"#203045"} />
                </span>
              </OverlayTrigger>
            </div>
          )}
          {address && (
            <dl className="row mt-2">
              <dt className="col-sm-5">
                <BsPhone className="mb-1" />
                Phone
              </dt>
              <dd className="col-sm-3">
                <strong>{address.phoneNumber}</strong>
              </dd>

              <dt className="col-sm-5">
                <FaCity className="mb-1" />
                City
              </dt>
              <dd className="col-sm-5">
                <strong>{address.city}</strong>
              </dd>

              <dt className="col-sm-5">
                <FiFlag className="mb-1" />
                Country
              </dt>
              <dd className="col-sm-5">
                <strong>{address.country}</strong>
              </dd>
              <div className="text-center">
                <dt className="col-sm-12">
                  {" "}
                  <FaAddressCard
                    size={25}
                    className="mb-1"
                    style={{ marginLeft: "-5%" }}
                  />
                  Physical Address
                </dt>
                <dd className="col-sm-12">
                  <strong>{address.physicalAddress}</strong>
                </dd>
              </div>
              <Card className="col-sm-10">
                <Card.Body className="p-0">
                  <OverlayTrigger
                    placement={"bottom"}
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        Click to Edit Address Details
                      </Tooltip>
                    }
                  >
                    <span
                      className="d-inline-block"
                      style={{ float: "left", cursor: "pointer" }}
                      onClick={() => {
                        setShowAddAddressModal(true);
                        setSelectPhone(address.phoneNumber);
                        setState({
                          ...state,
                          formTitle: "Edit Your Address Details",
                          phoneNumber: address.phoneNumber,
                          physicalAddress: address.physicalAddress,
                          country: address.country,
                          city: address.city,
                          submitEdit: true,
                        });
                      }}
                    >
                      <BiEdit className="text-dark" size={30} />
                    </span>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement={"bottom"}
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        Delete Address Details
                      </Tooltip>
                    }
                  >
                    <span
                      className="d-inline-block"
                      style={{ float: "right", cursor: "pointer" }}
                      onClick={prepareDeleteAddress}
                    >
                      <FaTrash className="p-1" color={"red"} size={30} />
                    </span>
                  </OverlayTrigger>
                </Card.Body>
              </Card>
            </dl>
          )}
        </div>
        <div className="col-md-2"></div>
      </div>
      <Modal
        show={showModal}
        backdrop="static"
        onHide={handleCloseModal}
        animation={true}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Your Details</Modal.Title>
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
                <span style={{ color: "#f44336" }}>This field is required</span>
              )}
              {errors.firstName && errors.firstName.type === "minLength" && (
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
                <span style={{ color: "#f44336" }}>This field is required</span>
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
                <span style={{ color: "#f44336" }}>This field is required</span>
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
                <span style={{ color: "#f44336" }}>This field is required</span>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <span style={{ color: "#f44336" }}>Invalid email address</span>
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
                <span style={{ color: "#f44336" }}>This field is required</span>
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

      <Modal
        show={showAddAddressModal}
        backdrop="static"
        onHide={handleCloseAddAddressModal}
        animation={true}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{state.formTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="row g-4" id="form">
            <div className="form-group col-md-6">
              <label>
                Phone number<sup style={{ color: "#f44336" }}>*</sup>
              </label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                style={
                  errors.phoneNumber && {
                    borderColor: "red",
                    boxShadow: "none !important",
                  }
                }
                name="phoneNumber"
                value={state.phoneNumber}
                ref={register({ required: true })}
                onChange={handleInputChange}
              />
              {errors.phoneNumber && (
                <span style={{ color: "#f44336" }}>This field is required</span>
              )}
            </div>
            <div className="form-group col-md-6">
              <label>
                City<sup style={{ color: "#f44336" }}>*</sup>
              </label>
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                style={
                  errors.city && {
                    borderColor: "red",
                    boxShadow: "none !important",
                  }
                }
                value={state.city}
                ref={register({ required: true, minLength: 2 })}
                onChange={handleInputChange}
              />
              {errors.city && (
                <span style={{ color: "#f44336" }}>This field is required</span>
              )}
              {errors.city && errors.city.type === "minLength" && (
                <span style={{ color: "#f44336" }}>
                  City name should have atleast 2 letters
                </span>
              )}
            </div>
            <div className="form-group col-md-6">
              <label>
                Country <sup style={{ color: "#f44336" }}>*</sup>
              </label>
              <input
                type="text"
                className="form-control"
                id="country"
                name="country"
                style={
                  errors.country && {
                    borderColor: "red",
                    boxShadow: "none !important",
                  }
                }
                value={state.country}
                ref={register({ required: true })}
                onChange={handleInputChange}
              />
              {errors.country && (
                <span style={{ color: "#f44336" }}>This field is required</span>
              )}
            </div>

            <div className="form-group col-md-6">
              <label>
                Physical Address<sup style={{ color: "#f44336" }}>*</sup>
              </label>
              <textarea
                type="text"
                className="form-control"
                rows="2"
                placeholder="e.g. Computer science department, Chanco, box..."
                id="physicalAddress"
                name="physicalAddress"
                style={
                  errors.physicalAddress && {
                    borderColor: "red",
                    boxShadow: "none !important",
                  }
                }
                value={state.physicalAddress}
                ref={register({ required: true, maxLength: 150 })}
                onChange={handleInputChange}
              />
              {errors.physicalAddress &&
                errors.physicalAddress.type === "required" && (
                  <span style={{ color: "#f44336" }}>
                    This field is required
                  </span>
                )}

              {errors.physicalAddress &&
                errors.physicalAddress.type === "maxLength" && (
                  <span style={{ color: "#f44336" }}>
                    Awards string too long
                  </span>
                )}
            </div>
            <div className="col-md-12 text-center">
              <button
                type="button"
                id="submitBtn"
                onClick={
                  state.submitEdit
                    ? handleSubmit(saveEditedAddressDetails)
                    : handleSubmit(hanldeFormSubmitAddress)
                }
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
            onClick={deleteAddressDetails}
            disabled={state.isSubmitting}
          >
            Yes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

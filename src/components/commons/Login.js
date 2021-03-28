import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { API_BASE_URL } from "../../constants";
import { useRecoilState } from "recoil";
import { loggedInAdmin } from "../../recoilState";
import Axios from "axios";
import "./login.css";

export default function Login() {
  const history = useHistory();
  let err = useRef();
  // eslint-disable-next-line no-unused-vars
  const [logInAdmin, setLoggedInAdmin] = useRecoilState(loggedInAdmin);
  const [state, setState] = useState({
    userName: "",
    password: "",
    isSubmitting: false,
    errorMessage: null,
  });
  useEffect(() => {
    document.querySelector("#err").style = "display:none";
  }, []);
  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setState({
      ...state,
      isSubmitting: true,
      errorMessage: null,
    });
    Axios({
      method: "post",
      url: API_BASE_URL + "/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        userName: state.userName,
        password: state.password,
      }),
    })
      .then((user) => {
        const roles = user.data.user.roles.map((role) => role.name);
        if (roles.length > 1 && roles.includes("ROLE_ADMIN")) {
          setLoggedInAdmin(user.data);
          history.push("/admin");
        } else {
          localStorage.setItem("user", JSON.stringify(user.data));
          history.push("/user");
        }
      })
      .catch((error) => {
        if (error.message.includes(401)) {
          console.log(err);
          document.querySelector("#err").style = "display:block";
          setState({
            ...state,
            isSubmitting: false,
            errorMessage: "Username, password do not match",
          });
        } else {
          document.querySelector("#err").style = "display:block";
          setState({
            ...state,
            isSubmitting: false,
            errorMessage: error.message,
          });
        }
      });
  };

  return (
    <div className="container-fluid mt-5">
      <div className="wrapper fadeInDown">
        <div id="formContent">
          <div className="fadeIn first">
            <FaUser id="icon" size={60} />
          </div>
          <div
            className="alert alert-danger mt-1 mb-0"
            id="err"
            role="alert"
            style={{ maxWidth: "64%", marginLeft: "17%", display: "none" }}
          >
            {state.errorMessage}
          </div>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              id="login"
              className="fadeIn second"
              placeholder="Username"
              name="userName"
              onChange={handleInputChange}
              value={state.userName}
            />

            <input
              type="password"
              id="password"
              className="fadeIn third"
              placeholder="password"
              onChange={handleInputChange}
              value={state.password}
              name="password"
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleFormSubmit(event);
                }
              }}
            />

            <input
              type="submit"
              className="btn btn-dark"
              value={state.isSubmitting ? "Authenticating..." : "Log In"}
              disabled={state.isSubmitting}
            />
          </form>
          <Link className="underlineHover" to="/reset-password">
            Forgot Password?
          </Link>
          <div id="formFooter">
            <Link
              className="underlineHover mr-4"
              to="/"
              style={{ float: "left" }}
            >
              Home
            </Link>
            <small>
              <span className="ml-5 pb-2" style={{ float: "right" }}>
                Not a member?{" "}
                <Link className="underlineHover mr-4" to="/reset-password">
                  Sign Up
                </Link>
              </span>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

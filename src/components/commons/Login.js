import React from "react";
import { Link } from "react-router-dom";
import { BiCodeAlt } from "react-icons/bi";
import "./login.css";

export default function Login() {
  return (
    <div className="container-fluid">
      <div className="row main-content bg-success text-center">
        <div className="col-md-4 text-center company__info">
          <span className="company__logo">
            <h2>
              <BiCodeAlt size={70} />
            </h2>
          </span>
          <h4 className="company_title">Your Company Logo</h4>
        </div>
        <div className="col-md-8 col-xs-12 col-sm-12 login_form ">
          <div className="container-fluid">
            <div className="row">
              <h2 classNameName="text-center">Log In</h2>
            </div>
            <div className="row">
              <form control="" className="form-group">
                <div className="row">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="form__input"
                    placeholder="Username"
                  />
                </div>
                <div className="row">
                  <span className="fa fa-lock"></span>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="form__input"
                    placeholder="Password"
                  />
                </div>

                <div className="row">
                  <input type="submit" value="Submit" className="btn" />
                </div>
              </form>
            </div>
            <div class="row">
              <p>
                Don't have an account? <a href="#">Register Here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

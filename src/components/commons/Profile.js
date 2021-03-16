import React, { useState, useEffect } from "react";
import { BiUserCircle } from "react-icons/bi";
import { IoIosPhonePortrait, IoIosMail } from "react-icons/io";
import { Link } from "react-router-dom";
import {
  AiFillFacebook,
  AiFillLinkedin,
  AiFillGithub,
  AiFillTwitterCircle,
} from "react-icons/ai";
import "./profile.css";

export default function Profile() {
  const [admin, setAdmin] = useState({});
  useEffect(() => {
    if (localStorage.data) {
      const adminData = JSON.parse(localStorage.getItem("data")).admin;
      if (!adminData) {
        return;
      } else {
        setAdmin(adminData);
      }
    }
  }, []);

  console.log(admin);
  return (
    <div className="container-fluid">
      <div className="row" style={{ marginTop: "-14%" }}>
        <div className="col-sm-4 ml-2">
          <div
            className="card ml-3 rounded profile-card"
            style={{ width: "18rem" }}
          >
            <div className="backround-cover  text-center">
              <BiUserCircle
                size={70}
                style={{ color: "white" }}
                className="m-2"
              />
            </div>
            <div className="card-body text-center">
              <h4 className="card-title">
                <span className="mr-2">{admin.firstName}</span>
                <span>{admin.lastName}</span>{" "}
              </h4>
              <h6 className="card-text">
                <IoIosMail size={20} />
                {admin.email}
              </h6>
              {admin.contactInfo && (
                <h6 className="card-text">
                  <IoIosPhonePortrait className="mb-1 mr-2" />
                  {admin.contactInfo.phoneNumber}
                </h6>
              )}
              <h6 className="card-text">
                Age:{" "}
                <span className="badge rounded-pill bg-dark text-light ml-1">
                  {admin.age}
                </span>
              </h6>
              <h6 className="card-text">
                Sex:{" "}
                <span className="badge rounded-pill bg-dark text-light ml-1">
                  {admin.sex}
                </span>
              </h6>
            </div>
            <div className="card-footer">
              <div>
                <Link className="ml-0" to="//www.facebook.com" target="_blank">
                  <AiFillFacebook size={40} />
                </Link>

                <Link className="ml-4" to="//www.linkedin.com" target="_blank">
                  <AiFillLinkedin size={40} />
                </Link>
                <Link className="ml-4" to="//www.github.com" target="_blank">
                  <AiFillGithub size={40} />
                </Link>
                <Link className="ml-4" to="//www.twitter.com/" target="_blank">
                  {" "}
                  <AiFillTwitterCircle size={40} />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-8"></div>
      </div>
    </div>
  );
}

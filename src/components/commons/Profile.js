import React, { useState, useEffect, useRef } from "react";
import { BiUserCircle } from "react-icons/bi";
import { IoIosPhonePortrait, IoIosMail, IoMdSettings } from "react-icons/io";
import {
  AiFillFacebook,
  AiFillLinkedin,
  AiFillGithub,
  AiFillTwitterCircle,
} from "react-icons/ai";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";
import { animateRight, animateTop } from "../../animations/Animate";
import { AdminDetailsNotAvailable } from "./";
import "./profile.css";
import GraduatingStudent from "../../asserts/graduating-student.jpg";
import EmployementIcon from "../../asserts/employee.jpg";

export default function Profile() {
  const [admin, setAdmin] = useState({});
  const [education, setEducationAwards] = useState([]);
  const [experience, setExperience] = useState([]);
  const [employment, setEmployment] = useState([]);
  const [toggleAchvmnts, setToggleAchievement] = useState(false);
  let profileCard = useRef(null);
  let educationDetails = useRef(null);

  useEffect(() => {
    animateRight(profileCard);
    animateTop(educationDetails);
    if (localStorage.data) {
      const adminData = JSON.parse(localStorage.getItem("data")).admin;
      if (!adminData) {
        return;
      } else {
        setAdmin(adminData);
      }
    }
  }, []);

  useEffect(() => {
    if (!admin) {
      return;
    } else {
      if ("education" in admin) {
        setEducationAwards(admin.education);
      }

      if ("experience" in admin) {
        const experience = admin.experience.map((exp) => {
          const experience = { ...exp };
          if ("skills" in admin) {
            // eslint-disable-next-line array-callback-return
            admin.skills.map((skill) => {
              if (
                skill.technology.toLowerCase() === experience.name.toLowerCase()
              ) {
                experience.skills = skill.skills;
              }
            });
          }

          return experience;
        });

        setExperience(experience);
      }

      if ("employment" in admin) {
        setEmployment(admin.employment);
      }
    }
  }, [admin]);

  const toggleAchievements = (event) => {
    const elem = document.getElementById(event.currentTarget.value);

    console.log(elem);
    setToggleAchievement(!toggleAchvmnts);
  };
  const dynamicClasses = () => {
    const awardCls = ["badge rounded-pill bg-dark text-light ml-1"];

    const random = Math.floor(Math.random() * awardCls.length);

    return awardCls[random];
  };

  console.log(employment);
  return (
    <div className="container-fluid profile-card">
      <div className="row">
        <div className="col-sm-4" style={{ marginTop: "-1%" }}>
          <div
            className="card ml-3 rounded"
            style={{ width: "18rem" }}
            ref={(el) => (profileCard = el)}
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
        <div
          className="col-sm-8"
          style={{ marginTop: "-12%" }}
          ref={(el) => (educationDetails = el)}
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-8 text-center">
                <h2 className="text-center">
                  <FaGraduationCap /> My Education
                </h2>
                <div className="text-center">
                  I have Enjoyed a Thrilling Career in Education. This can be
                  demonsrated by my awards. Below are my education Institutions
                  I have attended and the respective Awards
                  <table className="table  table-sm">
                    <thead>
                      <tr>
                        <th scope="col">Institution</th>
                        <th scope="col">Awards</th>
                        <th scope="col">Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {education.map((education, index) => {
                        return (
                          <tr key={index}>
                            <td className="badge rounded-pill bg-info text-dark mt-2">
                              {education.institution.toUpperCase()}
                            </td>
                            <td>
                              {education.awards.map((award, index) => {
                                return (
                                  <span
                                    key={index}
                                    className={dynamicClasses()}
                                  >
                                    {award.toUpperCase()}
                                  </span>
                                );
                              })}
                            </td>
                            <td className="badge rounded-pill bg-grey-dark text-dark ">
                              {education.period}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-sm-4">
                <img
                  src={GraduatingStudent}
                  alt=""
                  width="150"
                  height="200"
                  className="mr-5"
                />
              </div>
            </div>
          </div>
          <hr />
          <div className="row mt-4">
            <div className="col-sm-12">
              <div>
                <span className="d-flex">
                  <IoMdSettings size={50} />{" "}
                  <h2 className="mt-1">Experience</h2>
                </span>
                <div className="container overflow-hidden">
                  {experience.length > 0 ? (
                    <div className="row gy-4 mb-2">
                      {experience.map((exp, index) => {
                        return (
                          <div className="col-4" key={index}>
                            <div className="p-1 mt-2">
                              <span className="badge rounded-pill bg-dark text-light mr-2">
                                {exp.name}
                              </span>
                              <span className="badge rounded-pill bg-grey-dark text-dark">
                                {exp.years} Years
                              </span>
                              <div>
                                {exp.skills && (
                                  <span>
                                    {exp.skills.map((sk, index) => {
                                      return (
                                        <span
                                          key={index}
                                          className="badge rounded-pill bg-info text-dark mr-2"
                                        >
                                          {sk}
                                        </span>
                                      );
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <AdminDetailsNotAvailable message="Experience" />
                  )}
                </div>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="text-center">
          <img
            src={EmployementIcon}
            alt=""
            height="100"
            width="100"
            className="mb-0 mr-3"
          />
          <h2 className="mt-0">Employment</h2>
        </div>
        {employment.length > 0 ? (
          <div className="row">
            {employment.map((empDetails, index) => {
              return (
                <div className="col-sm-4" key={index}>
                  <div id="accordion">
                    <div className="card">
                      <div className="card-header text-center" id="headingOne">
                        <strong className="pb-0">
                          {empDetails.company.toUpperCase()}
                        </strong>
                        <br />
                        <span className="badge  bg-info text-dark mr-2 pt-0">
                          {empDetails.duration}
                        </span>
                        <span className="badge  bg-info text-dark mr-2 pt-0">
                          {empDetails.availability}
                        </span>
                        <button
                          className="btn btn-link"
                          data-toggle="collapse"
                          data-target={`#${empDetails.company}`}
                          aria-controls="collapseOne"
                          aria-expanded="false"
                          id="toggleAchievements"
                          onClick={(event) => toggleAchievements(event)}
                          value={empDetails.company}
                        >
                          {toggleAchvmnts ? (
                            <span>
                              Close <FaAngleUp size={20} />
                            </span>
                          ) : (
                            <span>
                              Achievements <FaAngleDown size={20} />
                            </span>
                          )}
                        </button>
                      </div>

                      <div
                        id={empDetails.company}
                        className="collapse"
                        aria-labelledby="headingOne"
                        data-parent="#accordion"
                      >
                        <div className="card-body">
                          {empDetails.accomplishments.map((accomp, index) => {
                            return (
                              <span
                                className="badge rounded-pill bg-dark text-light mr-2"
                                key={index}
                              >
                                {accomp}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <AdminDetailsNotAvailable message="Employment" />
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { BiUserCircle } from "react-icons/bi";
import { IoIosPhonePortrait, IoIosMail, IoMdSettings } from "react-icons/io";
import { FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";
import { animateRight, animateTop } from "../../animations/Animate";
import {
  AiFillFacebook,
  AiFillLinkedin,
  AiFillGithub,
  AiFillTwitterCircle,
} from "react-icons/ai";
import "./profile.css";
import GraduatingStudent from "../../asserts/graduating-student.jpg";
import EmployementIcon from "../../asserts/employee.jpg";

export default function Profile() {
  const [admin, setAdmin] = useState({});
  const [education, setEducationAwards] = useState([]);
  const [experience, setExperience] = useState([]);
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
    }
  }, [admin]);

  const dynamicClasses = () => {
    const awardCls = [
      "badge rounded-pill bg-secondary text-light ml-1",
      "badge rounded-pill bg-dark text-light ml-1",
    ];

    const random = Math.floor(Math.random() * awardCls.length);

    return awardCls[random];
  };

  console.log(experience);

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
              {experience.length > 0 && (
                <div>
                  <span className="d-flex">
                    <IoMdSettings size={50} />{" "}
                    <h2 className="mt-1">Experience</h2>
                  </span>
                  <div className="container overflow-hidden">
                    <div className="row gy-5">
                      {experience.map((exp, index) => {
                        return (
                          <div className="col-6" key={index}>
                            <div className="p-1 mt-2  bg-light">
                              <span className="badge rounded-pill bg-dark text-light mr-2">
                                {exp.name}
                              </span>
                              <span className="badge rounded-pill bg-light text-dark">
                                {exp.years} Years
                              </span>
                              <div>
                                {exp.skills && (
                                  <span>
                                    {exp.skills.map((sk, index) => {
                                      return (
                                        <span
                                          key={index}
                                          className="badge rounded-pill bg-info text-dark"
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="text-center">
            <img
              src={EmployementIcon}
              alt=""
              height="100"
              width="100"
              className="mb-0 mr-4"
            />
            <h2 className="mt-0">Employment</h2>
          </div>
          <div id="accordion">
            <div className="card">
              <div className="card-header" id="headingOne">
                <h5 className="mb-0">
                  <div>Hello Here</div>
                  <div>Hello Here</div>
                  <div>Hello Here</div>
                  <button
                    className="btn btn-link"
                    data-toggle="collapse"
                    data-target="#collapseOne"
                    aria-controls="collapseOne"
                  >
                    Collapsible Group Item #1
                  </button>
                </h5>
              </div>

              <div
                id="collapseOne"
                className="collapse show"
                aria-labelledby="headingOne"
                data-parent="#accordion"
              >
                <div className="card-body">
                  Anim pariatur cliche reprehenderit, enim eiusmod high life
                  accusamus terry richardson ad squid. 3 wolf moon officia aute,
                  non cupidatat skateboard dolor brunch. Food truck quinoa
                  nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                  aliqua put a bird on it squid single-origin coffee nulla
                  assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft
                  beer labore wes anderson cred nesciunt sapiente ea proident.
                  Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
                  beer farm-to-table, raw denim aesthetic synth nesciunt you
                  probably haven't heard of them accusamus labore sustainable
                  VHS.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

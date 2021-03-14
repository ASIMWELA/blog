import React, { useEffect, useRef, useState } from "react";
import computerUser from "../../asserts/computer-user.png";
import { Link } from "react-router-dom";
import { BsCodeSlash } from "react-icons/bs";
import { AiOutlineMail, AiOutlineArrowRight } from "react-icons/ai";
import "./home.css";

import { textIntro, careerIntro } from "../../animations/Animate";

export default function Home() {
  const [admin, setAdmin] = useState(null);
  const [awards, setAwards] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  let home = useRef(null);
  let career = useRef(null);

  useEffect(() => {
    textIntro(home);
    careerIntro(career);
    if (localStorage.data) {
      setAdmin(JSON.parse(localStorage.data).admin);
    }
  }, []);

  useEffect(() => {
    if (!admin) {
      return;
    } else {
      if ("education" in admin) {
        const awardsMulti = admin.education.map((education) => {
          return education.awards.map((awards) => awards);
        });
        const awards = [].concat.apply([], awardsMulti);
        setAwards(awards);
      }

      if ("skills" in admin) {
        const adminSkills = [].concat.apply(
          [],
          admin.skills.map((skills) => skills.skills)
        );

        setSkills(adminSkills);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  console.log(admin);

  const dynamicClasses = () => {
    const awardCls = [
      "badge rounded-pill bg-secondary text-light ml-1",
      "badge rounded-pill bg-warning text-light ml-1",
      "badge rounded-pill bg-dark text-light ml-1",
      "badge rounded-pill bg-success text-light ml-1",
      "badge rounded-pill bg-light text-dark ml-1",
    ];

    const random = Math.floor(Math.random() * awardCls.length);

    return awardCls[random];
  };

  return (
    <div className="container-fluid home ">
      <div className="row">
        <div
          style={{ marginTop: "-15%" }}
          className="col-sm-5 text-center"
          ref={(el) => (home = el)}
        >
          <div>
            <Link to="/profile">
              <img
                src={computerUser}
                className="rounded-circle"
                height="100"
                width="100"
                alt="Augustine"
              />
            </Link>
            <h5>Who Am I ?</h5>
            <p className="descriptionPara">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              vitae elit ut dolor efficitur placerat id eu sapien. Mauris.
              {skills.length > 0 && (
                <span>
                  {" "}
                  My SkillSet Include{" "}
                  {skills.map((skill) => {
                    return (
                      <span className={dynamicClasses()} key={skill}>
                        {skill}
                      </span>
                    );
                  })}
                </span>
              )}
              porttitor, mi ut posuere vestibulum, arcu libero euismod leo,
              vitae vehicula turpis lorem id turpis. Vivamus ullamcorper lacus
              metus, eu pellentesque augue pellentesque sed. Donec pellentesque
              vitae lacus aliquam ornare.
            </p>
            <Link to="/projects">
              <button className="btn btn-secondary">
                Get Started <AiOutlineArrowRight className="mb-1" />{" "}
              </button>
            </Link>
          </div>
        </div>
        <div className="com-sm-2"></div>
        <div
          style={{ marginTop: "-5%" }}
          className="col-sm-5 text-center ml-5"
          ref={(el) => (career = el)}
        >
          <BsCodeSlash size={50} className="mt-5 text-secondary" />
          <h5>Career Span</h5>
          <p className="descriptionPara">
            {awards.length > 0 && (
              <span>
                Education Awards:{" "}
                {awards.map((award) => {
                  return (
                    <span className={dynamicClasses()} key={award}>
                      {award}
                    </span>
                  );
                })}
              </span>
            )}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae
            elit ut dolor efficitur placerat id eu sapien. Mauris porttitor, mi
            ut posuere vestibulum, arcu libero euismod leo, vitae vehicula
            turpis lorem id turpis. Vivamus ullamcorper lacus metus, eu
            pellentesque augue pellentesque sed. Donec pellentesque vitae lacus
            aliquam ornare.
          </p>
          <Link to="/contact">
            <button className="btn btn-secondary">
              <AiOutlineMail size={20} className="mb-1" /> Lets Connect
            </button>
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-2"></div>
        <div className="col-sm-8">
          <div>
            <div className="text-center">
              <h2 className="mt-2" id="home">
                Designing Your Mind!
              </h2>
              <p className="descriptionPara">
                I like to think that my work is a living, breathing embodiment
                of my passion for discovery. Here is some of it{" "}
              </p>
            </div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className="col-sm-2"></div>
      </div>
    </div>
  );
}

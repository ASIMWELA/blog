import React, { useEffect, useRef } from "react";
import computerUser from "../../asserts/computer-user.png";
import { Link } from "react-router-dom";
import { BsCodeSlash } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import ApiUtil from "../../ApiUtil/ApiUtilityClass";
import { useRecoilState } from "recoil";
import { admin } from "../../recoilState";

import { textIntro, careerIntro } from "../../animations/Animate";

export default function Home() {
  const [pageAdmin, setAdmin] = useRecoilState(admin);
  let home = useRef(null);
  let career = useRef(null);

  useEffect(() => {
    textIntro(home);
    careerIntro(career);
    const fetchUsers = async () => {
      const users = await ApiUtil.getUsers().catch((err) => {
        console.log(err);
      });

      console.log(users);
    };

    const fetchAdmin = async () => {
      const admin = await ApiUtil.getAdmin().catch((err) => {
        console.log(err);
      });

      console.log(admin);
      setAdmin(admin);
    };

    fetchUsers();
    fetchAdmin();
  }, [setAdmin]);
  return (
    <div className="container-fluid home">
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
            <h5>Sometimes Less Is More</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              vitae elit ut dolor efficitur placerat id eu sapien. Mauris
              porttitor, mi ut posuere vestibulum, arcu libero euismod leo,
              vitae vehicula turpis lorem id turpis. Vivamus ullamcorper lacus
              metus, eu pellentesque augue pellentesque sed. Donec pellentesque
              vitae lacus aliquam ornare.
            </p>
            <Link to="/projects">
              <button className="btn btn-secondary">Get Started..</button>
            </Link>
          </div>
        </div>
        <div className="com-sm-2"></div>
        <div
          style={{ marginTop: "-5%" }}
          className="col-sm-5 text-center ml-5"
          ref={(el) => (career = el)}
        >
          <BsCodeSlash size={50} className="mt-5" />
          <h5>Career Span</h5>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae
            elit ut dolor efficitur placerat id eu sapien. Mauris porttitor, mi
            ut posuere vestibulum, arcu libero euismod leo, vitae vehicula
            turpis lorem id turpis. Vivamus ullamcorper lacus metus, eu
            pellentesque augue pellentesque sed. Donec pellentesque vitae lacus
            aliquam ornare.
          </p>
          <Link to="/contact">
            <button className="btn btn-secondary">
              <AiOutlineMail size={20} className="" /> Lets Connect
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

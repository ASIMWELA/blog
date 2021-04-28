import React, { useState, useEffect } from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "./admin.sidebar.scss";
import { Redirect, useHistory } from "react-router-dom";
import { FaEnvelope, FaGem, FaGraduationCap, FaUser } from "react-icons/fa";
import { BsBriefcaseFill } from "react-icons/bs";
import { BiCodeAlt } from "react-icons/bi";
import { IoMdLogOut } from "react-icons/io";
import { AiOutlineMenu, AiOutlineLeft, AiOutlineSetting } from "react-icons/ai";
import ApiUtil from "../../ApiUtil/ApiUtil";
import "./sidenav.css";
import { useRecoilState } from "recoil";
import { Modal } from "react-bootstrap";
import { loggedInAdmin } from "../../recoilState";
import {
  AdminProjects,
  AdminEmployment,
  AdminProfile,
  AdminEducation,
  AdminMessaging,
  AdminExperience,
} from "./";

export default function AdminSidebar() {
  const [toggleMenu, setToggle] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const [authAdmin, setAuthAdmin] = useRecoilState(loggedInAdmin);
  const [componentSlug, setComponentSlug] = useState("Projects");
  const [admin, setAdmin] = useState();

  useEffect(() => {
    const adminAuth = () => {
      return ApiUtil.authenticateAdmin();
    };

    if (adminAuth()) {
      const admn = JSON.parse(localStorage.getItem("data")).loggedInAdmin;
      setAdmin(admn);
      setAuthAdmin(admn);
    }
  }, [setAdmin, setAuthAdmin]);
  const toggleSideBar = () => {
    setToggle(!toggleMenu);
  };
  const changeComponent = (event) => {
    setComponentSlug(event.currentTarget.id);
  };

  const logout = () => {
    const chennelConnected = JSON.parse(localStorage.getItem("data"))
      .isAdminChannelConnected;
    if (!chennelConnected) {
      setAuthAdmin();
      history.push("/login");
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="d-flex" style={{ position: "relative" }} id="sidenav">
      {ApiUtil.authenticateAdmin() ? (
        <>
          <ProSidebar
            style={{
              zIndex: "1009",
            }}
            className="h-100"
            collapsed={toggleMenu}
            image="https://azouaoui-med.github.io/react-pro-sidebar/static/media/bg1.74aaeeb9.jpg"
          >
            <SidebarHeader>
              <Menu iconShape="square" onClick={toggleSideBar}>
                <MenuItem icon={<AiOutlineMenu size={40} />}>
                  Close
                  <AiOutlineLeft />
                </MenuItem>
              </Menu>
            </SidebarHeader>
            <SidebarContent>
              <Menu
                iconShape="square"
                onClick={(event) => changeComponent(event)}
                id="Projects"
              >
                <MenuItem icon={<FaGem size={20} />}>Projects</MenuItem>
              </Menu>
              <Menu
                iconShape="square"
                onClick={(event) => changeComponent(event)}
                id="Education"
              >
                <MenuItem icon={<FaGraduationCap size={20} />}>
                  Education
                </MenuItem>
              </Menu>
              <Menu
                iconShape="square"
                onClick={(event) => changeComponent(event)}
                id="Profile"
              >
                <MenuItem icon={<FaUser size={20} />}>Profile</MenuItem>
              </Menu>
              <Menu
                iconShape="square"
                onClick={(event) => changeComponent(event)}
                id="Experience"
              >
                <MenuItem icon={<BsBriefcaseFill size={20} />}>
                  Experience
                </MenuItem>
              </Menu>
              <Menu
                iconShape="square"
                onClick={(event) => changeComponent(event)}
                id="Employment"
              >
                <MenuItem icon={<AiOutlineSetting size={20} />}>
                  Skills
                </MenuItem>
              </Menu>
              <Menu
                iconShape="square"
                onClick={(event) => changeComponent(event)}
                id="Messaging"
              >
                <MenuItem icon={<FaEnvelope size={20} />}>Messaging</MenuItem>
              </Menu>
            </SidebarContent>
            <SidebarFooter>
              <Menu iconShape="square">
                <MenuItem icon={<BiCodeAlt size={50} />}>@ simwela</MenuItem>
              </Menu>
            </SidebarFooter>
          </ProSidebar>
          <main
            className="d-flex flex-column mt-0"
            style={{
              padding: "0px",
              flexGrow: 1,
              overflowY: "auto",
            }}
          >
            {" "}
            <ul
              className="nav justify-content-end bg-dark text-info"
              style={{
                width: "100%",
                height: "10%",
                borderBottom: "1px solid #203045",
              }}
            >
              <li className="nav-item">
                <h5 className="nav-link active"> Link </h5>
              </li>
              <li className="nav-item">
                <h5 className="nav-link"> Link</h5>
              </li>
              <li className="nav-item">
                <h5 className="nav-link"> Link</h5>
              </li>
              <li className="nav-item">
                <h6
                  className="nav-link"
                  onClick={logout}
                  style={{ cursor: "pointer" }}
                >
                  Logout
                  <IoMdLogOut />
                </h6>
              </li>
            </ul>
            <div className="m-0 p-0">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">Admin</li>
                  <li className="breadcrumb-item" aria-current="page">
                    {componentSlug}
                  </li>
                </ol>
              </nav>
            </div>
            <div
              style={{ width: "100%", overflowY: "scroll" }}
              className="m-0 p-0"
            >
              {componentSlug === "Projects" && (
                <AdminProjects authAdmin={admin} />
              )}
              {componentSlug === "Employment" && (
                <AdminEmployment authAdmin={admin} />
              )}
              {componentSlug === "Experience" && (
                <AdminExperience authAdmin={admin} />
              )}
              {componentSlug === "Profile" && (
                <AdminProfile authAdmin={admin} />
              )}
              {componentSlug === "Messaging" && (
                <AdminMessaging authAdmin={admin} />
              )}
              {componentSlug === "Education" && (
                <AdminEducation authAdmin={admin} />
              )}

              <Modal
                size="sm"
                show={showModal}
                backdrop="static"
                onHide={() => setShowModal(false)}
                animation={true}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Disconnect Channel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Disconnect Message Chanel <br /> Before Logout.
                </Modal.Body>
                <Modal.Footer>
                  <div className="text-center">
                    <button
                      style={{ borderRadius: "30px" }}
                      className="btn btn-dark px-5 py-2"
                      onClick={() => {
                        setShowModal(false);
                        setComponentSlug("Messaging");
                      }}
                    >
                      OK
                    </button>
                  </div>
                </Modal.Footer>
              </Modal>
            </div>
          </main>
        </>
      ) : (
        <Redirect to="login" />
      )}
    </div>
  );
}

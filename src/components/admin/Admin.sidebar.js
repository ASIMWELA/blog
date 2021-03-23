import React, { useState } from "react";
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
import { FaEnvelope, FaGem, FaGraduationCap, FaUser } from "react-icons/fa";
import { BsBriefcaseFill } from "react-icons/bs";
import { BiCodeAlt } from "react-icons/bi";
import { AiOutlineMenu, AiOutlineLeft, AiOutlineSetting } from "react-icons/ai";
import "./sidenav.css";
import {
  AdminProjects,
  AdminSkills,
  AdminProfile,
  AdminEducation,
  AdminMessaging,
  AdminExperience,
} from "./";

export default function AdminSidebar() {
  const [toggleMenu, setToggle] = useState(true);
  const [componentSlug, setComponentSlug] = useState("Projects");

  const toggleSideBar = () => {
    setToggle(!toggleMenu);
  };

  const changeComponent = (event) => {
    setComponentSlug(event.currentTarget.id);
  };

  return (
    <div className="d-flex" style={{ position: "relative" }}>
      <ProSidebar
        style={{
          height: "100% !important",
          zIndex: "1009",
        }}
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
            <MenuItem icon={<FaGraduationCap size={20} />}>Education</MenuItem>
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
            <MenuItem icon={<BsBriefcaseFill size={20} />}>Experience</MenuItem>
          </Menu>
          <Menu
            iconShape="square"
            onClick={(event) => changeComponent(event)}
            id="Skills"
          >
            <MenuItem icon={<AiOutlineSetting size={20} />}>Skills</MenuItem>
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
          className="nav justify-content-end "
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
            <h5 className="nav-link">Disabled</h5>
          </li>
        </ul>
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Admin</li>
              <li className="breadcrumb-item" aria-current="page">
                {componentSlug}
              </li>
            </ol>
          </nav>
        </div>
        <div style={{ width: "100%", overflowY: "scroll" }}>
          {componentSlug === "Projects" && <AdminProjects />}
          {componentSlug === "Skills" && <AdminSkills />}
          {componentSlug === "Experience" && <AdminExperience />}
          {componentSlug === "Profile" && <AdminProfile />}
          {componentSlug === "Messaging" && <AdminMessaging />}
          {componentSlug === "Education" && <AdminEducation />}
        </div>
      </main>
    </div>
  );
}

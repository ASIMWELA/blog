import Axios from "axios";
import { API_BASE_URL } from "../constants";
class ApiUtil {
  static getUsers = async () => {
    const users = await Axios({
      url: API_BASE_URL + "/users",
      method: "GET",
    }).then((res) => {
      return res.data;
    });
    return users;
  };

  static getAdmin = async () => {
    const users = await this.getUsers();

    let admin = null;

    if (users) {
      const adminData = users._embedded.userList.find((user) => {
        return "projects" in user._links;
      });

      admin = await Axios({
        url: API_BASE_URL + "/users/" + adminData.uid,
        method: "GET",
      });

      return admin.data;
    } else {
      return admin;
    }
  };
  static authenticateAdmin = () => {
    let adminRole = null;
    let arrayLength = 0;
    let admin = [];
    if (JSON.parse(localStorage.getItem("data")).loggedInAdmin) {
      admin = JSON.parse(localStorage.getItem("data")).loggedInAdmin.user.roles;
    }

    adminRole = admin.find((role) => {
      return role.name.includes("ROLE_ADMIN");
    });

    arrayLength = Boolean(admin.length >= 2);

    return Boolean(adminRole) && arrayLength ? true : false;
  };
  static getProjects = async () => {
    const projects = await Axios({
      url: API_BASE_URL + "/projects",
      method: "GET",
    }).then((res) => {
      return res.data;
    });

    if ("_embedded" in projects) {
      return projects._embedded.projectList;
    } else {
      return null;
    }
  };
}

export default ApiUtil;

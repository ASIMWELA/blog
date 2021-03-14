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

  static getProjects = async () => {
    try {
      const projects = await Axios({
        url: API_BASE_URL + "/projects",
        method: "GET",
      }).then((res) => {
        return res.data;
      });

      if ("_embedded" in projects) {
        return projects;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
    }
  };
}

export default ApiUtil;

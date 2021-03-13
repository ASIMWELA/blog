import Axios from "axios";
import { API_BASE_URL } from "../constants";
class ApiUtil {
  static getUsers = async () => {
    try {
      const users = await Axios({
        url: API_BASE_URL + "/users",
        method: "GET",
      }).then((res) => {
        return res.data;
      });
      return users;
    } catch (err) {
      console.log(err);
    }
  };

  static getAdmin = async () => {
    try {
      const users = await this.getUsers().catch((err) => {
        console.log(err);
      });

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
    } catch (err) {
      console.log(err);
    }
  };
}

export default ApiUtil;

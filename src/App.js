import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";

//import components
import {
  Home,
  NavBar,
  Profile,
  Projects,
  Contact,
  Login,
  PageLoader,
} from "./components/commons";
import ApiUtil from "./ApiUtil/ApiUtilityClass";

import { admin } from "./recoilState";
import { useRecoilState } from "recoil";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [pageAdmin, setAdmin] = useRecoilState(admin);

  const [error, setErrorMessage] = useState();
  //no data yet, deafult to loading
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      const admin = await ApiUtil.getAdmin()
        .then((res) => {
          setLoading(false);
          return res;
        })
        .catch((err) => {
          console.log(err.message);
          setErrorMessage(err.message);
        });

      //make available all the admin data to all component
      setAdmin(admin);
    };

    fetchAdmin();

    //clean the storage if the user leaves the the site
    window.addEventListener("beforeunload", () => {
      if (localStorage.data) {
        localStorage.removeItem("data");
      }
    });
  }, [setAdmin]);
  const RoutesWithNavBar = () => {
    return (
      <div>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/profile" component={Profile} />
          <Route path="/projects" component={Projects} />
          <Route path="/contact" component={Contact} />
        </Switch>
      </div>
    );
  };
  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <Switch>
          <Route path="/login" component={Login} />
          <Route component={RoutesWithNavBar} />
        </Switch>
      )}
    </>
  );
}

export default App;

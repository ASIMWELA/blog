import React, { useEffect, useState } from "react";
import { projects } from "../../recoilState";
import { useRecoilState } from "recoil";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { Modal } from "react-bootstrap";
import { API_BASE_URL } from "../../constants";
import ApiUtil from "../../ApiUtil/ApiUtil";
import Axios from "axios";
import "./admin.project.css";
export default function AdminProjects({ authAdmin }) {
  const [projectList, setProjects] = useRecoilState(projects);
  const [selectedProject, setSelected] = useState();
  const [show, setModalShow] = useState(false);

  useEffect(() => {
    // setProjects(pro);
    if (localStorage.data) {
      const projects = JSON.parse(localStorage.getItem("data")).projects;
      if (projects != null) {
        setProjects(projects);
      } else {
        setProjects([]);
      }
    }
  }, [setProjects]);

  const tableColumns = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
    },
    {
      dataField: "description",
      text: "Description",
      headerStyle: (colum, colIndex) => {
        return { width: "47%" };
      },
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Project Description is required",
          });
        }
        return true;
      },
    },
    {
      dataField: "role",
      text: "Role",
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Your role is required",
          });
        }
        return true;
      },
    },
    {
      dataField: "locationLink",
      text: "Link",
      validator: (newValue, row, column, done) => {
        if (newValue === "") {
          return done({
            valid: false,
            message: "Project link required",
          });
        }

        return true;
      },
    },
    {
      dataField: "collaborators",
      text: "Collaborators",
    },
  ];
  const refreshProjectData = async () => {
    const projects = await ApiUtil.getProjects()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });

    if (projects != null) {
      setProjects(projects);
    } else {
      setProjects([]);
    }
  };
  const onTableChange = (
    type,
    { data, cellEdit: { rowId, dataField, newValue } }
  ) => {
    let result = data.find((data) => data.name === rowId);

    let changedRow = { ...result };

    let processedRow;

    changedRow[dataField] = newValue;
    if (!changedRow.collaborators) {
      processedRow = { ...changedRow };
    } else {
      let collabs = null;
      if (changedRow.collaborators.indexOf(",") < 0) {
        if (changedRow.collaborators === "") {
          collabs = null;
        } else {
          collabs = new Array(changedRow.collaborators);
        }
      } else {
        collabs = changedRow.collaborators.split(",");
      }
      processedRow = { ...changedRow, collaborators: collabs };
    }
    delete processedRow._links;
    let collabds;
    if (processedRow.collaborators) {
      collabds = [].concat.apply([], processedRow.collaborators);
      processedRow.collaborators = collabds;
    }
    Axios({
      method: "put",
      url: API_BASE_URL + `/projects/${processedRow.name}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authAdmin.access_TOKEN}`,
      },
      data: JSON.stringify(processedRow),
    })
      .then((res) => {
        if (res.data.code === 200) {
          refreshProjectData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];
  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    clickToEdit: true,
    onSelect: (row, isSelect, rowIndex, e) => {
      setSelected(row.name);
    },
  };

  const deleteProject = () => {
    Axios.delete(API_BASE_URL + "/projects/" + selectedProject, {
      headers: {
        Authorization: `Bearer ${authAdmin.access_TOKEN}`,
      },
    })
      .then((res) => {
        if (res.data.code === 200) {
          refreshProjectData();
          setModalShow(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setModalShow(false);
      });
  };

  const noData = () => {
    return <div>No Data</div>;
  };
  return (
    <div className="container-fluid">
      <Modal
        show={show}
        onHide={() => setModalShow(false)}
        animation={true}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete {selectedProject}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are You Sure?</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setModalShow(false)}
          >
            Return
          </button>
          <button className=" btn btn-danger" onClick={deleteProject}>
            Yes
          </button>
        </Modal.Footer>
      </Modal>
      <BootstrapTable
        bootstrap4
        remote={{ cellEdit: true }}
        noDataIndication={noData}
        keyField="name"
        defaultSorted={defaultSorted}
        data={projectList}
        columns={tableColumns}
        selectRow={selectRow}
        onTableChange={onTableChange}
        cellEdit={cellEditFactory({
          mode: "dbclick",
          blurToSave: true,
        })}
        classes="table-responsive"
      />
    </div>
  );
}

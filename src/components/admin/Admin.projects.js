import React, { useEffect } from "react";
import { projects } from "../../recoilState";
import { useRecoilState } from "recoil";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
export default function AdminProjects() {
  const [projectList, setProjects] = useRecoilState(projects);

  useEffect(() => {
    if (localStorage.data) {
      const projects = JSON.parse(localStorage.getItem("data")).projects;
      setProjects(projects);
    }
  }, [setProjects]);

  const tableColumns = [
    {
      dataField: "name",
      text: "Name",
    },
    {
      dataField: "description",
      text: "Description",
      editor: {
        type: Type.TEXTAREA,
      },
    },
    {
      dataField: "role",
      text: "Role",
    },
    {
      dataField: "locationLink",
      text: "Link",
    },
  ];
  // const beforeSaveCell = (oldValue, newValue, row, column) => {
  //   console.log(oldValue, newValue, row, column);

  //   let propertyToChange = column.dataField;
  //   const project = {
  //     ...row,
  //   };
  //   project[propertyToChange] = newValue;
  // };
  const onTableChange = (
    type,
    { data, cellEdit: { rowId, dataField, newValue } }
  ) => {
    // setTimeout(() => {
    //   if (newValue === 'test' && dataField === 'name') {
    //     this.setState(() => ({
    //       data,
    //       errorMessage: 'Oops, product name shouldn't be "test"'
    //     }));
    //   } else {
    //     const result = data.map((row) => {
    //       if (row.id === rowId) {
    //         const newRow = { ...row };
    //         newRow[dataField] = newValue;
    //         return newRow;
    //       }
    //       return row;
    //     });
    //     this.setState(() => ({
    //       data: result,
    //       errorMessage: null
    //     }));
    //   }
    // }, 2000);
  };
  console.log(projectList);
  return (
    <BootstrapTable
      remote={{ cellEdit: true }}
      keyField="name"
      data={projectList}
      columns={tableColumns}
      onTableChange={onTableChange}
      cellEdit={cellEditFactory({
        mode: "click",
        errorMessage: "Error",
      })}
    />
  );
}

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Tooltip, OverlayTrigger } from "react-bootstrap";
import { AiOutlineSetting } from "react-icons/ai";
import { HiUserCircle } from "react-icons/hi";
import ApiUtil from "../../ApiUtil/ApiUtil";
import { useRecoilState } from "recoil";
import { chatActiveContact } from "../../recoilState";
import { BsFillCircleFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import "./messaging.css";

export default function AdminMessaging({ authAdmin }) {
  const [contacts, setContacts] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);

  useEffect(() => {
    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyContactColors = () => {
    const colors = [
      "text-primary",
      "text-secondary",
      "text-success",
      "text-warning",
      "text-danger",
      "text-dark",
    ];
    const randomColor = Math.floor(Math.random() * colors.length);

    return colors[randomColor];
  };
  const loadContacts = async () => {
    const promise = ApiUtil.getUsers().then((users) => {
      return users._embedded.userList.map((contact) =>
        ApiUtil.countNewMessages(
          contact.uid,
          authAdmin.user.uid,
          authAdmin.access_TOKEN
        ).then((count) => {
          contact.newMessages = count;
          return contact;
        })
      );
    });
    await promise.then((promises) =>
      Promise.all(promises).then((users) => {
        const subscribers = users.filter((user) => {
          return !("projects" in user._links);
        });
        const usersOnline = subscribers.filter((user) => user.online);
        setOnlineUsers(usersOnline);
        setContacts(subscribers);
        if (activeContact === undefined && subscribers.length > 0) {
          setActiveContact(subscribers[0]);
        }
      })
    );
  };

  console.log(onlineUsers);

  return (
    <Container fluid id="messaging" className="mb-0">
      <Row className="mt-0">
        <Col sm={2} md={3} className="bg-light mt-0">
          <div className="d-flex flex-column">
            <div className="mt-1">
              <AiOutlineSetting size={20} style={{ float: "right" }} />
            </div>
            <div className="mt-1 text-center">
              <HiUserCircle size={60} />
            </div>
            <div className="text-center">
              <strong>
                <span className="mr-2">{authAdmin.user.firstName}</span>
                {authAdmin.user.lastName}
              </strong>
            </div>
            <div className="text-center">My account</div>
          </div>
          <hr className="mt-0 p-0" />
          <div>
            <strong>Online now </strong>
            <span
              className="badge badge-pill badge-dark"
              style={{ float: "right" }}
            >
              {onlineUsers.length}
            </span>
          </div>
          <div
            className="d-flex flex-row"
            id="onlineUsers"
            style={{ overflowX: "auto" }}
          >
            {onlineUsers.length > 0 ? (
              <span>
                {onlineUsers.map((user) => {
                  return (
                    <OverlayTrigger
                      placement={"top"}
                      overlay={
                        <Tooltip id="tooltip-disabled">
                          Contact {user.userName}
                        </Tooltip>
                      }
                      key={user.userName}
                    >
                      <span className="d-inline-block ">
                        <h5 className="rounded-circle border border-teal pt-2 pl-3 pr-1 mx-1 my-2 bg-teal">
                          <strong className={applyContactColors()}>
                            {user.userName.charAt(0).toUpperCase()}
                          </strong>
                          <BsFillCircleFill
                            color={"green"}
                            size={10}
                            className="mt-4"
                          />
                        </h5>
                      </span>
                    </OverlayTrigger>
                  );
                })}
              </span>
            ) : (
              <div>No Active Users</div>
            )}
          </div>
          <hr className="mt-0 p-0" />
          <div className="d-flex flex-column m-0 p-0">
            <h5 className="m-0 p-0">
              <strong className="m-0 p-0">Chats</strong>
            </h5>
            <div className="form-group has-search">
              <FaSearch className="form-control-feedback mt-2 ml-3" />
              <input
                type="text"
                id="searchCharts"
                className="form-control mx-1"
                placeholder="Search Charts"
                style={{ backgroundColor: "#F3F2EF" }}
              />
            </div>
            <div style={{ height: "120px", overflowY: "auto" }}>
              {contacts.map((contact) => {
                return (
                  <div className="d-flex flex-row" key={contact.userName}>
                    <h5 className="rounded-circle border border-teal py-2 px-3 mx-1 my-1 bg-teal">
                      <strong className={applyContactColors()}>
                        {contact.userName.charAt(0).toUpperCase()}
                      </strong>
                    </h5>
                    <div className="mt-2">{contact.userName}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Col>
        <Col sm={6} md={6}>
          1 of 1
        </Col>
        <Col sm={3} md={2}>
          1 of 1
        </Col>
      </Row>
    </Container>
  );
}

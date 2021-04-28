import React, { useState, useEffect } from "react";
import { Container, Row, Col, Tooltip, OverlayTrigger } from "react-bootstrap";
import { AiOutlineSetting } from "react-icons/ai";
import { HiUserCircle } from "react-icons/hi";
import ApiUtil from "../../ApiUtil/ApiUtil";
import { useRecoilState } from "recoil";
import { chatActiveContact } from "../../recoilState";
import { BsFillCircleFill } from "react-icons/bs";
import { FaSearch, FaPaperPlane } from "react-icons/fa";
import { isAdminChannelConnected } from "../../recoilState";
import { API_BASE_MESSAGING_URL } from "../../constants";
import ScrollToBottom from "react-scroll-to-bottom";
import "./messaging.css";
import { css } from "@emotion/css";

let stompClient = null;
export default function AdminMessaging({ authAdmin }) {
  const [contacts, setContacts] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [privateMessages, setPrivateChatMessages] = useState([]);
  const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);
  const [isChanelConnected, setChannelConnected] = useRecoilState(
    isAdminChannelConnected
  );
  let initialState = {
    onlineUsers: null,
    channelConnected: false,
    error: "",
    privateChatMessage: "",
    bulkMessages: null,
    openNotifications: false,
  };

  let [state, setState] = useState(initialState);

  useEffect(() => {
    connectToServer();
    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (activeContact === undefined) return;
    ApiUtil.findChatMessages(
      activeContact.uid,
      authAdmin.user.uid,
      authAdmin.access_TOKEN
    ).then((msg) => setPrivateChatMessages(msg));
    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContact]);
  const applyContactColors = () => {
    const colors = [
      "text-primary",
      "text-secondary",
      "text-success",
      "text-warning",
      "text-danger",
    ];
    const randomColor = Math.floor(Math.random() * colors.length);

    return colors[randomColor];
  };

  const connectToServer = () => {
    if (authAdmin) {
      var Stomp = require("stompjs");
      var SockJS = require("sockjs-client");
      SockJS = new SockJS(API_BASE_MESSAGING_URL + "/ws");
      stompClient = Stomp.over(SockJS);
      //disable debug messages
      // stompClient.debug = null;
      stompClient.connect({}, onConnected, onError);
    }
  };

  const onConnected = () => {
    setState({
      ...state,
      channelConnected: true,
    });
    // Subscribing to the private topic

    stompClient.subscribe(
      "/user/" + authAdmin.user.uid + "/queue/messages",
      onPrivateMessageReceived,
      { id: "privateChat" }
    );

    stompClient.send(
      "/app/toggleAdmin",
      {},
      JSON.stringify({ sender: authAdmin.user.userName, type: "JOIN" })
    );

    setChannelConnected(true);
  };

  const onError = (error) => {
    setState({
      ...state,
      error:
        "Could not connect you to the Chat Room Server. Please refresh this page and try again!",
    });
  };
  const onPrivateMessageReceived = (payload) => {
    const notification = JSON.parse(payload.body);

    const active = JSON.parse(localStorage.getItem("data")).chatActiveContact;

    if (!active.uid) return;
    if (active.uid === notification.senderId) {
      ApiUtil.findChatMessages(
        active.uid,
        authAdmin.user.uid,
        authAdmin.access_TOKEN
      ).then((msg) => {
        const newMessages = [...privateMessages];
        msg.forEach((m) => newMessages.push(m));
        setPrivateChatMessages(newMessages);
      });
    } else {
      //TODO:notify new message
    }
    loadContacts();
  };
  const disconnect = () => {
    var message = {
      sender: authAdmin.user.userName,
      type: "LEAVE",
    };
    stompClient.send("/app/toggleAdmin", {}, JSON.stringify(message));
    stompClient.unsubscribe("privateChat", {});
    stompClient.disconnect(() => {
      console.log("Disconnected");
    }, {});

    setChannelConnected(false);
  };
  const sendPrivateMessage = () => {
    const message = {
      senderId: authAdmin.user.uid,
      recipientId: activeContact.uid,
      sender: authAdmin.user.userName,
      receiver: activeContact.userName,
      content: state.privateChatMessage,
    };

    stompClient.send("/app/privateChat", {}, JSON.stringify(message));

    const newMessages = [...privateMessages];
    newMessages.push(message);
    setPrivateChatMessages(newMessages);
  };

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  const handleTyping = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const searchCharts = (event) => {
    let allContacts = [...contacts];
    let name = event.target.value.toLowerCase();
    const results = allContacts.filter((contact) => {
      return contact.userName.toLowerCase().includes(name);
    });
    console.log(results);

    // setTimeout(() => {
    //   //setContacts(results);
    // }, 0);
    // if (event.target.value === "") {
    //   setContacts(allContacts);
    // } else {
    //setContacts([...results]);
    // }
    // console.log(event.target.value);
  };
  const ROOT_CSS = css({
    height: 310,
    width: 500,
  });
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
        if (!("userName" in activeContact) && subscribers.length > 0) {
          setActiveContact(subscribers[0]);
        }
      })
    );
  };

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
            <div className="text-center mt-3">My account</div>
          </div>
          <hr className="mt-3 p-0" />
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
            className="d-flex flex-row mt-3"
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
                      <span
                        className="d-inline-block "
                        onClick={() => setActiveContact(user)}
                        style={{ cursor: "pointer" }}
                      >
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
              <small>No Active Users</small>
            )}
          </div>
          <hr className="mt-0 p-0" />
        </Col>
        <Col sm={4} md={5}>
          <div className="d-flex">
            <div>
              <h5>Chat with</h5>
              <h4>
                <strong>{activeContact.userName}</strong>
              </h4>
            </div>
            <button
              style={{
                marginTop: "1%",
                marginBottom: "2%",
                marginLeft: "20%",
                borderRadius: "30px",
              }}
              onClick={isChanelConnected ? disconnect : connectToServer}
              className="pl-4 pr-4"
              id={isChanelConnected ? "connected" : "disconnected"}
            >
              {isChanelConnected ? "Disconnect" : "Connect"}
            </button>
          </div>

          <div className="justify-content-center messages">
            <ScrollToBottom debug={false} className={ROOT_CSS}>
              <ul>
                {privateMessages.map((msg, index) => (
                  <li
                    key={index}
                    className={
                      msg.senderId === authAdmin.user.uid ? "sent" : "replies"
                    }
                  >
                    <p>
                      {msg.content}
                      <br />
                      <small style={{ float: "right" }}>
                        {msg.createdAt
                          ? formatAMPM(new Date(msg.createdAt))
                          : formatAMPM(new Date())}
                      </small>
                    </p>
                  </li>
                ))}
              </ul>
            </ScrollToBottom>
          </div>

          <div className="wrap">
            <input
              name="privateChatMessage"
              id="privateChatMessage"
              size="large"
              className="form-control"
              placeholder="Write your message..."
              value={state.privateChatMessage}
              disabled={isChanelConnected ? false : true}
              onChange={handleTyping}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  sendPrivateMessage();
                  setState({ ...state, privateChatMessage: "" });
                }
              }}
            />
            <button
              style={{ border: "none", backgroundColor: "inherit" }}
              onClick={() => {
                sendPrivateMessage();
                setState({ ...state, privateChatMessage: "" });
              }}
              disabled={isChanelConnected ? false : true}
            >
              <FaPaperPlane
                size={25}
                color={"#203045"}
                style={{ marginLeft: "-3%", marginTop: "60%" }}
              />
            </button>
          </div>
        </Col>
        <Col sm={3} md={3} className="ml-5">
          <div className="d-flex flex-column m-0 p-0">
            <h5 className="m-0 p-0">
              <strong className="m-0 p-0">Chats</strong>
            </h5>
            <div className="form-group has-search">
              <FaSearch className="form-control-feedback mt-3 ml-3" />
              <input
                type="text"
                id="searchCharts"
                className="form-control mx-1 mt-2"
                placeholder="Search Charts"
                style={{ backgroundColor: "#F3F2EF" }}
                onChange={(event) => searchCharts(event)}
              />
            </div>
          </div>
          <div style={{ height: "50%", overflowY: "auto" }}>
            {contacts.map((contact) => {
              return (
                <div
                  key={contact.userName}
                  onClick={() => setActiveContact(contact)}
                  style={{
                    cursor: "pointer",
                    borderBottom: ".5px solid black",
                  }}
                  className={
                    activeContact && contact.uid === activeContact.uid
                      ? "d-flex flex-row bg-dark text-light active-contact"
                      : "d-flex flex-row"
                  }
                >
                  <h5 className="rounded-circle border border-teal py-2 px-3 mx-1 my-1 bg-teal">
                    <strong className={applyContactColors()}>
                      {contact.userName.charAt(0).toUpperCase()}
                    </strong>
                  </h5>
                  <div className="mt-1">{contact.userName}</div>
                  {contact.newMessages !== undefined &&
                    contact.newMessages > 0 && (
                      <small className="mt-4 mr-2 preview">
                        {contact.newMessages > 1 ? (
                          <span
                            className="badge badge-pill badge-dark "
                            style={{ marginLeft: "-190%" }}
                          >
                            {contact.newMessages} new
                          </span>
                        ) : (
                          <span
                            className="badge badge-pill badge-dark"
                            style={{ marginLeft: "-190%" }}
                          >
                            {contact.newMessages} new
                          </span>
                        )}
                      </small>
                    )}
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

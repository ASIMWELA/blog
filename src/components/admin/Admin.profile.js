import React from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { HiUserCircle } from "react-icons/hi";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function AdminProfile() {
  return (
    <Container fluid>
      <Row>
        <Col sm={3} md={4}></Col>
        <Col sm={3} md={4} className="mt-4 ">
          <div className="text-center">
            {" "}
            <HiUserCircle size={70} style={{ marginBottom: "-8%" }} />
          </div>
          <Card body style={{ zIndex: "-1" }}>
            <ListGroup variant="flush" className="mt-4">
              <ListGroup.Item>
                <FaUser className="mt-1" />
                <div style={{ marginTop: "-20%" }}>
                  <small className="ml-2 p-0 text-right">
                    <div>first name</div>
                  </small>
                  <div>
                    <strong className="ml-5">Asimwela</strong>
                  </div>
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <FaUser className="mt-1" />
                <div style={{ marginTop: "-20%" }}>
                  <small className="ml-2 p-0 text-right">
                    <div>last name</div>
                  </small>
                  <div>
                    <strong className="ml-5">Asimwela</strong>
                  </div>
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <FaUser className="mt-1" />
                <div style={{ marginTop: "-20%" }}>
                  <small className="ml-2 p-0 text-right">
                    <div>user name</div>
                  </small>
                  <div>
                    <strong className="ml-5">Asimwela</strong>
                  </div>
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <FaEnvelope className="mt-1" />
                <div style={{ marginTop: "-20%" }}>
                  <small className="ml-2 p-0 text-right">
                    <div>Email</div>
                  </small>
                  <div>
                    <strong className="ml-5">Asimwela</strong>
                  </div>
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <FaLock className="mt-1" />
                <div style={{ marginTop: "-20%" }}>
                  <small className="ml-2 p-0 text-right">
                    <div>Click to change password</div>
                  </small>
                  <div>
                    <strong className="ml-5">***********</strong>
                  </div>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col sm={3} md={4}></Col>
      </Row>
    </Container>
  );
}

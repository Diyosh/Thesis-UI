import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import { BsPlus, BsTrash, BsPencil } from 'react-icons/bs';
import CustomNavbar from './Navbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Team = ({ handleLogout }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [show, setShow] = useState(false);
  const [TeamCode, setTeamCode] = useState('');
  const [TeamName, setTeamName] = useState('');
  const [EventID, setEventID] = useState('');
  const [events, setEvents] = useState([]);
  const token = JSON.parse(localStorage.getItem('token')).data.token;

  const headers = {
    'accept': 'application/json',
    'Authorization': token
  };

  const handleClose = () => {
    setShow(false);
    resetTeamDetails();
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchTeams();
    fetchEvents();
  }, []);

  const resetTeamDetails = () => {
    setTeamCode('');
    setTeamName('');
    setEventID('');
    setSelectedTeam(null);
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get('https://ncf-intramurals-system.onrender.com/api/teams', { headers });
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://ncf-intramurals-system.onrender.com/api/events', { headers });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();
    if (!TeamCode || !TeamName || !EventID) {
      Swal.fire({
        text: 'Please fill in all the fields.',
        icon: 'warning',
      });
      return;
    }
    try {
      console.log("Creating team with data:", { TeamCode, TeamName, EventID });
      const response = await axios.post('https://ncf-intramurals-system.onrender.com/api//team_reg', { TeamCode, TeamName, EventID }, { headers });
      Swal.fire({
        icon: 'success',
        text: response.data.message,
      });
      fetchTeams();
    } catch (error) {
      console.error('Error creating team:', error);
      Swal.fire({
        text: error.response.data.message,
        icon: 'error',
      });
    }
  };

  const updateTeam = async (e) => {
    e.preventDefault();
    try {
      if (!selectedTeam) {
        console.error('No team selected for update');
        return;
      }
      const response = await axios.put(`https://ncf-intramurals-system.onrender.com/api/team/${selectedTeam.TeamID}`, { TeamCode, TeamName, EventID }, { headers });
      Swal.fire({
        icon: 'success',
        text: 'Team updated successfully!',
      });
      handleClose();
      fetchTeams();
      resetTeamDetails();
    } catch (error) {
      console.error('Error updating team:', error);
    }
    console.log("Team update request sent");
  };

  const deleteTeam = async (TeamID) => {
    const isConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      return result.isConfirmed;
    });

    if (isConfirm) {
      try {
        await axios.delete(`https://ncf-intramurals-system.onrender.com/api/team/${TeamID}`, { headers });
        Swal.fire({
          icon: 'success',
          text: 'Team deleted successfully!',
        });
        fetchTeams();
      } catch (error) {
        Swal.fire({
          text: error.response.data.message,
          icon: 'error',
        });
      }
    }
  };

  const handleUpdate = (team) => {
    setSelectedTeam(team);
    setTeamCode(team.TeamCode);
    setTeamName(team.TeamName);
    setEventID(team.EventID);
    handleShow();
  };

  return (
    <>
      <CustomNavbar handleLogout={handleLogout} />
      <div className="container">
        <br />
        <div className='col-12'>
          <Button variant="success" className="mb-2 float-end btn-sm me-2" onClick={handleShow}>
            <BsPlus size="1.5em" />
          </Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Team ID</th>
              <th>Team Code</th>
              <th>Team Name</th>
              <th>Event Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {teams.length > 0 && teams.map((team, key) => (
              <tr key={key}>
                <td>{team.TeamID}</td>
                <td>{team.TeamCode}</td>
                <td>{team.TeamName}</td>
                <td>{events.find(event => event.EventID === team.EventID)?.EventName}</td>
                <td>
                  <Button variant="primary" className="me-2" onClick={() => handleUpdate(team)}>
                    <BsPencil />
                  </Button>
                  <Button variant="danger" onClick={() => deleteTeam(team.TeamID)}>
                    <BsTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedTeam ? 'Update Team' : 'Create Team'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={selectedTeam ? updateTeam : createTeam}>
              <Row>
                <Col>
                  <Form.Group controlId="TeamCode">
                    <Form.Label>Team Code</Form.Label>
                    <Form.Control type="text" value={TeamCode} onChange={(event) => { setTeamCode(event.target.value) }} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="TeamName">
                    <Form.Label>Team Name</Form.Label>
                    <Form.Control type="text" value={TeamName} onChange={(event) => { setTeamName(event.target.value) }} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="EventID">
                    <Form.Label>Event</Form.Label>
                    <Form.Control as="select" value={EventID} onChange={(event) => { setEventID(event.target.value) }}>
                      <option value="">Select Event</option>
                      {events.map((event) => (
                        <option key={event.EventID} value={event.EventID}>
                          {event.EventName}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit" className="mt-2" block="block">
                {selectedTeam ? 'Update' : 'Save'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default Team;

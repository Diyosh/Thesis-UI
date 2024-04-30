import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import { BsTrash, BsPlus } from 'react-icons/bs';
import CustomNavbar from './Navbar';

const Matchups = ({ handleLogout }) => {
  const [matchups, setMatchups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventID, setEventID] = useState('');
  const [numGames, setNumGames] = useState('');
  const [teams, setTeams] = useState([]); // State to hold teams data
  const token = JSON.parse(localStorage.getItem('token')).data.token;

  const headers = {
    'accept': 'application/json',
    'Authorization': token
  };

  useEffect(() => {
    fetchMatchups();
    fetchTeams(); // Fetch teams data
  }, []);

  const fetchMatchups = async () => {
    try {
      const response = await axios.get('https://ncf-intramurals-system.onrender.com/api/matchups', { headers });
      setMatchups(response.data);
    } catch (error) {
      console.error('Error fetching matchups:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get('https://ncf-intramurals-system.onrender.com/api/teams', { headers });
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const deleteMatchup = async (matchupId) => {
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
        await axios.delete('https:ncf-intramurals-system.onrender.com/api/matchups/${matchupId}', { headers });
        Swal.fire({
          icon: 'success',
          text: 'Matchup deleted successfully!',
        });
        fetchMatchups();
      } catch (error) {
        Swal.fire({
          text: error.response.data.message,
          icon: 'error',
        });
      }
    }
  };

  const createMatchups = async () => {
    if (!eventID || !numGames) {
      Swal.fire({
        text: 'Please fill in all the fields.',
        icon: 'warning',
      });
      return;
    }
    try {
      const response = await axios.post('https://ncf-intramurals-system.onrender.com/api/generate_matchups', { EventID: eventID, NumGames: numGames }, { headers });
      Swal.fire({
        icon: 'success',
        text: response.data.message,
      });
      fetchMatchups();
      setShowModal(false); // Close the modal after successful creation
    } catch (error) {
      console.error('Error creating matchups:', error);
      Swal.fire({
        text: error.response.data.message,
        icon: 'error',
      });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Clear input fields when modal is closed
    setEventID('');
    setNumGames('');
  };

  // Function to get team name by team ID
  const getTeamCode = (teamId) => {
    const team = teams.find(team => team.TeamID === teamId);
    return team ? team.TeamCode : '';
  };

  return (
    <>
      <CustomNavbar handleLogout={handleLogout} />
      <div className="container">
        <br />
        <div className="mb-3 d-flex justify-content-end">
          <Button variant="success" onClick={() => setShowModal(true)} className="me-2">
            <BsPlus />
          </Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Matchup ID</th>
              <th>Event </th>
              <th>Team 1 </th>
              <th>Team 2 </th>
              <th>NumGames</th>
              <th>Winner Team</th> {/* Changed from "Winner Team ID" */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {matchups.length > 0 && matchups.map((matchup, key) => (
              <tr key={key}>
                <td>{matchup.MatchupID}</td>
                <td>{matchup.EventName}</td>
                <td>{matchup.Team1Code}</td>
                <td>{matchup.Team2Code}</td>
                <td>{matchup.NumGames}</td>
                <td>{getTeamCode(matchup.WinnerTeamID)}</td> {/* Display winner team name */}
                <td>
                  <Button variant="danger" onClick={() => deleteMatchup(matchup.MatchupID)}>
                    <BsTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Matchups</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="eventID" className="form-label">Event ID:</label>
              <input type="text" className="form-control" id="eventID" value={eventID} onChange={(e) => setEventID(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="numGames" className="form-label">Number of Games:</label>
              <input type="text" className="form-control" id="numGames" value={numGames} onChange={(e) => setNumGames(e.target.value)} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={createMatchups}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Matchups;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import { BsTrash, BsPlus } from 'react-icons/bs';
import CustomNavbar from './Navbar';

const Games = ({ handleLogout }) => {
    const [games, setGames] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [eventID, setEventID] = useState('');
    const [numGames, setNumGames] = useState('');
    const token = JSON.parse(localStorage.getItem('token')).data.token;

    const headers = {
        'accept': 'application/json',
        'Authorization': token
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await axios.get('https://ncf-intramurals-system.onrender.com/api/games', { headers });
            setGames(response.data);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };

    const deleteGame = async (gameId) => {
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
                await axios.delete(`https://ncf-intramurals-system.onrender.com/api/games/${gameId}`, { headers });
                Swal.fire({
                    icon: 'success',
                    text: 'Game deleted successfully!',
                });
                fetchGames();
            } catch (error) {
                Swal.fire({
                    text: error.response.data.message,
                    icon: 'error',
                });
            }
        }
    };

    const createGame = async () => {
        if (!eventID || !numGames) {
            Swal.fire({
                text: 'Please fill in all the fields.',
                icon: 'warning',
            });
            return;
        }
        try {
            const response = await axios.post('https://ncf-intramurals-system.onrender.com/api/create_game', { MatchuuID: eventID, NumGames: numGames }, { headers });
            Swal.fire({
                icon: 'success',
                text: response.data.message,
            });
            fetchGames();
            setShowModal(false); // Close the modal after successful creation
        } catch (error) {
            console.error('Error creating game:', error);
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
                            <th>Game ID</th>
                            <th>Event </th>
                            <th>Team 1 </th>
                            <th>Team 2 </th>
                            <th>NumGames</th>
                            <th>Winner Team ID</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.length > 0 && games.map((game, key) => (
                            <tr key={key}>
                                <td>{game.GameID}</td>
                                <td>{game.EventName}</td>
                                <td>{game.Team1Code}</td>
                                <td>{game.Team2Code}</td>
                                <td>{game.NumGames}</td>
                                <td>{game.WinnerTeamID}</td>
                                <td>
                                    <Button variant="danger" onClick={() => deleteGame(game.GameID)}>
                                        <BsTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Modal show={showModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Game</Modal.Title>
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
                        <Button variant="primary" onClick={createGame}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default Games;

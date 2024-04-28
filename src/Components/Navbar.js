import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = ({ user }) => {
  const navigate = useNavigate();

  /* Logout Method */
  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      navigate("/login");
    } catch (error) {
      console.error('Logout failed', error);
      // Provide appropriate feedback to the user
    }
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">SEEMS</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/User" className="text-decoration-none text-white">
            Users
          </Nav.Link>
          <Nav.Link as={Link} to="/Event" className="text-decoration-none text-white">
            Events
          </Nav.Link>
          <Nav.Link as={Link} to="/Team" className="text-decoration-none text-white">
            Teams
            </Nav.Link>
          <Nav.Link as={Link} to="/Matchup" className="text-decoration-none text-white">
            Matches
            </Nav.Link>
          <Nav.Link className="text-decoration-none text-white">Games</Nav.Link>
          <Nav.Link className="text-decoration-none text-white">Event Leaderboard</Nav.Link>
          <Nav.Link className="text-decoration-none text-white">Ranking</Nav.Link>
        </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Welcome: {user ? user.id : 'id'} {user ? user.name : 'name'}
            <Button variant="secondary" onClick={handleLogout}>Logout</Button>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;

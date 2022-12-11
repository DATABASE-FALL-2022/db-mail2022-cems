import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import * as Icon from 'react-bootstrap-icons';
import SearchEmail from './Search';

export default function NavigationBar(props) {
	const email = JSON.parse(localStorage.getItem('user')).email_address;

	return (
		<Navbar bg='light' expand='lg'>
			<Container>
				<Navbar.Brand href='#home' className='fw-bold'>
					CEMS Mail
				</Navbar.Brand>
				{/* <SearchEmail /> */}
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse id='basic-navbar-nav'>
					<Nav className='ms-auto'>
						<div className='d-flex align-items-center ms-auto '>
							<Icon.PersonCircle />
							<NavDropdown title={email} id='basic-nav-dropdown'>
								<NavDropdown.Item href='#action/3.1'>Profile</NavDropdown.Item>
								<NavDropdown.Item href='#action/3.2'>Friends</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item onClick={props.logout}>Logout</NavDropdown.Item>
							</NavDropdown>
						</div>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

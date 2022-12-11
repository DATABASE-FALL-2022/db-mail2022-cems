import React, { useState, useEffect, useRef } from 'react';
import { Button, Divider, Form, FormButton, Grid, Header, Modal, Segment, SegmentGroup, Icon,Image, Menu, Input,Card,Message} from 'semantic-ui-react';
import UserView from './UserView';
import axios from 'axios';
import { useAsyncError } from 'react-router-dom';
//import { Form, Button, Card, Modal,Row,Col,InputGroup,Navbar,Container } from 'react-bootstrap';

function HomePage() {
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState();
	const [errorEmail,setErrorEmail] = useState(false);
	const [errorPass,setErrorPass] = useState(false);

	const handleChange = (event, newValue) => {
		setOpen(true);
	};

	// React States
	const [errorMessages, setErrorMessages] = useState({});

	const errors = {
		email: 'invalid username',
		pass: 'invalid password',
		clean: '',
	};

	const validate = (res, p) => {
		if (res.data.passwd === p.value) {
			setErrorMessages({ name: 'clean', message: errors.clean });
			console.log('logged in');
			setUser(res.data);
			const usr = {
				user_id: res.data.user_id,
				email_address: res.data.email_address,
				is_premium: res.data.is_premium,
			};
			localStorage.setItem('user', JSON.stringify(usr));
		} else {
			setErrorMessages({ name: 'pass', message: errors.pass });

			console.log('wrong password');
		}
	};

	const toFetch = async (e) => {
		var { email, pass } = document.forms[0];
		var base = 'http://127.0.0.1:5000/cems/account/';
		var link = base + email.value;

		const response = await axios.get(link).catch((error) => console.log(error));
		validate(response, pass);
	};

	const handleLogout = () => {
		setUser({});
		localStorage.clear();
		window.location.reload();
	};

	const renderErrorMessage = (name) => name === errorMessages.name && <div className='error'>{errorMessages.message}</div>;

	useEffect(() => {
		const loggedInUser = localStorage.getItem('user');
		if (loggedInUser) {
			const foundUser = JSON.parse(loggedInUser);
			setUser(foundUser);
		}
	}, []);

	if (user) {
		return (
			<SegmentGroup>
				<UserView />
			</SegmentGroup>
		);
	}
	

	return (
		
		<Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
			<Grid.Column style={{ maxWidth: 450 }}>
			<Header as='h1' color='blue' textAlign='center'>
				CEMS Email App
			</Header>
			<Form size='large' onSubmit={toFetch}>
				<Segment stacked>
				<Form.Input fluid error={errorEmail} icon='at' iconPosition='left' label='Email' placeholder='Email' name='email'/>
				
				<Form.Input fluid icon='lock' iconPosition='left' label='Password' placeholder='Password' type='password' name='pass' />
				
				<Button color='blue' fluid error={errorPass} size='large' type='submit' primary>
					Login
				</Button>
				</Segment>
			</Form>
			<Message >
				New to us? <a href='Signup'>Sign Up</a>
			</Message>
			</Grid.Column>
		</Grid>
	);
}

export default HomePage;

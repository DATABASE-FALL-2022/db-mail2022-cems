import React, { useState, useEffect, useRef } from 'react';
import { Button, Divider, Form, FormButton, Grid, Header, Modal, Segment, SegmentGroup, Icon,Image, Menu, Input,Card,Message} from 'semantic-ui-react';
import UserView from './UserView';
import axios from 'axios';
//import { Form, Button, Card, Modal,Row,Col,InputGroup,Navbar,Container } from 'react-bootstrap';

function HomePage() {
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState();

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
				<Form.Input fluid icon='user' iconPosition='left' label='Email' placeholder='Email' name='email'/>
				{renderErrorMessage('email')}
				<Form.Input fluid icon='lock' iconPosition='left' label='Password' placeholder='Password' type='password' name='pass' />
				{renderErrorMessage('pass')}
				<Button color='blue' fluid size='large' type='submit' primary>
					Login
				</Button>
				</Segment>
			</Form>
			<Message >
				New to us? <a href='Signup'>Sign Up</a>
			</Message>
			</Grid.Column>
		</Grid>
			
		
		
		
		// <Segment>
		// 	<Header dividing textAlign='center' size='huge'>
		// 		CEMS Mail App
		// 	</Header>
		// 	<Modal centered={false} open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
		// 		<Modal.Header>Success!</Modal.Header>
		// 		<Modal.Content>
		// 			<Modal.Description>You have logged in... Redirecting to your email...</Modal.Description>
		// 		</Modal.Content>
		// 		<Modal.Actions>
		// 			<Button onClick={() => setOpen(false)}>OK</Button>
		// 		</Modal.Actions>
		// 	</Modal>
		// 	<Segment>
		// 		<Grid columns={2} relaxed='very' stackable>
		// 			<Grid.Column>
		// 				<Form onSubmit={toFetch}>
		// 					<Form.Input icon='user' iconPosition='left' label='Email' placeholder='Email' name='email' />
		// 					{renderErrorMessage('email')}
		// 					<Form.Input icon='lock' iconPosition='left' label='Password' type='password' name='pass' />
		// 					{renderErrorMessage('pass')}
		// 					<FormButton type='submit' content='Login' primary />
		// 				</Form>
		// 			</Grid.Column>
		// 			<Grid.Column verticalAlign='middle' centered>
		// 				<Button content='Sign up' icon='signup' size='big' onClick={handleChange} />
		// 			</Grid.Column>
		// 		</Grid>

		// 		<Divider vertical>Or</Divider>
		// 	</Segment>
		// 	<Card.Group itemsPerRow={4}>
		// 		<Card>
		// 			<Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
		// 			<Card.Content>
		// 			<Card.Header>Matthew</Card.Header>
		// 			<Card.Meta>
		// 				<span className='date'>Joined in 2015</span>
		// 			</Card.Meta>
		// 			<Card.Description>
		// 				Matthew is a musician living in Nashville.
		// 			</Card.Description>
		// 			</Card.Content>
		// 			<Card.Content extra>
		// 			<a>
		// 				<Icon name='user' />
		// 				22 Friends
		// 			</a>
		// 			</Card.Content>
		// 		</Card>
		// 		<Card>
		// 			<Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
		// 			<Card.Content>
		// 			<Card.Header>Matthew</Card.Header>
		// 			<Card.Meta>
		// 				<span className='date'>Joined in 2015</span>
		// 			</Card.Meta>
		// 			<Card.Description>
		// 				Matthew is a musician living in Nashville.
		// 			</Card.Description>
		// 			</Card.Content>
		// 			<Card.Content extra>
		// 			<a>
		// 				<Icon name='user' />
		// 				22 Friends
		// 			</a>
		// 			</Card.Content>
		// 		</Card>
		// 		<Card>
		// 			<Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
		// 			<Card.Content>
		// 			<Card.Header>Matthew</Card.Header>
		// 			<Card.Meta>
		// 				<span className='date'>Joined in 2015</span>
		// 			</Card.Meta>
		// 			<Card.Description>
		// 				Matthew is a musician living in Nashville.
		// 			</Card.Description>
		// 			</Card.Content>
		// 			<Card.Content extra>
		// 			<a>
		// 				<Icon name='user' />
		// 				22 Friends
		// 			</a>
		// 			</Card.Content>
		// 		</Card>
		// 		<Card>
		// 			<Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
		// 			<Card.Content>
		// 			<Card.Header>Matthew</Card.Header>
		// 			<Card.Meta>
		// 				<span className='date'>Joined in 2015</span>
		// 			</Card.Meta>
		// 			<Card.Description>
		// 				Matthew is a musician living in Nashville.
		// 			</Card.Description>
		// 			</Card.Content>
		// 			<Card.Content extra>
		// 			<a>
		// 				<Icon name='user' />
		// 				22 Friends
		// 			</a>
		// 			</Card.Content>
		// 		</Card>
		// 	</Card.Group>
		// </Segment>
	);
}

export default HomePage;

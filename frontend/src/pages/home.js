import React, { useState, useEffect, useRef } from 'react';
import { Button, Label, Form, FormButton, Grid, Header, Modal, Segment, SegmentGroup, Icon,Image, Menu, Input,Card,Message} from 'semantic-ui-react';
import UserView from './userview';
import axios from 'axios';
import { useAsyncError } from 'react-router-dom';
//import { Form, Button, Card, Modal,Row,Col,InputGroup,Navbar,Container } from 'react-bootstrap';

function HomePage() {
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState();
	const [errorEmail,setErrorEmail] = useState(false);
	const [errorPass,setErrorPass] = useState(false);
	const [btnLoading,setBtnLoading] = useState(false);


	const validate = (res, p) => {
		if (res.data.passwd === p.value) {
			setErrorPass(false);
			console.log('logged in');
			var full_name = res.data.first_name + " " + res.data.last_name;
			setUser(res.data);
			const usr = {
				user_id: res.data.user_id,
				email_address: res.data.email_address,
				is_premium: res.data.is_premium,
				full_name: full_name
			};
			localStorage.setItem('user', JSON.stringify(usr));
		} else {
			setErrorPass({state:true,content:'Wrong Password'});
			console.log('wrong password');
		}
	};

	const toFetch = async (e) => {
		setErrorEmail(false);
		setErrorPass(false);
		setBtnLoading(true);
		var { email, pass } = document.forms[0];
		var base = 'http://127.0.0.1:5000/cems/account/';
		var link = base + email.value;

		const response = await axios.get(link).catch((error) => console.log(error));

		try{
			if(response.data === 'Account not found'){
				setErrorEmail({state:true,content:'Email Not Found'});
			}else{
				validate(response, pass);
			}
		}catch (error){
			console.log(error);
		}

		setBtnLoading(false);
	};

	const handleLogout = () => {
		setUser({});
		localStorage.clear();
		window.location.reload();
	};

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
				<UserView logout={handleLogout} />
			</SegmentGroup>
		);
	}
	

	return (
		
		<Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
			<Grid.Column style={{ maxWidth: 550 }}>
			<Header as='h1' color='blue' textAlign='center'>
				CEMS Email App
			</Header>
			<Form size='large' onSubmit={toFetch}>
				<Segment stacked>
				<Form.Input error={errorEmail} fluid  icon='at' iconPosition='left' label='Email' placeholder='Email' name='email'/>
				
				<Form.Input error={errorPass} fluid icon='lock' iconPosition='left' label='Password' placeholder='Password' type='password' name='pass' />
				
				<Button loading={btnLoading} color='blue' fluid size='large' type='submit' primary>
					Login
				</Button>
				</Segment>
			</Form>
			<Message >
				New to us? <a href='Signup'>Sign Up</a>
			</Message>
				<Grid.Row style={{ maxWidth: 550 }}>
					<div>
						<Label as='' color='red' image>
						
						Elliot Cardona
						
						</Label>
						<Label as='' color='blue' image>
						
						Cesar Amaro
						
						</Label>
						<Label as='' color='teal' image>
						
						Misael Moctezuma
						
						</Label>
						<Label as='' color='yellow' image>
						
						Sebastian Maldonado
						
						</Label>
					</div>
				</Grid.Row>
			</Grid.Column>
			
			
			
		</Grid>
		
	);
}

export default HomePage;

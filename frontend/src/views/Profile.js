import React, { useState, useEffect } from 'react';
import Email from '../components/Email';
import { ListGroup, Card, Badge } from 'react-bootstrap';
import { Tab } from 'semantic-ui-react';
import * as Icon from 'react-bootstrap-icons';

export default function Inbox() {
	const [user, setUser] = useState([]);

	var loggedUserID = JSON.parse(localStorage.getItem('user')).user_id;

	useEffect(() => {
		fetch('http://127.0.0.1:5000/cems/account/' + loggedUserID, {
			methods: 'GET',
		})
			.then((response) => response.json())
			.then((response) => setUser(response))
			.catch((error) => console.log(error));
	}, [loggedUserID]);

	function formatDate(date) {
		const newDate = new Date(date);

		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		var month = months[newDate.getMonth()];
		var day = newDate.getDate();
		var year = newDate.getFullYear();

		return month + ' ' + day + ', ' + year;
	}

	return (
		<Card className='text-center'>
			<Card.Body>
				<Card.Title className='row gap-4'>
					<Icon.PersonCircle size='5rem' />
					<div className='fw-bold'>
						{user.first_name} {user.last_name}
					</div>
				</Card.Title>
				<Card.Subtitle>{user.email_address}</Card.Subtitle>
				<Card.Text className='col mt-2'>
					<div>{user.gender}</div>
					<div>{user.is_premium}</div>
					<div>{user.phone_number}</div>
					<div>Born {formatDate(user.date_of_birth)}</div>

					<br />
				</Card.Text>
			</Card.Body>
			<Card.Footer className='text-muted'>
				<Icon.PersonCircle className='' />
				22 friends
			</Card.Footer>
		</Card>
	);
}

import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

export default function Friends() {

	function formatPhone(phoneNum) {
		// Phone format received: 0123456789.
		
		// Phone formated to be returned:
		// (012)345-6789.
		var formatted = "(";
		formatted += phoneNum.substring(0, 3);
		formatted += ")";
		formatted += phoneNum.substring(3, 6);
		formatted += "-";
		formatted += phoneNum.substring(6, 10);
		return formatted;
	}

	const [user, setUser] = useState([]);
	var loggedUserID = JSON.parse(localStorage.getItem('user')).user_id;
	
	const friendList = user.map((value) => 
		<div>
			<Card className='text-center'>
				<Card.Body>
					<Card.Title className='row gap-4'>
						<Icon.PersonCircle size='5rem' />
						<div className='fw-bold'>
							{value.first_name} {value.last_name}
						</div>
					</Card.Title>
					<Card.Subtitle>{value.email_address}</Card.Subtitle>
					<Card.Text className='col mt-2'>
						<div>{value.is_premium}</div>
						<div>{formatPhone(value.phone_number)}</div>	
						<br />
					</Card.Text>
				</Card.Body>
				<Card.Footer className='text-muted'>
				</Card.Footer>
			</Card>
			<br />
		</div>
	);

	useEffect(() => {
		fetch('http://127.0.0.1:5000/cems/friends/' + loggedUserID, {
			methods: 'GET',
		})
			.then((response) => response.json())
			.then((response) => setUser(response))
			.catch((error) => console.log(error));
	}, [loggedUserID]);

	return (
		<div>
			<p>Friends: {friendList.length}</p>
			{friendList}
		</div>
	);
}

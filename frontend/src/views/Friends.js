import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

export default function Friends() {
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

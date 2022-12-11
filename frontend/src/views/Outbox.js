import React, { useState, useEffect } from 'react';
import Email from '../components/Email';
import { ListGroup, Card } from 'react-bootstrap';

export default function Outbox() {
	const [data, setData] = useState([]);
	const emailList = data.map((value) => <Email key={value.m_id} info={value} page={'outbox'} />);
	console.log("emailList");
	console.log(emailList);
	useEffect(() => {
		var user = JSON.parse(localStorage.getItem('user'));
	
		fetch('http://127.0.0.1:5000/cems/message/outbox/' + user.user_id, {
			methods: 'GET',
		})
			.then((response) => response.json())
			.then((response) => setData(response))
			.catch((error) => console.log(error));
	}, []);

	return (
		<Card>
			<ListGroup className=''>{emailList}</ListGroup>
		</Card>
	);
}

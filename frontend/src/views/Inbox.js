import React, { useState, useEffect } from 'react';
import Email from '../components/Email';
import { ListGroup, Card, Badge } from 'react-bootstrap';

export default function Inbox() {
	const [data, setData] = useState([]);
	const emailList = data.map((value) => <Email key={value.m_id} info={value} />);

	useEffect(() => {
		fetch('http://127.0.0.1:5000/cems/message/inbox/1', {
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

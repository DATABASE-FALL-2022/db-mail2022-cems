import React, { Component, useState, useEffect } from 'react';
import { Button, Card, Container, List, Modal, SegmentGroup, Tab } from 'semantic-ui-react';
import AllEmails from './AllEmails';

function Emails() {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch('http://127.0.0.1:5000/cems/message/inbox/1', {
			methods: 'GET',
		})
			.then((response) => response.json())
			.then((response) => setData(response))
			.catch((error) => console.log(error));
	}, []);

	return (
		<SegmentGroup>
			<AllEmails info={data} />
		</SegmentGroup>
	);
}

export default Emails;

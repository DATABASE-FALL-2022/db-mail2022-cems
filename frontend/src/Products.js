import React, { Component, useState } from 'react';
import { Button, Card, Container, Modal, Tab } from 'semantic-ui-react';
import AllProducts from './AllProducts';

function Products() {
	const [data, setData] = useState('show');
	let random_info = [
		{ pname: 'p1', pprice: 1.01, pdescription: 'description' },
		{ pname: 'p2', pprice: 1.01, pdescription: 'description' },
		{ pname: 'p3', pprice: 1.01, pdescription: 'description' },
		{ pname: 'p4', pprice: 1.01, pdescription: 'description' },
		{ pname: 'p5', pprice: 1.01, pdescription: 'description' },
		{ pname: 'p6', pprice: 1.01, pdescription: 'description' },
	];

	return (
		<Card.Group>
			<AllProducts info={random_info} />
		</Card.Group>
	);
}

export default Products;

import React, { Component, useState } from 'react';
import { Button, Card, Container, Modal, Tab } from 'semantic-ui-react';

function AllProducts(props) {
	console.log(props);
	props.info.forEach((value) => console.log(value.pname));
	return props.info.map((value) => {
		return (
			<Card>
				<Card.Content>
					<Card.Header>{value.pname}</Card.Header>
					<Card.Meta>{value.pprice}</Card.Meta>
					<Card.Description>{value.pname}</Card.Description>
				</Card.Content>
				<Card.Content extra>
					<div className='ui two buttons'>
						<Button basic color='green'>
							Add to Wish List
						</Button>
						<Button basic color='green'>
							Add to Cart
						</Button>
					</div>
				</Card.Content>
			</Card>
		);
	});
}
export default AllProducts;

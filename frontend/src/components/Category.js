import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

export default function Category(props) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [cat, setCategory] = useState('');
	console.log(props.message.body);
	console.log(props.userID);

	const handleAdd = () => {
		axios
			.put('http://127.0.0.1:5000/cems/message/inbox/markCategory/' + props.userID + '/' + props.message.m_id, {
				category: cat.value,
			})
			.then(function (response) {
				console.log(response); // TODO: Give message to user
			})
			.catch(function (error) {
				console.log(error);
			});
		handleClose();
	};

	return (
		<>
			<Link onClick={handleShow}>
				<Icon.TagsFill className='ms-2' size='20px' />
			</Link>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add Category to Message</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' controlId='newEmail.subject'>
							<Form.Label>
								<p className='fw-bold'>
									Adding Category to message:
									<br />
								</p>{' '}
								<Card body>{props.message.body}</Card>
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' controlId='category.name'>
							<Form.Label>Category name</Form.Label>
							<Form.Control as='input' onChange={(e) => setCategory({ value: e.target.value })} />
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Cancel
					</Button>
					<Button variant='primary' className='btnFormSend' onClick={handleAdd}>
						Add
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

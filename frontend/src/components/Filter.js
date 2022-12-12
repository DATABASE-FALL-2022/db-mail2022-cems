import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Email from './Email';

export default function Filter({ changeInbox }) {
	const [show, setShow] = useState(false);
	// const [emails, setEmails] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [cat, setCategory] = useState('');

	const handleAdd = () => {
		axios
			.get('http://127.0.0.1:5000/cems/message/inbox/category/' + JSON.parse(localStorage.getItem('user')).user_id + '/' + cat.value)
			.then(function (response) {
				try {
					changeInbox(response.data.map((value) => <Email key={value.m_id} info={value} page={'inbox'} />));
				} catch (error) {
					console.log(error);
					changeInbox(<p className='p-5 fw-bold'>Your inbox is empty...</p>);
				}
				console.log(response.data);
			})
			.catch(function (error) {
				console.log(error);
			});

		handleClose();
	};

	return (
		<>
			<Button onClick={handleShow} className='mb-3'>
				<Icon.TagsFill className='ms-2' size='20px' /> Filter by Category
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add Category to Message</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' controlId='newEmail.subject'>
							<Form.Label>
								<p className='fw-bold'>
									What category would you like to see?
									<br />
								</p>{' '}
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

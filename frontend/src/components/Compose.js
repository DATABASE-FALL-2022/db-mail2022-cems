import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';

export default function Compose(props) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [emailValue, setEmailValue] = useState('');
	const [subjectValue, setSubjectValue] = useState('');
	const [bodyValue, setBodyValue] = useState('');

	const onSubmit = () => {
		var emails = emailValue.value.split(',');

		for (let i = 0; i < emails.length; i++) {
			emails[i] = emails[i].replace(/\s/g, '');
		}
		axios
			.post('http://127.0.0.1:5000/cems/message', {
				id: JSON.parse(localStorage.getItem('user')).user_id,
				receiver_email: emails,
				subject: subjectValue.value,
				body: bodyValue.value,
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
			<Button onClick={handleShow}>
				<Icon.PlusCircle />
				<span className='ms-1'>New Message</span>
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>New Message</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' controlId='newEmail.email_address'>
							<Form.Label>To</Form.Label>
							<Form.Control type='email' placeholder='name@cems.com' onChange={(e) => setEmailValue({ value: e.target.value })} />
						</Form.Group>
						<Form.Group className='mb-3' controlId='newEmail.subject'>
							<Form.Label>Subject</Form.Label>
							<Form.Control as='input' onChange={(e) => setSubjectValue({ value: e.target.value })} />
						</Form.Group>
						<Form.Group className='mb-3' controlId='newEmail.body'>
							<Form.Label>Body</Form.Label>
							<Form.Control as='textarea' rows={4} onChange={(e) => setBodyValue({ value: e.target.value })} />
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Cancel
					</Button>
					<Button variant='primary' className='btnFormSend' onClick={onSubmit}>
						Send
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import * as Icon from 'react-bootstrap-icons';

export default function Compose(props) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const handleSend = () => {};

	return (
		<>
			<Button onClick={handleShow}>
				<Icon.PlusCircle />
				<span className='ms-1'>New</span>
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>New Message</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' controlId='newEmail.email_address'>
							<Form.Label>To</Form.Label>
							<Form.Control type='email' placeholder='name@cems.com' />
						</Form.Group>
						<Form.Group className='mb-3' controlId='newEmail.subject'>
							<Form.Label>Subject</Form.Label>
							<Form.Control as='input' />
						</Form.Group>
						<Form.Group className='mb-3' controlId='newEmail.body'>
							<Form.Label>Body</Form.Label>
							<Form.Control as='textarea' rows={4} />
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Cancel
					</Button>
					<Button variant='primary' onClick={handleSend}>
						Send
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

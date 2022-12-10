import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Card, Modal } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

export default function Email(props) {
	const [sender, setSender] = useState([]);
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	useEffect(() => {
		fetch('http://127.0.0.1:5000/cems/account/' + props.info.sender_id, {
			methods: 'GET',
		})
			.then((response) => response.json())
			.then((response) => setSender(response))
			.catch((error) => console.log(error));
	}, [props.info.sender_id]);

	function formatDate(date) {
		const newDate = new Date(date);
		var time = newDate.toLocaleTimeString('en-US', { timeStyle: 'short' });
		const today = new Date();

		if (newDate.getTime() < today.setHours(0, 0, 0, 0)) {
			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			var month = months[newDate.getMonth()];
			var day = newDate.getDate();

			return month + ' ' + day;
		}
		return time;
	}

	function formatEmails() {
		if (sender.email_address === 'dont_reply@support.edu')
			return (
				<div className='row'>
					<div className='col-3 fw-bold align-self-center'>{props.info.subject}</div>
					<div className='col-6 me-auto ms-5'>{props.info.body}</div>
					<div className='col-2 d-flex align-self-center align-items-center justify-content-end'>
						<div className='fw-bold'>{formatDate(props.info.m_date)}</div>
						<Link className=''>
							<Icon.TrashFill className='ms-2' color='red' />
						</Link>
					</div>
				</div>
			);
		return (
			<div className='row'>
				<div className='ms-1 col-3 align-self-center align-items-center'>
					<div className='fw-bold'>
						{sender.first_name} {sender.last_name}
					</div>
					<div className=''>{sender.email_address}</div>
				</div>
				<div className='ms-5 me-auto col-6 align-self-center align-items-center'>
					<div className='fw-bold'>{props.info.subject}</div>
					<Card className='m-auto p-2'>{props.info.body}</Card>
				</div>
				<div className='col-2 d-flex align-self-center align-items-center justify-content-end'>
					<div className='fw-bold'>{formatDate(props.info.m_date)}</div>
					<Button className='ms-2'>Reply</Button>
					<Link className=''>
						<Icon.TrashFill className='ms-2' color='red' />
					</Link>
				</div>
			</div>
		);
	}

	return (
		<ListGroup.Item className='justify-content-between align-items-center p-4' onClick={handleShow} style={{ cursor: 'pointer' }}>
			{formatEmails()}
			<div onClick={(e) => e.stopPropagation()}>
				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>{props.info.subject}</Modal.Title>
					</Modal.Header>
					<Modal.Body>{props.info.body}</Modal.Body>
					<Modal.Footer>
						<Button variant='secondary' onClick={handleClose}>
							Close
						</Button>
						<Button variant='primary' onClick={handleClose}>
							Reply
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		</ListGroup.Item>
	);
}

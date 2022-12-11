import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Card, Modal, Dropdown } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import Notification from './Notification';

export default function Email(props) {
	const [sender, setSender] = useState([]);
	const [show, setShow] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [deleteResponse, setDeleteResponse] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const handleCloseDelete = () => setShowDelete(false);
	const handleShowDelete = () => setShowDelete(true);

	useEffect(() => {
		fetch('http://127.0.0.1:5000/cems/account/' + (props.page === 'inbox' ? props.info.sender_id : props.info.receiver_id), {
			methods: 'GET',
		})
			.then((response) => response.json())
			.then((response) => setSender(response))
			.catch((error) => console.log(error));
	}, [props.info.receiver_id, props.info.sender_id, props.page]);

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

	const handleDelete = () => {
		console.log('STARTING DELETE of ' + props.info.m_id);
		fetch('http://127.0.0.1:5000/cems/message/' + props.info.m_id, {
			methods: 'DELETE',
		})
			.then((response) => response.json())
			.then((response) => setDeleteResponse(response))
			.catch((error) => console.log(error));
		console.log(deleteResponse);
		handleCloseDelete();
	};

	function formatEmails() {
		if (sender.email_address === 'dont_reply@support.edu') return <Notification info={props.info} />;
		else {
			return (
				<div className='row'>
					<div onClick={handleShow} className='row col'>
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
					</div>

					<div className='col-2 d-flex align-self-center align-items-center justify-content-end'>
						<div className='fw-bold'>{formatDate(props.info.m_date)}</div>
						<Button className='ms-2' onClick={handleShowDelete}>
							Reply
						</Button>
						<Link className='' onClick={handleShowDelete}>
							<Icon.TrashFill className='ms-2' color='red' size='20px' />
						</Link>
					</div>
				</div>
			);
		}
	}

	return (
		<ListGroup.Item className='justify-content-between align-items-center p-4' style={{ cursor: 'pointer' }}>
			{formatEmails()}
			<div onClick={(e) => e.stopPropagation()}>
				{/* Modal for open e-mail */}
				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>{props.info.subject}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className=''>{props.info.body}</div>
						<div id='replyField' className='mt-4'>
							<div className='input-group'>
								<div className='input-group-prepend'>
									<span className='input-group-text h-100' id='basic-addon'>
										<Icon.Reply />
									</span>
								</div>
								<textarea className='form-control' id='exampleFormControlTextarea1' rows='5'></textarea>
							</div>
						</div>
					</Modal.Body>

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

			{/* Modal for delete icon */}
			<div onClick={(e) => e.stopPropagation()}>
				<Modal show={showDelete} onHide={handleCloseDelete}>
					<Modal.Header closeButton>
						<Modal.Title>Delete message?</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className=''>Are you sure you would like to delete this message?</div>
					</Modal.Body>

					<Modal.Footer>
						<Button variant='secondary' onClick={handleCloseDelete}>
							Cancel
						</Button>
						<Button variant='primary' onClick={handleDelete}>
							Delete
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		</ListGroup.Item>
	);
}

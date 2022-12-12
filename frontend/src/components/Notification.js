import React, { useState, useEffect } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

export default function Notification(props) {
	const [showDelete, setShowDelete] = useState(false);
	const handleCloseDelete = () => setShowDelete(false);
	const handleShowDelete = () => setShowDelete(true);

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
		const userID = JSON.parse(localStorage.getItem('user')).user_id;

		axios
			.put('http://127.0.0.1:5000/cems/recipient/del/' + userID + '/' + props.info.m_id, {})
			.then(function (response) {
				console.log(response); // TODO: Give message to user
			})
			.catch(function (error) {
				console.log(error);
			});
		handleCloseDelete();
	};

	return (
		<div className='row'>
			<div className='col-3 fw-bold align-self-center'>{props.info.subject}</div>
			<div className='col-6 me-auto '>{props.info.body}</div>
			<div className='col-2 d-flex align-self-center align-items-center justify-content-end'>
				<div className='fw-bold'>{formatDate(props.info.m_date)}</div>
				<Link className='' onClick={handleShowDelete}>
					<Icon.TrashFill className='ms-2' color='red' size='20px' />
				</Link>
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
		</div>
	);
}

import React, { useState, useEffect, useRef } from 'react';
import { ListGroup, Button, Card, Modal, Dropdown, Badge } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import Notification from './Notification';
import axios from 'axios';

export default function Email(props) {
	const [sender, setSender] = useState([]);
	const [show, setShow] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [deleteResponse, setDeleteResponse] = useState(false);
	const [replyResponse, setReplyResponse] = useState(false);
	const [replyMessage, setReplyMessage] = useState(false);
	const [editMessage, setEditMessage] = useState(false);
	const [friend, setIsFriend] = useState(false);
	const [previousMessage, setPreviousMessage] = useState(false);
	const ref = useRef(null);
	const editRef = useRef(null);

	const handleClose = () => setShow(false);
	const handleShow = () => {
		setShow(true);
		handleRead();
	};
	const handleCloseDelete = () => setShowDelete(false);
	const handleShowDelete = () => setShowDelete(true);
	var readMessage = props.info.is_read;

	useEffect(() => {
		fetch('http://127.0.0.1:5000/cems/account/' + (props.page === 'inbox' ? props.info.sender_id : props.info.receiver_id), {
			methods: 'GET',
		})
			.then((response) => response.json())
			.then((response) => setSender(response))
			.catch((error) => console.log(error));
	}, [props.info.receiver_id, props.info.sender_id, props.page]);

	/**
	 *
	 * @param {*} date
	 * @returns
	 */
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

	/**
	 *
	 */
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

	/**
	 *
	 */
	const handleReply = () => {
		handleShow();
	};

	/**
	 *
	 */
	const handleSendReply = () => {
		axios
			.post('http://127.0.0.1:5000/cems/message', {
				id: JSON.parse(localStorage.getItem('user')).user_id,
				receiver_email: sender.email_address,
				subject: props.info.subject,
				body: ref.current.value,
				reply_id: props.info.m_id,
			})
			.then(function (response) {
				console.log(response); // TODO: Give message to user
			})
			.catch(function (error) {
				console.log(error);
			});
		handleClose();
	};

	/**
	 *
	 * @param {*} event
	 */
	const handleMessageChange = (event) => {
		setReplyMessage(event.target.value);
	};

	const handleEditChange = (event) => {
		setEditMessage(event.target.value);
	};

	/**
	 *
	 */
	const handleRead = () => {
		if (!readMessage && props.page === 'inbox') {
			axios
				.put('http://127.0.0.1:5000/cems/message/read', {
					m_id: props.info.m_id,
					user_id: JSON.parse(localStorage.getItem('user')).user_id,
				})
				.then(function (response) {
					console.log(response); // TODO: Give message to user
				})
				.catch(function (error) {
					console.log(error);
				});
			readMessage = true;
		}
	};

	const isFriend = () => {
		const user_id = props.info.receiver_id;
		const friend_id = props.info.sender_id;

		axios
			.get('http://127.0.0.1:5000/cems/friends/' + user_id + '/' + friend_id)
			.then(function (response) {
				console.log(response.data.exists); // TODO: Give message to user
				setIsFriend(response.data.exists);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	const handleEditMessage = () => {
		if (JSON.parse(localStorage.getItem('user')).is_premium) {
			var formData = new FormData();
			formData.append('body', editRef.current.value);

			axios({
				method: 'put',
				url: 'http://127.0.0.1:5000/cems/message/' + props.info.m_id,
				data: formData,
				headers: { 'Content-Type': 'multipart/form-data' },
			})
				.then((response) => {
					console.log(response);
				})
				.catch((response) => {
					console.log(response);
				});

			handleClose();
		}
	};

	/**
	 *
	 * @returns
	 */
	const formatEmails = () => {
		if (sender.email_address === 'dont_reply@support.edu') return <Notification info={props.info} />;
		else {
			var friendMark = <></>;
			var friendField = <></>;
			var userMark = <></>;
			var readMark = <></>;
			var replyMark = <></>;

			isFriend();
			if (friend) {
				friendMark = (
					<Badge pill bg='success' border='danger'>
						<Icon.Person />
						Friend
					</Badge>
				);
			}

			if (sender.is_premium) userMark = <Icon.PatchCheckFill color='#1DA1F2' />;

			if (props.page === 'outbox' && props.info.is_read) {
				readMark = (
					<Badge pill bg='secondary' border='danger'>
						<Icon.Check2All color='white' /> Read
					</Badge>
				);
			}

			if (props.info.reply_id !== null) replyMark = <Icon.ReplyFill color='blue' />;

			return (
				<div className='row'>
					<div onClick={handleShow} className='row col'>
						{friendField}
						<div className='ms-1 col-3 align-self-center align-items-center'>
							<div className='fw-bold'>
								{sender.first_name} {sender.last_name} {userMark} {friendMark}
							</div>
							<div className=''>{sender.email_address}</div>
						</div>
						<div className='ms-5 me-auto col-6 align-self-center align-items-center'>
							<div className='fw-bold'>
								{props.info.subject} {replyMark}
							</div>
							<Card className='m-auto p-2'>{props.info.body}</Card>
							{readMark}
						</div>
					</div>
					<div className='col-2 d-flex align-self-center align-items-center justify-content-end'>
						<div className='fw-bold'>{formatDate(props.info.m_date)}</div>
						<Button className='ms-2' onClick={handleReply}>
							Reply
						</Button>
						<Link className='' onClick={handleShowDelete}>
							<Icon.TrashFill className='ms-2' color='red' size='20px' />
						</Link>
					</div>
				</div>
			);
		}
	};

	useEffect(() => {
		if (props.info.reply_id !== null) {
			fetch('http://127.0.0.1:5000/cems/message/' + props.info.reply_id, {
				methods: 'GET',
			})
				.then((response) => response.json())
				.then((response) => setPreviousMessage(response))
				.catch((error) => console.log(error));
		}
	}, [props.info.reply_id]);

	const message =
		props.info.reply_id !== null ? (
			<Card body>
				<div className=''>
					Message being replied to:
					<Card body>{previousMessage.body}</Card>
				</div>
				<div className='mt-5'>
					<p className='fw-bold'>This is a reply to the message above:</p>
					<Card body>{props.info.body}</Card>
				</div>
			</Card>
		) : (
			props.info.body
		);

	const iconForIO = props.page === 'inbox' ? <Icon.Reply /> : <Icon.Pencil />;
	const buttonForModal =
		props.page === 'inbox' ? (
			<Button variant='primary' onClick={handleSendReply}>
				Reply
			</Button>
		) : (
			<Button variant='primary' onClick={handleEditMessage}>
				Edit
			</Button>
		);

	const messageArea = props.page === 'inbox' ? <textarea className='form-control' ref={ref} onChange={handleMessageChange} id='replyMessage' rows='4'></textarea> : <textarea className='form-control' ref={editRef} onChange={handleEditChange} id='editMessage' rows='4'></textarea>;
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
						<div className=''>{message}</div>

						<div id='replyField' className='mt-4'>
							<div className='input-group'>
								<div className='input-group-prepend'>
									<span className='input-group-text h-100' id='basic-addon'>
										{iconForIO}
									</span>
								</div>
								{messageArea}
							</div>
						</div>
					</Modal.Body>

					<Modal.Footer>
						<Button variant='secondary' onClick={handleClose}>
							Close
						</Button>
						{buttonForModal}
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

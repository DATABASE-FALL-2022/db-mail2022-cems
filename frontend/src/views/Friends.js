import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import FriendCard from '../components/FriendCard';

export default function Friends() {

	const [user, setUser] = useState([]);
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const[emailValue, setEmailValue] = useState('');

	const handleShow = () => {
		setShow(true);
	};
	
	const handleAddFriend = () => {
		console.log(emailValue.value);
		let friendData;  // Account record of account to befriend.
		axios
			.get('http://127.0.0.1:5000/cems/account/' + emailValue.value)
			.then(function (response) {
				friendData = response.data
				if (friendData === "Account not found") {
					console.log("Account not found; Friend cannot be added.");
					// TODO error handling
				} else {
					console.log(friendData);
					axios
						.post('http://127.0.0.1:5000/cems/friends', {
							user_id: loggedUserID,
							friend_id: friendData.user_id
						})
						.then(function (response) {
							console.log(response.data); // TODO: Give message to user
						})
						.catch(function (error) {
							console.log(error);
						});
					handleClose();
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	var loggedUserID = JSON.parse(localStorage.getItem('user')).user_id;
	
	const friendList = user.map((value) => 
		<FriendCard data={value}/>
	);

	useEffect(() => {
		fetch('http://127.0.0.1:5000/cems/friends/' + loggedUserID, {
			methods: 'GET',
		})
			.then((response) => response.json())
			.then((response) => setUser(response))
			.catch((error) => console.log(error));
	}, [loggedUserID]);

	return (
		<div>
			<div>
				<Button style={{float: 'right'}} className='ms-2 col-2 float-right' onClick={handleShow}>
					Add new friend
				</Button>
			</div>
			<p>Friends: {friendList.length}</p>
			<br/>
			{friendList}

			{/* Modal for adding a new friend. */}
			<div onClick={(e) => e.stopPropagation()}>
				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Add a new friend</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group className='mb-3' controlId='newFriend.email_address'>
								<Form.Label>Please, enter the email of the user you would like to add as a friend:</Form.Label>
								<Form.Control type='text' placeholder='name@cems.com' onChange={(e) => setEmailValue({value: e.target.value})}/>
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant='secondary' onClick={handleClose}>
							Cancel
						</Button>
						<Button variant='primary' onClick={handleAddFriend}>
							Add friend
						</Button>
					</Modal.Footer>
				</Modal>
        	</div>
		</div>
	);
}

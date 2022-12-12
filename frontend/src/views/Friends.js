import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import FriendCard from '../components/FriendCard';

export default function Friends() {

	const [user, setUser] = useState([]);
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
			<p>Friends: {friendList.length}</p>
			{friendList}
		</div>
	);
}

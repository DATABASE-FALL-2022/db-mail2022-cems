import React, { Component, useState, useEffect } from 'react';
import StatTable from './components/StatTable';

function Dashboard() {

	var user = JSON.parse(localStorage.getItem('user'));

	return (
		<div>
			<div>
				<h1>User Statistics</h1>
				<h3>Statistics for account: {user.email_address}, with user ID: {user.user_id}.</h3>
				<p>Email with the most recipients</p>
				<StatTable stat='email' type='usr' route='http://127.0.0.1:5000/cems/recipient/topEmail/' c1='Message ID' c2='Num. of Recipients'/>
				<p>Email with most replies</p>
				<StatTable stat='email' type='usr' route='http://127.0.0.1:5000/cems/message/topEmail/' c1='Message ID' c2='Num. of Replies'/>
				<p>Top 5 Users you send emails to the most</p>
				<StatTable stat='user' type='usr' route='http://127.0.0.1:5000/cems/recipient/topFive/' c1='User ID' c2='Num. of Messages'/>
				<p>Top 5 Users who sends emails to you the most</p>
				<StatTable stat='user' type='usr' route='http://127.0.0.1:5000/cems/message/topFive/' c1='User ID' c2='Num. of Messages'/>
			</div>
			<div>
				<h1>Global Statistics</h1>
				<p>Email with the most recipients</p>
				<StatTable stat='email' type='gbl' route='http://127.0.0.1:5000/cems/recipient/mostRecipients/global' c1='Message ID' c2='Num. of Recipients'/>
				<p>Email with most replies</p>
				<StatTable stat='email' type='gbl' route='http://127.0.0.1:5000/cems/message/mostReplies/global' c1='Message ID' c2='Num. of Replies'/>
				<p>Top 10 users with more emails in their inbox</p>
				<StatTable stat='user' type='gbl' route='http://127.0.0.1:5000/cems/recipient/topTenInbox' c1='User ID' c2='Num. of Messages'/>
				<p>Top 10 users with more emails in their outbox</p>
				<StatTable stat='user' type='gbl' route='http://127.0.0.1:5000/cems/recipient/topTenOutbox' c1='User ID' c2='Num. of Messages'/>
			</div>
		</div>
	);
}
export default Dashboard;

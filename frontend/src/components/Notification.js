import React, { useState, useEffect } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

export default function Notification(props) {
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

	return (
		<div className='row'>
			<div className='col-3 fw-bold align-self-center'>{props.info.subject}</div>
			<div className='col-6 me-auto '>{props.info.body}</div>
			<div className='col-2 d-flex align-self-center align-items-center justify-content-end'>
				<div className='fw-bold'>{formatDate(props.info.m_date)}</div>
				<Link className=''>
					<Icon.TrashFill className='ms-2' color='red' size='20px' />
				</Link>
			</div>
		</div>
	);
}

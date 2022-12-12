import React, { useState, useEffect } from 'react';
import { Container, Divider, Header, Sidebar, Tab } from 'semantic-ui-react';
import Dashboard from './dashboard';
import { Button, Card } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import Inbox from '../views/Inbox';
import Outbox from '../views/Outbox';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import Profile from '../views/Profile';
import Compose from '../components/Compose';
import Friends from '../views/Friends';

export default function UserView(props) {
	const [isAuth, setIsAuth] = useState(true);
	const [notShow, setNotShow] = useState(false);

	const panes = [
		{
			menuItem: 'Inbox',
			render: () => (
				<Tab.Pane active={isAuth}>
					<Inbox />
				</Tab.Pane>
			),
		},
		{
			menuItem: 'Outbox',
			render: () => (
				<Tab.Pane active={isAuth}>
					<Outbox />
				</Tab.Pane>
			),
		},
		{
			menuItem: 'Profile',
			render: () => (
				<Tab.Pane active={isAuth}>
					<Profile />
				</Tab.Pane>
			),
		},
		{
			menuItem: 'Friend List',
			render: () => (
				<Tab.Pane active={isAuth}>
					<Friends />
				</Tab.Pane>
			),
		},
		{
			menuItem: 'Dashboard',
			render: () => (
				<Tab.Pane active={isAuth}>
					<Dashboard />
				</Tab.Pane>
			),
		},
	];

	return (
		<div className=''>
			<NavigationBar logout={props.logout} />
			<div className='w-100 d-flex justify-content-start' style={{ paddingLeft: '2.5rem', paddingTop: '2rem' }}>
				<Compose />
			</div>

			<main className='d-flex justify-content-center p-5 ms-4'>
				<Tab className='w-100' panes={panes} />
			</main>
		</div>
	);
}

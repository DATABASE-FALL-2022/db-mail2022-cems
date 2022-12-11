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
					<Container>
						<Header>Anything you need to put here</Header>
						<Divider />
					</Container>
					<Inbox />
				</Tab.Pane>
			),
		},
		{
			menuItem: 'Outbox',
			render: () => (
				<Tab.Pane active={isAuth}>
					<Container>
						<Header>Anything you need to put here</Header>
						<Divider />
					</Container>
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

	function handleCompose() {
		return <Compose />;
	}
	return ( 
		<div className=''>
			<NavigationBar logout={props.logout} />

			<Sidebar></Sidebar>
			<Button onClick={handleCompose}>
				<Icon.PlusCircle />
				<span className='ms-1'>New</span>
			</Button>

			<main className='d-flex justify-content-center pt-5'>
				<Tab className='w-75' panes={panes} />
			</main>
		</div>
	);
}

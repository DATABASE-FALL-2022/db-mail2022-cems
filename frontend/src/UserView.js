import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Container, Divider, Header, Icon, Tab } from 'semantic-ui-react';
import Dashboard from './Dashboard';
import { Card, ListGroup } from 'react-bootstrap';
import Inbox from './views/Inbox';
import Outbox from './views/Outbox';

function UserView() {
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
					:){' '}
					<Card>
						<Card.Content>
							<Card.Header>Matthew</Card.Header>
							<Card.Meta>
								<span className='date'>Joined in 2015</span>
							</Card.Meta>
							<Card.Description>Matthew is a musician living in Nashville.</Card.Description>
						</Card.Content>
						<Card.Content extra>
							<a>
								<Icon name='user' />
								22 Friends
							</a>
						</Card.Content>
					</Card>
				</Tab.Pane>
			),
		},
		{
			menuItem: 'Friend List',
			render: () => (
				<Tab.Pane active={isAuth}>
					<Dashboard />
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

	return <Tab panes={panes} />;
}
export default UserView;

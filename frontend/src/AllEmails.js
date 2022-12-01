import React, { Component, useState } from 'react';
import { Button, Card, Icon, List, Modal, Segment, SegmentGroup } from 'semantic-ui-react';

function AllEmails(props) {
	console.log(props);
	const [open, setOpen] = useState(false);
	props.info.forEach((value) => console.log(value.sender_id));
	const handleChange = (event, newValue) => {
		setOpen(true);
	};
	return props.info.map((value) => {
		return (
			<Segment>
				{' '}
				{value.subject}
				<SegmentGroup horizontal>
					<Segment onClick={handleChange}>{value.body}</Segment>
					<Icon name={'circle'} disabled={false} color={'red'} />
					<Icon name={'circle'} disabled={false} color={'yellow'} />
					<Button onClick={handleChange} compact={true} floated={'right'} basic color='blue'>
						Reply
					</Button>
				</SegmentGroup>
				<Modal centered={false} open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
					<Modal.Header>{value.subject}</Modal.Header>
					<Modal.Content>
						<Modal.Description>{value.body}</Modal.Description>
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={() => setOpen(false)}>OK</Button>
					</Modal.Actions>
				</Modal>
			</Segment>
		);
	});
}
export default AllEmails;

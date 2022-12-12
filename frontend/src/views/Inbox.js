import React, { useState, useEffect } from 'react';
import Email from '../components/Email';
import { ListGroup, Card, Badge } from 'react-bootstrap';
import { Search } from 'semantic-ui-react';
import _ from 'lodash';
import Compose from '../components/Compose';
import Filter from '../components/Filter';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Inbox() {
	const initialState = {
		loading: false,
		results: [],
		value: '',
	};

	const updateInbox = (selection) => {
		var newData = data.filter(function (val) {
			return val.sender_email_address === selection;
		});
		emailList = newData.map((value) => <Email key={value.m_id} info={value} page={'inbox'} />);
	};

	function reducer(state, action) {
		switch (action.type) {
			case 'CLEAN_QUERY':
				return initialState;
			case 'START_SEARCH':
				const v = { ...state, loading: true, value: action.query };
				return v;
			case 'FINISH_SEARCH':
				return { ...state, loading: false, results: action.results };
			case 'UPDATE_SELECTION':
				updateInbox(action.selection);
				return { ...state, value: action.selection };

			default:
				throw new Error();
		}
	}
	const [data, setData] = useState([]);
	const [testEmailList, setEmailList] = useState([]);
	const [state, dispatch] = React.useReducer(reducer, initialState);
	const { loading, results, value } = state;
	const timeoutRef = React.useRef();
	var emailList = {};
	var categoryEmailList = {};

	try {
		emailList = data.map((value) => <Email key={value.m_id} info={value} page={'inbox'} />);
	} catch (error) {
		console.log(error);
		emailList = <p className='p-5 fw-bold'>Your inbox is empty...</p>;
	}

	try {
		categoryEmailList = testEmailList.map((value) => <Email key={value.m_id} info={value} page={'inbox'} />);
	} catch (error) {
		console.log(error);
		categoryEmailList = <p className='p-5 fw-bold'>No emails for that category found...</p>;
	}

	const handleSearchChange = React.useCallback(
		(e, val) => {
			clearTimeout(timeoutRef.current);
			dispatch({ type: 'START_SEARCH', query: val.value });

			timeoutRef.current = setTimeout(() => {
				if (val.value.length === 0) {
					dispatch({ type: 'CLEAN_QUERY' });
					return;
				}

				const re = new RegExp(_.escapeRegExp(val.value), 'i');
				const isMatch = (result) => re.test(result.sender_email_address);

				dispatch({
					type: 'FINISH_SEARCH',
					results: _.filter(data, isMatch),
				});
			}, 300);
		},
		[data]
	);

	useEffect(() => {
		return () => {
			clearTimeout(timeoutRef.current);
		};
	}, []);

	useEffect(() => {
		var user = JSON.parse(localStorage.getItem('user'));
		fetch('http://127.0.0.1:5000/cems/message/inbox/' + user.user_id, {
			methods: 'GET',
		})
			.then((response) => response.json())
			.then((response) => setData(response))
			.catch((error) => console.log(error));
	}, []);

	const resultRenderer = (data) => {
		return (
			<div>
				<p>{data.sender_email_address}</p>
			</div>
		);
	};

	const [show, setShow] = useState(false);
	// const [emails, setEmails] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [cat, setCategory] = useState('');

	const handleAdd = () => {
		var user = JSON.parse(localStorage.getItem('user'));
		fetch('http://127.0.0.1:5000/cems/message/inbox/category/' + user.user_id + '/' + cat.value, {
			methods: 'GET',
		})
			.then((response) => response.json())
			.then((response) => setEmailList(response))
			.catch((error) => console.log(error));

		handleClose();
	};

	return (
		<div>
			<Search className='mb-3' loading={loading} placeholder='Search...' resultRenderer={resultRenderer} onResultSelect={(e, val) => dispatch({ type: 'UPDATE_SELECTION', selection: val.result.sender_email_address })} onSearchChange={handleSearchChange} results={results} value={value} />
			<Button onClick={handleShow} className='mb-3'>
				<Icon.TagsFill className='ms-2' size='20px' /> Filter by Category
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add Category to Message</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' controlId='newEmail.subject'>
							<Form.Label>
								<p className='fw-bold'>
									What category would you like to see?
									<br />
								</p>{' '}
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' controlId='category.name'>
							<Form.Label>Category name</Form.Label>
							<Form.Control as='input' onChange={(e) => setCategory({ value: e.target.value })} />
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Cancel
					</Button>
					<Button variant='primary' className='btnFormSend' onClick={handleAdd}>
						Add
					</Button>
				</Modal.Footer>
			</Modal>

			<Card>
				<ListGroup className=''>{emailList}</ListGroup>
				<ListGroup className='bg-light pt-4 fw-bold'>
					Category: {cat.value}
					<br />
					{categoryEmailList}
					<br />
				</ListGroup>
			</Card>
		</div>
	);
}

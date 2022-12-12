import React, { useState, useEffect } from 'react';
import Email from '../components/Email';
import { ListGroup, Card, Badge } from 'react-bootstrap';
import { Search } from 'semantic-ui-react';
import _ from 'lodash';

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
	var emailList = {};
	try {
		emailList = data.map((value) => <Email key={value.m_id} info={value} page={'inbox'} />);
	} catch (error) {
		console.log(error);
		emailList = <p className='p-5 fw-bold'>Your inbox is empty...</p>;
	}

	const [state, dispatch] = React.useReducer(reducer, initialState);
	const { loading, results, value } = state;
	const timeoutRef = React.useRef();

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
	return (
		<div>
			<Search className='mb-3' loading={loading} placeholder='Search...' resultRenderer={resultRenderer} onResultSelect={(e, val) => dispatch({ type: 'UPDATE_SELECTION', selection: val.result.sender_email_address })} onSearchChange={handleSearchChange} results={results} value={value} />
			<Card>
				<ListGroup className=''>{emailList}</ListGroup>
			</Card>
		</div>
	);
}

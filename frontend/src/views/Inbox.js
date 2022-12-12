import React, { useState, useEffect } from 'react';
import Email from '../components/Email';
import { ListGroup, Card, Badge } from 'react-bootstrap';
// import SearchEmail from '../components/Search2'
import { Search } from 'semantic-ui-react';
import _ from 'lodash';




const initialState = {
	loading: false,
	results: [],
	value: '',
  }

  function exampleReducer(state, action) {
	switch (action.type) {
	  case 'CLEAN_QUERY':
		return initialState
	  case 'START_SEARCH':
		  const v = { ...state, loading: true, value: action.query };
		  // console.log(v);
		return v
	  case 'FINISH_SEARCH':
		return { ...state, loading: false, results: action.results }
	  case 'UPDATE_SELECTION':
		return { ...state, value: action.selection }
  
	  default:
		throw new Error()
	}
  }





export default function Inbox() {
	const [state, dispatch] = React.useReducer(exampleReducer, initialState)
  	const { loading, results, value } = state
	// console.log('value');
	// console.log(state.value);
	const [data, setData] = useState([]);
	var emailList = data.map((value) => <Email key={value.m_id} info={value} page={'inbox'} />);
	console.log('emailist before:');
	console.log(emailList);
	
	//-----------------------------------------------

	


	const timeoutRef = React.useRef()

	const handleSearchChange = React.useCallback((e, data2) => {
		clearTimeout(timeoutRef.current)
		dispatch({ type: 'START_SEARCH', query: data2.value })

		timeoutRef.current = setTimeout(() => {
		if (data2.value.length === 0) {
			dispatch({ type: 'CLEAN_QUERY' })
			return
		}

		const re = new RegExp(_.escapeRegExp(data2.value), 'i')
		const isMatch = (result) => re.test(result.subject)


		dispatch({
			type: 'FINISH_SEARCH',
			results: _.filter(data, isMatch),
		})

		emailList = results.map((value) => <Email key={value.m_id} info={value} page={'inbox'} />)
		console.log('emailList after');
		console.log(emailList);
		// console.log('data inside handle');
		// console.log(data);
		}, 300)
	}, [data])

	React.useEffect(() => {
		return () => {
		clearTimeout(timeoutRef.current)
		}
	}, [])

	//------------------------------------------------

	useEffect(() => {
		var user = JSON.parse(localStorage.getItem('user'));
		console.log("data");
		console.log(data);
		fetch('http://127.0.0.1:5000/cems/message/inbox/' + user.user_id, {
			methods: 'GET',
		})
			.then((response) => response.json())
			.then((response) => setData(response))
			.catch((error) => console.log(error));
	}, []);
	console.log('result')
	console.log(state.results);
	return (

		<div>
		<Search
          loading={loading}
          placeholder='Search...'
          onResultSelect={(e, data2) =>
            dispatch({ type: 'UPDATE_SELECTION', selection: data2.result.subject })
          }
          onSearchChange={handleSearchChange}
          results={results}
          value={value}
        />
		<Card>
			<ListGroup className=''>{emailList}</ListGroup>
		</Card>
		</div>
	);
}

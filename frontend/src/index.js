import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import './index.css';
import '../node_modules/semantic-ui-css/semantic.min.css';
import HomePage from './HomePage';
import UserView from './UserView';
import Dashboard from './Dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<Routes>
			<Route exact path='' element={<HomePage></HomePage>} />
			<Route exact path='/Home' element={<HomePage />} />
			<Route exact path='/UserView' element={<UserView />} />
			<Route exact path='/Dashboard' element={<Dashboard />} />
		</Routes>
	</BrowserRouter>
);

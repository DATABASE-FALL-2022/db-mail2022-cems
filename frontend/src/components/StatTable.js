import React, {useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';

export default function StartTable(props) {

    const [data, setData] = useState([]);

    let tableRows;
    if (props.stat === "email") {
        tableRows = data.map((value) => (
            <tr>
                <td>{value.m_id}</td>
                <td>{value.stats}</td>
            </tr>
        ));
    } else if (props.stat === "user") {
        tableRows = data.map((value) => (
            <tr>
                <td>{value.user_id}</td>
                <td>{value.stats}</td>
            </tr>
        ));
    }

    useEffect(() => {
        if (props.type === "gbl") {
            fetch(props.route, {
                methods: 'GET',
            })
                .then((response) => response.json())
                .then((response) => setData(response))
                .catch((error) => console.log(error));
        } else if (props.type === "usr") {
            var user_id = JSON.parse(localStorage.getItem('user')).user_id;
            fetch(props.route + user_id, {
                methods: 'GET',
            })
                .then((response) => response.json())
                .then((response) => setData(response))
                .catch((error) => console.log(error));
        }
	}, []);

    return (
        <Table striped bordered hover size='sm'>
            <thead>
                <tr>
                    <th>{props.c1}</th>
                    <th>{props.c2}</th>
                </tr>
            </thead>
            <tbody>
                {tableRows}
            </tbody>
		</Table>
    );
}

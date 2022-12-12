import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Modal} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function FriendCard(props) {

    function formatPhone(phoneNum) {
		// Phone format received: 0123456789.
		
		// Phone formated to be returned:
		// (012)345-6789.
		var formatted = "(";
		formatted += phoneNum.substring(0, 3);
		formatted += ")";
		formatted += phoneNum.substring(3, 6);
		formatted += "-";
		formatted += phoneNum.substring(6, 10);
		return formatted;
	}

    const [showDelete, setShowDelete] = useState(false);
    const [deleteResponse, setDeleteResponse] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
	const handleShowDelete = () => setShowDelete(true);

    const handleDelete = () => {
		const userID = JSON.parse(localStorage.getItem('user')).user_id;

		axios
			.delete('http://127.0.0.1:5000/cems/friends/' + userID + '/' + props.data.user_id, {})
			.then(function (response) {
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
		handleCloseDelete();
	};

    return (
        <div>
        <Card className='text-center'>
            <Card.Body>
                <Card.Title className='row gap-4'>
                    <Icon.PersonCircle size='5rem' />
                    <div className='fw-bold'>
                        {props.data.first_name} {props.data.last_name}
                    </div>
                </Card.Title>
                <Card.Subtitle>{props.data.email_address}</Card.Subtitle>
                <Card.Text className='col mt-2'>
                    <div>{props.data.is_premium}</div>
                    <div>{formatPhone(props.data.phone_number)}</div>	
                    <br />
                </Card.Text>
                <Link className='' onClick={handleShowDelete}>
                    <Icon.TrashFill className='ms-2' color='red' size='20px' />
                </Link>
            </Card.Body>
            <Card.Footer className='text-muted'>
            </Card.Footer>
        </Card>

        {/* Modal for delete icon */}
        <div onClick={(e) => e.stopPropagation()}>
            <Modal show={showDelete} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete friend?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className=''>Are you sure you would like to delete {props.data.first_name} {props.data.last_name} as a friend?</div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' onClick={handleCloseDelete}>
                        Cancel
                    </Button>
                    <Button variant='primary' onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        
        </div>
        <br />
    </div>
    );
}
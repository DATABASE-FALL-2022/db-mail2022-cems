import React, { useState, useEffect } from 'react';
import Email from '../components/Email';
//import { ListGroup, Card, Badge } from 'react-bootstrap';
import { Tab, Header, Segment,Form,Button,Message,Card, Grid} from 'semantic-ui-react';
//import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';

export default function Profile() {
	const [user, setUser] = useState([]);
	const [infoStatus,setInfoStatus] = useState(false);
	const [editStatus,setEditStatus] = useState(true);

	const [errorEmail, setErrorEmail]= useState(false);
    const [errorPass, setErrorPass]= useState(false);
    const [errorFName, setErrorFName]= useState(false);
    const [errorLName, setErrorLName]= useState(false);
    const [errorDay, setErrorDay]= useState(false);
    const [errorMonth, setErrorMonth]= useState(false);
    const [errorYear, setErrorYear]= useState(false);
    const [errorGender, setErrorGender]= useState(false);
    const [errorPhone, setErrorPhone]= useState(false);
    const [subColor,setSubColor] = useState("blue");
    const [submitLabel,setSubLabel]=useState("Update");
    const [subLoading,setSubLoading]=useState(false);
	const [open,setOpen]=useState(false);
	const [trimmedEmail, setTrimEmail] = useState();
	const [day,setDay] = useState();
	const [month,setMonth] = useState();
	const [year,setYear] = useState();


	var loggedUserID = JSON.parse(localStorage.getItem('user')).user_id;
	

	useEffect(() => {
		//setOpen(false);
		fetch('http://127.0.0.1:5000/cems/account/' + loggedUserID, {
			methods: 'GET',
		})
			.then((response) => response.json())
			.then((response) => setUser(response))
			.catch((error) => console.log(error));
	}, [loggedUserID]);
	

	function formatDate(date) {
		const newDate = new Date(date);

		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		var month = months[newDate.getMonth()];
		var day = newDate.getDate();
		var year = newDate.getFullYear();

		return month + ' ' + day + ', ' + year;
	}

	function formatPhone(num){
		var cleaned = ('' + num).replace(/\D/g, '');
  		var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  		if (match) {
    		return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  		}
  		return null;

	}


	const trimEmail = () =>{
		
		try{
			const myArray = user.email_address.split("@");
			let word = myArray[0];
			setTrimEmail( word);
		}catch(error){
			console.log(error);
		}
		
	}

	const handlePremium = ()=>{
        
        const {premium} = document.forms[0];
        
        if (!premium.checked){
            setSubColor("green");
            setSubLabel("Update and Upgrade to Premium");
            
        }else{
            setSubColor("blue");
            setSubLabel("Update");
        }
        
    }

	function formatPremium(){
		if(user.is_premium){
			return "Active";
		}else{
			return "Inactive"
		}
	}

	const checkEmailValid = async (email) => {
		if (email.value + '@cems.com'===user.email_address){
			return true;
		}
        var base = 'http://127.0.0.1:5000/cems/account/';
		var link = base + email.value +'@cems.com';
        const response = await axios.get(link).catch((error) => console.log(error));
        try{
            if (response.data!=="Account not found"){
                return false;
            }else{
                return true;
            }
        }catch (error){
            return false;
        }
        
    }
	const openMessage = () =>{
        setOpen(true);
    }
	const closeMessage = () =>{
        setOpen(false);
    }

	
	const handleEdit = () =>{
		const newDate = new Date(user.date_of_birth);
		setDay(newDate.getDate()+1);
		setMonth(newDate.getMonth()+1);
		setYear(newDate.getFullYear());
		trimEmail();
		if(editStatus){
			setEditStatus(false);
			setInfoStatus(true);
			
		}else{
			setInfoStatus(false);
			setEditStatus(true);
		}
	}

	const handleEmpty = (d) =>{
        setErrorEmail(false);
        setErrorPass(false);
        setErrorFName(false);
        setErrorLName(false);
        setErrorDay(false);
        setErrorMonth(false);
        setErrorYear(false);
        setErrorGender(false);
        setErrorPhone(false);
        var { email, pass,firstname,lastname,day,month,year, gender,phone} = d;
        var allFilled = true;
        
        if(!email.value){
            allFilled = false;
            setErrorEmail(true);
        }
        if(!pass.value){
            allFilled = false;
            setErrorPass(true);
        }
        if(!firstname.value){
            allFilled = false;
            setErrorFName(true);
        }
        if(!lastname.value){
            allFilled = false;
            setErrorLName(true);
        }
        if(!day.value){
            allFilled = false;
            setErrorDay(true);
        }
        if(parseInt(day.value)<1 || parseInt(day.value)>31 ){
            allFilled = false;
            setErrorDay({state:true,content:'Day not valid'});
        }
        if(!month.value){
            allFilled = false;
            setErrorMonth(true);
        }
        if(parseInt(month.value)<1 || parseInt(month.value)>12 ){
            allFilled = false;
            setErrorMonth({state:true,content:'Month not valid'});
        }
        if(!year.value){
            allFilled = false;
            setErrorYear(true);
        }
        if(parseInt(year.value)<1900 || parseInt(year.value)>2022 ){
            allFilled = false;
            setErrorYear({state:true,content:'Year not valid'})
        }
        if(!gender.value){
            allFilled = false;
            setErrorGender(true);
        }
        if(!phone.value){
            allFilled = false;
            setErrorPhone(true);
        }
        if(parseInt(phone.value)<1110000000 || parseInt(phone.value)>9999999999){
            allFilled = false;
            setErrorPhone({state:true,content:'Phone not valid'})
        }

        return allFilled;

    }

	function formatToFormData(data){
		var bodyFormData = new FormData();
		var { email, pass,firstname,lastname,day,month,year, gender,phone,premium} = data;
		if(email.value+'@cems.com'!==user.email_address){
			bodyFormData.append('email_address', email.value+'@cems.com');
		}
		if(pass.value!==user.passwd){
			bodyFormData.append('passwd', pass.value);
		}
		if(firstname.value!==user.first_name){
			bodyFormData.append('first_name', firstname.value);
		}
		if(lastname.value!==user.last_name){
			bodyFormData.append('lastn_name', lastname.value);
		}
		if(gender.value!==user.gender){
			bodyFormData.append('gender', gender.value);
		}
		if(phone.value!==user.phone_number){
			bodyFormData.append('phone_number',  phone.value);
		}
		if(premium.checked!==user.is_premium){
			bodyFormData.append('is_premium',premium.checked);
		}
		var dob = year.value+'-'+month.value+'-'+day.value;
		if (dob!==user.date_of_birth){
			bodyFormData.append('date_of_birth',dob);
		}

		return bodyFormData;
		
	}
	const saveToDB = async (data) =>{
		var { premium} = data;

        const uData = formatToFormData(data);
		var link = 'http://127.0.0.1:5000/cems/account/'+user.user_id;
		
        
        

		const response = await axios({
			method: "put",
			url: link,
			data: uData,
			headers: { "Content-Type": "multipart/form-data" },
		  })
          .catch(function (error) {
            console.log(error);
          });

        try{
			
            if(response.data){
                
                if(premium.checked){
                	await upgradePremium(user.user_id);
                

            	}else{
					await downgradePremium(user.user_id);
				}
				
				handleEdit();
                openMessage();

            }
        }catch (error){
            console.log(error);
        }
        
        
        


    }
    const upgradePremium = async (id) =>{
        const base = 'http://127.0.0.1:5000/cems/account/upPremium/';
        var link = base + id;
        const response = await axios.post(link
        )
        .catch(function (error) {
            console.log(error);
        });
        return(response);

    }
	const downgradePremium = async (id) =>{
        const base = 'http://127.0.0.1:5000/cems/account/dnPremium/';
        var link = base + id;
        const response = await axios.post(link
        )
        .catch(function (error) {
            console.log(error);
        });
        return(response);

    }
	const handleSubmit = async () => {
		
        setSubLoading(true);
        if (handleEmpty(document.forms[0])!==true){
            setSubLoading(false);
            return()=>{
                
            }
        }
        var { email} = document.forms[0];

        const valid = await checkEmailValid(email);
        console.log('valid:',valid);
        

        if(valid){
            
            setErrorEmail(false);
            await saveToDB(document.forms[0]);
            setSubLoading(false);
            

        }else{
            setSubLoading(false);
            setErrorEmail({state:true,content:'Email already registered'});
        }
        

    }


	return (
		<Segment >
			<Header as='h2'content={'Profile'}/>
			<Segment.Group hidden={infoStatus}>
				<Segment.Group horizontal>
				<Segment><Header as='h5'>First name:</Header><Segment><Header as='h6'>{user.first_name}</Header></Segment></Segment>
				<Segment><Header as='h5'>Last name:</Header><Segment><Header as='h6'>{user.last_name}</Header></Segment></Segment>
				<Segment><Header as='h5'>Email:</Header><Segment><Header as='h6'>{user.email_address}</Header></Segment></Segment>
				</Segment.Group>
				<Segment.Group horizontal>
				<Segment><Header as='h5'>Date of birth:</Header><Segment><Header as='h6'>{formatDate(user.date_of_birth)}</Header></Segment></Segment>
				<Segment><Header as='h5'>Phone:</Header><Segment><Header as='h6'>{formatPhone(user.phone_number)}</Header></Segment></Segment>
				<Segment><Header as='h5'>Gender:</Header><Segment><Header as='h6'>{user.gender}</Header></Segment></Segment>
				</Segment.Group>
				<Segment><Header as='h5'>Premium status:</Header><Segment><Header as='h6'>{formatPremium()}</Header></Segment></Segment>
				<Message onDismiss={closeMessage} hidden={!open} success header='Update successful' content='Information has been updated. Refresh to see changes...'/>
				<Segment><Button primary onClick={handleEdit}>Edit Information</Button></Segment>
				
			</Segment.Group>
			
			<Form hidden={editStatus} onSubmit={handleSubmit}>
				<Form.Group>
				<Form.Input error={errorFName} defaultValue = {user.first_name}  name = 'firstname' label='First name' placeholder='First Name' width={9} />
				<Form.Input error={errorLName} defaultValue = {user.last_name}  name ='lastname' label='Last Name' placeholder='Last Name' width={7} />
				</Form.Group>
				<Form.Group>

				<Form.Input error={errorEmail} defaultValue = {trimmedEmail}  label = 'Email' name = 'email' placeholder='example' width={10}/>
				<Form.Input readOnly label= '_' value='@cems.com' width={6}/>

				</Form.Group>
				<Form.Group>

				<Form.Input error={errorPass} defaultValue = {user.passwd}  name = 'pass' label = 'Password 'placeholder='Password' width={8} type='password' />
				<Form.Input defaultValue = {user.gender}  name = 'gender' label = 'Gender 'placeholder='Gender' width={8} type='text' />
				</Form.Group>
				<Form.Group>
					<Form.Input error={errorDay} defaultValue={day} name = 'day' label = '_' placeholder='DD' width={3} />
					<Form.Input error={errorMonth} defaultValue={month} name = 'month' label = 'DOB' placeholder='MM' width={3} />
					<Form.Input error={errorYear} defaultValue={year} name = 'year' label = '_' placeholder='YYYY' width={4} />
					<Form.Input error={errorPhone} defaultValue = {user.phone_number} name = 'phone' label = 'Phone' placeholder='##########' width={6} type='tel' />
					
				</Form.Group>
				<Form.Checkbox onChange={handlePremium} defaultChecked = {user.is_premium} slider name='premium' label = 'Premium' placeholder='Premium' />

				<Button loading={subLoading} color={subColor}   size='large' type='submit' >
					{submitLabel}
				</Button>
				<Button onClick={handleEdit} secondary   size='large' >
					Cancel
				</Button>
				

			</Form>
		</Segment>


	);
}

import React, { useState, useEffect, useRef } from 'react';
import { Button, Divider, Form, FormButton, Grid, Header, Modal, Segment, SegmentGroup, Icon,Image, Menu, Input,Card,Message, Label} from 'semantic-ui-react';
import UserView from './userview';
import axios from 'axios';

function Signup() {
	
	const [user, setUser] = useState();
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
    const [submitLabel,setSubLabel]=useState("Sign Up");
    const [subLoading,setSubLoading]=useState(false);
    const [open,setOpen]=useState(false);

    const handlePremium = ()=>{
        
        const {premium} = document.forms[0];
        
        if (!premium.checked){
            setSubColor("green");
            setSubLabel("Premium Sign Up");
            
        }else{
            setSubColor("blue");
            setSubLabel("Sign Up");
        }
        
    }


    const checkEmailValid = async (email) => {
        var base = 'http://127.0.0.1:5000/cems/account/';
		var link = base + email.value;
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
    const saveToDB = async (data) =>{

        var { email, pass,firstname,lastname,day,month,year, gender,phone,premium} = data;
        var link = 'http://127.0.0.1:5000/cems/account';
        var dob = year.value+'-'+month.value+'-'+day.value;
        
        

		const response = await axios.post(link, {
            first_name: firstname.value,
            last_name: lastname.value,
            date_of_birth: dob,
            gender: gender.value,
            phone_number: phone.value,
            email_address: email.value+'@cems.com',
            passwd: pass.value
          })
          .catch(function (error) {
            console.log(error);
          });

        try{
            if(response.data.user_id){
                
                if(premium.checked){
                await upgradePremium(response.data.user_id);
                

            }
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
        console.log(response);
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

	useEffect(() => {
        setOpen(false);
		const loggedInUser = localStorage.getItem('user');
		if (loggedInUser) {
			const foundUser = JSON.parse(loggedInUser);
			setUser(foundUser);
		}
	}, []);


	if (user) {
		return (
			<SegmentGroup>
				<UserView />
			</SegmentGroup>
		);
	}
	

	return (
		
		<Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
			<Grid.Column style={{ maxWidth: 450 }}>
			<Header as='h1' color='blue' textAlign='center'>
				CEMS Email App
			</Header>
            <Segment stacked>
                <Form onSubmit={handleSubmit} success={open}>
                    <Form.Group>
                    <Form.Input error={errorFName} name = 'firstname' label='First name' placeholder='First Name' width={9} />
                    <Form.Input error={errorLName} name ='lastname' label='Last Name' placeholder='Last Name' width={7} />
                    </Form.Group>
                    <Form.Group>
                    
                    <Form.Input error={errorEmail} label = 'Email' name = 'email' placeholder='example' width={10}/>
                    <Form.Input readOnly label= '_' value='@cems.com' width={6}/>
                    
                    </Form.Group>
                    <Form.Group>
                    
                    <Form.Input error={errorPass} name = 'pass' label = 'Password 'placeholder='Password' width={8} type='password' />
                    <Form.Input error={errorGender} name = 'gender' label = 'Gender 'placeholder='Gender' width={8} type='text' />
                    </Form.Group>
                    <Form.Group>
                        <Form.Input error={errorDay} name = 'day' label = '_' placeholder='DD' width={3} />
                        <Form.Input error={errorMonth} name = 'month' label = 'DOB' placeholder='MM' width={3} />
                        <Form.Input error={errorYear} name = 'year' label = '_' placeholder='YYYY' width={4} />
                        <Form.Input error={errorPhone} name = 'phone' label = 'Phone' placeholder='##########' width={6} type='tel' />
                        
                    </Form.Group>
                    <Form.Checkbox slider onChange={handlePremium} name='premium' label = 'Premium' placeholder='Premium' />
                    
                    <Button loading={subLoading} color={subColor} fluid size='large' type='submit' >
                        {submitLabel}
                    </Button>
                    <Message success header='Your user registration was successful' content="You may now log-in with the email you have chosen"/>
                    
                </Form>
            </Segment>
			<Message >
				Already have an account? <a href='/#'>Log In</a>
			</Message>
			</Grid.Column>
		</Grid>
    
	);
}

export default Signup;

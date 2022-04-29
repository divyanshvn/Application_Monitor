import React, { useEffect }  from "react";
import { useState } from "react";
import { Container, Form, FormGroup,Button, Alert } from "react-bootstrap";
import { AiFillEye,AiFillEyeInvisible } from "react-icons/ai";
import AuthService from "./services/auth.service";
import { useNavigate } from "react-router-dom";

function SignupForm(){
    const [showpassword,setShowPassword] = useState(false);
    const [addemail,setEmail] = useState('');
    const [addname,setName] = useState('');
    const [addpassword,setPassword] = useState('');
    const navigate = useNavigate();

    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    }

    const nameChangeHandler = (event) => {
        setName(event.target.value);
    }

    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    }
    
    /*const handleSubmit = (event) => {
        event.preventDefault();
            fetch('http://localhost:3001/user/register/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({addname,addemail,addpassword}),
            })
            .catch(error => {
              console.error("There was an Error",error);
            });
    }*/
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await AuthService.signup(addname,addemail, addpassword).then(
            (response) => {
              // check for token and user already exists with 200
              //   console.log("Sign up successfully", response);
              navigate("/");
              window.location.reload();
            },
            (error) => {
                
             if(error.response.status == 404){
                alert("user Already exist!");   // do alerts
             }
            }
          );
        } catch (err) {
          console.log(err);
        }
      };
    



    return (
        <Container>
          <div className="graphform">
            <Form onSubmit={handleSubmit} className="graphform">
                <Form.Group  controlId="form.name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Your Name" required onChange={nameChangeHandler} />
                </Form.Group>
                <Form.Group  controlId="form.email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email Id" required onChange={emailChangeHandler} />
                </Form.Group>
                <Form.Group  controlId="form.password">
                    <Form.Label>password</Form.Label>
                    <Form.Control type={showpassword ? "text" : "password"}  placeholder="Enter Your Password" required onChange={passwordChangeHandler} />
                </Form.Group>
                <Button type='submit' className="graphbutton">Sign Up</Button>
            </Form>
            </div>
        </Container>
    )
}


export default SignupForm;
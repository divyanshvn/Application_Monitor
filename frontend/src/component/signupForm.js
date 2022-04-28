import React, { useEffect }  from "react";
import { useState } from "react";
import { Container, Form, FormGroup } from "react-bootstrap";
import { AiFillEye } from "react-icons/ai";

function SignupForm(){
    [showpassword,setShowPassword] = useState(false);

    return (
        <Container>
            <Form>
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
            </Form>
        </Container>
    )
}


export default SignupForm;
import React, { useEffect }  from "react";
import { useState } from "react";
import { Container, Form, FormGroup,Button } from "react-bootstrap";
import ErrorMessage from "./errorMessage";
import axios from 'axios';
import AuthService from "./services/auth.service";
import { useNavigate } from "react-router-dom";

function LoginForm(){
    const [datas,setData] = useState([]);
    const [addemail,setEmail] = useState('');
    const [addpassword,setPassword] = useState('');
    const [error,setError] = useState('');
    const navigate = useNavigate();
    
    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    }

    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    }


    
  /*  async function fetchData() {
        fetch(`http://localhost:3001/graph/${addemail}/${addpassword}`) // check url
            .then(res => res.json())
            .then(data => {
                //printBoxes(data, setX);
                localStorage.setItem("userInfo",JSON.stringify(data));
                setData(data);
                console.log(data);
           })
           .catch(error => {
              setError(error.response.data.message);
          });
      }*/
  
      /*useEffect(() => {
        fetchData()
      }, [])*/

      const HandleSubmit = async (e) => {
        e.preventDefault();
        try {
          await AuthService.login(addemail, addpassword).then(
            () => {
              navigate("/home");
              window.location.reload();
            },
            (error) => {
              //console.log(error);
              if (error.response.status == 401){
                alert("wrong credentials");
              }
            }
          );
        } catch (err) {
          console.log(err);
        }
      };
  
   /*   const HandleSubmit = (event) => {
          event.preventDefault();
          try {
            await AuthService.login(email, password).then(
              () => {
                navigate("/home");
                window.location.reload();
              },
              (error) => {
                console.log(error);
              }
            );
          } catch (err) {
            console.log(err);
          }
      }*/



    return (
        <Container>
            {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
            <div className="graphformdiv">
            <Form onSubmit={HandleSubmit} className="graphform">
                <Form.Group  controlId="form.email">
                    <Form.Label>Email ID</Form.Label>
                    <Form.Control type="email" placeholder="Enter Your Email ID" required onChange={emailChangeHandler} />
                </Form.Group>
                <Form.Group  controlId="form.password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Your Password" required onChange={passwordChangeHandler}/>
                </Form.Group>
                <Button type='submit' className="graphbutton">Log In!</Button>
            </Form>
            </div>
        </Container>
    )
}


export default LoginForm;
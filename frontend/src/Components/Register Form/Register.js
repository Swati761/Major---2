import React, {useState} from 'react';
import axios from 'axios';
import './Register.css';
import CustomModal from '../../Modal/Modal';
import { Button } from 'react-bootstrap';
import constants from '../../config';
import rsa from 'js-crypto-rsa';
import { storeInIndexedDB } from '../../Utils/storeInIndexedDB';
const bcrypt = require('bcryptjs');


const Register = (props) => {

    const uint8ToBase64 = (arr) => Buffer.from(arr).toString('base64');

    const salt = bcrypt.genSaltSync(10);

    const [values, setValues] = useState({
        formData: {
            name: '',
            email: '',
            username: '',
            password: '',
            phoneNumber: '',
            otpPhone: '',
            otpEmail: ''
        }, 
        showModal:false
    });

    const onChange = (event) => {
        event.preventDefault();
        let temp = values.formData;
        temp[event.target.name] = event.target.value;
        setValues({
            ...values,
            formData: temp
        });
        
    }

    const {
            name,
            email,
            phoneNumber,
            username,
            password,
            otpEmail,
            otpPhone,
    } = values.formData;

    const onSubmit = async (event) => {
        const {
            name,
            email,
            phoneNumber,
            username,
            password,
            otpEmail,
            otpPhone,
        } = values.formData;
        event.preventDefault();
        if(!(await verifyOTP(otpEmail, otpPhone))) {
            setValues({
                ...values,
                showModal: false
            });
            alert("OTP Mismatch");
            return ;
        }
        setValues({
            ...values,
            showModal: true
        });
        if(!(await verifyUnqiueUsername(username))) {
            setValues({
                ...values,
                showModal: false
            });
            alert("Username must be unqiue");
            return ;
        }
        setValues({
            ...values,
            showModal: true
        });
        try {
            let cnt = 1;
            let message = "Can't go further because of following errors : \n";
            if(values.formData.name.trim() === '') {
                message += "" + cnt + ". Name cannot be empty\n";
                cnt++;
            }
            if(values.formData.email.trim() === '') {
                message += "" + cnt + ". Email cannot be empty\n";
                cnt++;
            }
            if(values.formData.username.trim() === '') {
                message += "" + cnt + ". Username cannot be empty\n";
                cnt++;
            }
            if(values.formData.password.trim() === '') {
                message += "" + cnt + ". Password cannot be empty\n";
                cnt++;
            }
            
            if(cnt === 1) {
                const key = await rsa.generateKey(2048);
                axios.post(`${constants.SERVER_URL}/stark/register`,{
                    name: uint8ToBase64(await rsa.encrypt(
                        new TextEncoder("utf-8").encode(name),
                        key.publicKey,
                        'SHA-256',
                    )),
                    username,
                    email: uint8ToBase64(await rsa.encrypt(
                        new TextEncoder("utf-8").encode(email),
                        key.publicKey,
                        'SHA-256',
                    )),
                    password: bcrypt.hashSync(password, salt),
                    phoneNumber: uint8ToBase64(await rsa.encrypt(
                        new TextEncoder("utf-8").encode(phoneNumber),
                        key.publicKey,
                        'SHA-256',
                    )),
                    pubKey: JSON.stringify(key.publicKey), 
                }).then(async (res)=>{
                    await storeInIndexedDB(res.data.username, JSON.stringify(key.privateKey));
                    setValues({
                        formData: {
                            name: '',
                            password: '',
                            email: '',
                            otpPhone: '',
                            phoneNumber: '',
                            otpEmail: '',
                            username: ''
                        }, 
                        showModal: false,
                    });
                }).then(() => {
                    alert('Login to proceed');
                    window.location.reload();
                }).catch((err)=>{
                    alert(err);
                    setValues({
                        ...values, 
                        showModal: false
                    });
                });
            } else {
                alert(message);
                setValues({
                    ...values,
                    showModal: false
                });
            }
        } catch(err) {
            setValues({
                ...values,
                showModal: false
            });
            alert("Cannot Verify Details. Try in sometime");
        }
    }

    const sendEmailOTP = () => {
        axios.post(`${constants.SERVER_URL}/stark/sendmail`, {
            email
        });
    }

    const sendPhoneOTP = () => {
        axios.post(`${constants.SERVER_URL}/stark/sendOTP`, {
            phoneNumber
        });
    }

    const verifyUnqiueUsername = async(username) => {
        const res = await axios.post(`${constants.SERVER_URL}/stark/verifyUsername`, {
            username
        });
        return res.data.unique;
    }

    const verifyOTP = async(otpEmail,otpPhone) => {
        let verified = true;
        const res1 = await axios.post(`${constants.SERVER_URL}/stark/verifyOTP`, {
            otp: otpPhone
        });
        verified = verified && res1.data.verified;
        const res2 = await axios.post(`${constants.SERVER_URL}/stark/verifyOTP`, {
           otp: otpEmail 
        });
        verified = verified && res2.data.verified;
        return verified;

    }

    return (
        <>

        <CustomModal show={values.showModal} message = {"Verifying Details....Please wait"} title = {"Register Process"}/>
        <div className="containerx">
        <div className="row">
            <div className="col-sm-2 col-md-7 col-lg-10 mx-auto">
                <div className="card border-0 shadow rounded-3 my-5">
                <div className="card-body p-4 p-sm-1">
                    <h5 className="card-title text-center mb-5 fw-light fs-5"><b>Register</b></h5>
                    <form>
                    <div className="form-floating mb-2">
                        <input type="text" name = 'name' className="form-control" id="floatingInput 1" placeholder="Name" onChange = {onChange}></input>
                        <label htmlFor="floatingInput">Name</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input type="text" name = 'username' className="form-control" id="floatingInput 1" placeholder="Name" onChange = {onChange}></input>
                        <label htmlFor="floatingInput">Username</label>
                    </div>
                    <div className="form-floating mb-1">
                        <input type="email" name = 'email' className="form-control" id="floatingInput 2" placeholder="Email" onChange = {onChange}></input>
                        <label htmlFor="floatingInput">Email</label>
                        <Button style = {{marginTop: "3px"}} onClick = {sendEmailOTP}>SEND OTP</Button>
                    </div>
                    <div className="form-floating mb-1">
                        <input type="emailOTP" name = 'otpEmail' className="form-control" id="floatingInput 3" placeholder="Verify Email OTP" onChange = {onChange}></input>
                        <label htmlFor="floatingInput">Verify OTP sent on Email</label>
                    </div>
                    <div className="form-floating mb-1">
                        <input type="phoneNumber" name = 'phoneNumber' className="form-control" id="floatingInput 4" placeholder="Phone Number" onChange = {onChange}></input>
                        <label htmlFor="floatingInput">Phone Number</label>
                        <Button style = {{marginTop: "3px"}} onClick = {sendPhoneOTP}>SEND OTP</Button>
                    </div>
                    <div className="form-floating mb-1">
                        <input type="phoneOTP" name = 'otpPhone' className="form-control" id="floatingInput 5" placeholder="Verify Phone OTP" onChange = {onChange}></input>
                        <label htmlFor="floatingInput">Verify OTP sent on Phone</label>
                    </div>
                    <div className="form-floating mb-2">
                        <input type="password" name = 'password' className="form-control" id="floatingPassword 6" placeholder="Password" onChange = {onChange}></input>
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <div className="d-grid">
                        <button className="btn btn-primary btn-login text-uppercase fw-bold" onClick = {onSubmit}>Sign Up</button>
                    </div>
                    </form>
                </div>
                </div>
            </div>
        </div>
    </div>
    </>			                            
    )
}

export default Register;
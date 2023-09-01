import { useEffect, useState } from 'react';
import { Card, ProgressBar, Button } from 'react-bootstrap';
import ReactFileReader from 'react-file-reader';
import axios from 'axios';
import CustomModal from '../../Modal/Modal';
import constants from '../../config';
import Web3 from 'web3';
import Menubar from '../../Components/Menubar/AdminMenubar/AdminMenubar';

const RegisterAttackPage = (props) => {

    const [values, setValues] = useState({
        position: 1,
        attacks: {
            severity: 0,
            attackTimings: []
        },
        userList: [],
        groupList: [],
        showModal: false
    });

    const nextPage = (event) => {
        event.preventDefault();
        let pos = values.position;
        if(pos === 1) {
            let cnt = 1;
            let message = "Can't go further because of following errors : \n";
            if(values.attacks.severity.trim() === '') {
                message += "" + cnt + ". Severity cannot be empty\n";
                cnt++;
            }
            try {
                parseInt(values.attacks.severity);
            } catch(err) {
                message += "" + cnt + ". Severity must be a number\n";
                cnt++;
            }
            if(cnt === 1) {
                setValues({
                    ...values,
                    position: pos + 1
                });
            } else {
                alert(message);
            }
        }
    }

    const prevPage = (event) => {
        event.preventDefault();
        let pos = values.position;
        setValues({
            ...values,
            position: pos - 1
        });
    }

    const onChange = (event) => {
        event.preventDefault();
        let temp = values.attacks;
        temp[event.target.name] = event.target.value;
        setValues({
            ...values,
            attacks: temp
        });
    }

    const handleFiles = (files) => {
        setValues({
            ...values,
            showModal: true
        });
        var reader = new FileReader();
        reader.onload = function(e) {
            let arr = reader.result.split("\n"); 
            // \r\n in windows \n in ubuntu
            let attackData = values.attacks;
            for(let i = 0; i < Object.keys(arr).length - 1; i++) {
                attackData.attackTimings.push({
                    startTime: arr[i].split(", ")[0], 
                    endTime: arr[i].split(", ")[1]
                });
            }
            setValues({
                ...values,
                attacks: attackData,
                showModal: false
            });
        }
        reader.readAsText(files[0]);
    }

    let userLogsTemp = [];
    let groupLogsTemp = [];

    const findOverlapTime = (s1, e1, s2, e2) => {
        if(parseInt(Date.parse(s2)) <= s1 && parseInt(Date.parse(e2)) <= s1) {
            return 0;
        } else if(parseInt(Date.parse(s2)) >= e1 && parseInt(Date.parse(e2)) >= e1) {
            return 0;
        } else if(parseInt(Date.parse(s2)) >= s1 && parseInt(Date.parse(e2)) <= e1) {
            return parseInt(Date.parse(e2)) - parseInt(Date.parse(s2));
        } else if(parseInt(Date.parse(s2)) <= s1 && parseInt(Date.parse(e2)) <= e1) {
            return parseInt(Date.parse(e2)) - s1;
        } else if(parseInt(Date.parse(s2)) >= s1 && parseInt(Date.parse(e2)) >= e1) {
            return e1 - parseInt(Date.parse(s2));
        } else {
            return e1 - s1;
        }
    }

    const addPenaltyForGroups = () => { 
        const users = {};
        for(let i = 0; i < values.attacks.attackTimings.length; i++) {
            groupLogsTemp[0].forEach(log => {
                const overlap = findOverlapTime(log.startTime, log.endTime, values.attacks.attackTimings[i].startTime, values.attacks.attackTimings[i].endTime);
                log.memberIDs.forEach(memberID => {
                    if(!users.hasOwnProperty(memberID)) {
                        users[memberID] = 0;
                    }
                    users[memberID] += parseInt(values.attacks.severity) * overlap;
                });
            });
            if(i === values.attacks.attackTimings.length - 1) {
                axios.post(`${constants.SERVER_URL}/stark/addpenalty`, {
                    params: {
                        users: users
                    }
                }).then((res) => {
                    if(res.data.success) {
                        setValues({
                            ...values,
                            showModal: true
                        });
                        window.location.reload();
                    } else {
                        alert('Some error occured');
                    }
                });
            }
        }
        console.log(users);
    }

    const addPenaltyForUsers = () => {
        const users = {};
        for(let i = 0; i < values.attacks.attackTimings.length; i++) {
            userLogsTemp[0].forEach(log => {
                if(!users.hasOwnProperty(log.ID)) {
                    users[log.ID] = 0;
                }
                users[log.ID] += parseInt(values.attacks.severity) * findOverlapTime(log.startTime, log.endTime, values.attacks.attackTimings[i].startTime, values.attacks.attackTimings[i].endTime);
            });
            if(i === values.attacks.attackTimings.length - 1) {
                axios.post(`${constants.SERVER_URL}/stark/addpenalty`, {
                    params: {
                        users: users
                    }
                }).then((res) => {
                    if(res.data.success) {
                        setValues({
                            ...values,
                            showModal: true
                        });
                        window.location.reload();
                    } else {
                        alert('Some error occured');
                    }
                });
            }
        }
    }


    const submitForm = (event) => {
        event.preventDefault();
        if(Object.keys(values.attacks.attackTimings).length === 0) {
            alert("Attack List cannot be empty");
        } else {
            axios.get(`${constants.SERVER_URL}/stark/getallgroup`,{
                params: {
                    email: 'admin'
                }
            }).then((res)=>{
                if(res.data.found) {
                    setValues({
                        ...values,
                        groupList: res.data.Object,
                    });
                    for(let i = 0; i < res.data.Object.length; i++) {
                        async function load() {
                            var web3 = new Web3(Web3.givenProvider || constants.localProvider);
                            const inUseContract = new web3.eth.Contract(constants.IN_USE_CONTRACT_ABI);
                            inUseContract.options.address = constants.IN_USE_CONTRACT_ADDRESS;
                            await inUseContract.methods.getLog(res.data.Object[i]._id)
                                .call((err, resp) => {
                                    groupLogsTemp.push(resp);
                                    if(i === res.data.Object.length - 1) {
                                        addPenaltyForGroups();
                                    }
                                });
                            }
                            load();          
                        };
                } else {
                    alert('Some Error Occurred');
                }
            }).catch((err)=>{
                alert("Some Error Occurred");
            });

            axios.get(`${constants.SERVER_URL}/stark/getalluser`,{
            }).then((res)=>{
                if(res.data.found) {
                    setValues({
                        ...values,
                        userList: res.data.Object,
                    });
                    for(let i = 0; i < res.data.Object.length; i++) { 
                        async function load() {
                            var web3 = new Web3(Web3.givenProvider || constants.localProvider);
                            const inUseContract = new web3.eth.Contract(constants.IN_USE_CONTRACT_ABI);
                            inUseContract.options.address = constants.IN_USE_CONTRACT_ADDRESS;
                            await inUseContract.methods.getLog(res.data.Object[i]._id)
                                .call((err, resp) => {
                                    userLogsTemp.push(resp);
                                    if(i === res.data.Object.length - 1) {
                                        addPenaltyForUsers();
                                    }
                                });
                            }
                            load();
                        };
                } else {
                    alert('Some Error Occurred');
                }
            }).catch((err)=>{
                alert("Some Error Occurred");
            });
        }
    }

    return (
        <>
            <Menubar/>
            <CustomModal show = {values.showModal} message = {"Uploading Attack...Please Wait"} title = {"Register Recent Attacks"}></CustomModal>
            <div className="containerx">
                <div className="row">
                    <div className="col-sm-2 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                            <div className="card-body p-4 p-sm-1">
                                <ProgressBar now={values.position / 2 * 100} style = {{marginBottom: '20px'}}/>
                                {values.position === 1? (
                                    <>
                                        <h5 className="card-title text-center mb-5 fw-light fs-5"><b>Attack Information</b></h5>
                                        <form>
                                            <div className="form-floating mb-3">
                                                <input type="text" className="form-control" id="floatingInput" placeholder="Seveirty of Attack" name = "severity" onChange = {onChange} value = {values.attacks.severity}></input>
                                                <label htmlFor="floatingInput">Severity</label>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <h5 className="card-title text-center mb-5 fw-light fs-5"><b>Confirm Details</b></h5>
                                        <Card style={{ width: '100%', marginBottom: '20px' }}>
                                            <Card.Body>
                                                <Card.Title>Severity : {values.attacks.severity}</Card.Title> 
                                            </Card.Body>
                                        </Card>
                                        
                                        <div style = {{marginBottom: '8px'}}>
                                            <label htmlFor="floatingPassword">Attack List</label>
                                            <br/>
                                            <ReactFileReader handleFiles={handleFiles} fileTypes={'.csv'}>
                                                <Button>Upload</Button>
                                            </ReactFileReader>
                                        </div>
                                        <div className="d-grid">
                                            <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit" style = {{marginBottom: '10px'}} onClick = {submitForm}>Set Up</button>
                                        </div>
                                    </>
                                )}
                                <Button variant="primary" disabled = {values.position === 1} style = {{marginRight: '10px', fontSize: '20px', marginBottom: '10px'}} onClick = {prevPage}>&#8592;</Button>
                                <Button variant="primary" disabled = {values.position === 2} style = {{fontSize: '20px', marginBottom: '10px'}} onClick = {nextPage}>&#8594;</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegisterAttackPage;
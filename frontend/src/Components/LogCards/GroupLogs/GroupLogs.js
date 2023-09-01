import { useState, useEffect } from 'react';
import { Card, Container } from 'react-bootstrap';
import constants from '../../../config';
import Web3 from 'web3';

const AdminGroupLogs = (props) => {

    const [values, setValues] = useState({
        logs: []
    });

    
    useEffect(() => {
        async function load() {
            var web3 = new Web3(Web3.givenProvider || constants.localProvider);
            const inUseContract = new web3.eth.Contract(constants.IN_USE_CONTRACT_ABI);
            inUseContract.options.address = constants.IN_USE_CONTRACT_ADDRESS;
            await inUseContract.methods.getLog(props.group._id)
                .call((err, res) => {
                    
                    setValues({
                        ...values, 
                        logs: res
                    })
                });
        }
        load();
    }, [props.group]);

    const getDate = (dt) => {
        let d = new Date(parseInt(dt));
        return d.toString();
    }

    const getMemberEmailString = (arr) => {
        let email = "";
        for(let i = 0; i < arr.length; i++) {
            if(i == 0) {
                email = email + " " + arr[i];
            } else {
                email = email + ", " + arr[i];
            }
        }
        return email;
    }

    return (
        <Card style={{ width: '100%' }}>
            <Card.Body style = {{display: 'block', width: '100%'}}>
                <Card.Title>{props.group.name}</Card.Title>
                <Card.Text>Member Usernames: {getMemberEmailString(props.group.memberUsernames)}</Card.Text>
                <Card.Text>Usage Logs</Card.Text>
                {
                    values.logs && values.logs.length !== 0? (values.logs.map((l) => {
                        return (
                            <Container style = {{backgroundColor: "pink", padding: "2px"}}>
                                <div>Group ID: {l.ID}</div>
                                <div>Service ID: {l.serviceID}</div>
                                <div>Start Time: {getDate(l.startTime)}</div>
                                <div>End Time: {getDate(l.endTime)}</div>
                            </Container>
                        );
                    })):(<></>)
                    
                }
            </Card.Body>
        </Card>
    );
}

export default AdminGroupLogs;
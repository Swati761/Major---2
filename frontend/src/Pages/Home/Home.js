import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import CardComponent from "../../Components/Card/Card";
import Menubar from "../../Components/Menubar/UserMenubar/UserMenubar";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import constants from "../../config";
import Web3 from 'web3';
import { Context } from "../../Context/context";
import { checkExpiredAccessToken } from "../../Utils/checkRefreshToken";
import { decodeToken } from "react-jwt";
import rsa from 'js-crypto-rsa';

const HomePage = (props) => {


    const uint8ToBase64 = (arr) => Buffer.from(arr).toString('base64');

    const encryptWithPublicKey = async(item) => {
        const res = await axios.get(`${constants.SERVER_URL}/stark/getuserkey`, {
            params: {
                username: context.username
            }
        });
        if(res.data.pubKey) {
            const itemEncrypted = await uint8ToBase64(await rsa.encrypt(
                new TextEncoder("utf-8").encode(item),
                JSON.parse(JSON.parse(res.data.pubKey)),
                'SHA-256'
            ));
            return itemEncrypted;
        }
    }

    const navigate = useNavigate();
    
    const [values, setValues] = useState({
        useService2Clicked : false,
        refreshTokenVerified: false,
        allGroupsWhereUserAdmin: [],
        onceCalled: false,
        currentGroupUsernames: [],
        loadCode: -1,
        selectedOption: '',
        allGroupsById: {},
        service1InUse: true,
        service2InUse: true,
        userLat: localStorage.getItem("latitude"),
        userLong: localStorage.getItem("longitude"),
        userIp: localStorage.getItem("ip"),
        service1Available: 0,
        service2Available: 0
    });

    const context = useContext(Context);

    if(!context.verified) {
        if(context.accessToken) {
            checkExpiredAccessToken(context, localStorage.getItem("accessToken"), localStorage.getItem("refreshToken"));
        } else {
            if(localStorage.getItem("accessToken")) {
                checkExpiredAccessToken(context, localStorage.getItem("accessToken"), localStorage.getItem("refreshToken"));
            } else {
                context.logoutUser();
            }
        }
    }

    useEffect(() => {
        axios.get(`${constants.SERVER_URL}/stark/getip `)
            .then((res) => {
                localStorage.setItem("ip", res.data.Object);
            })
            .catch((err) =>{
                console.log(err);
            });

        setValues({
            ...values,
            loadCode: 0
        })
        
    }, []);

    useEffect(() => {
        async function load() {
            var web3 = new Web3(Web3.givenProvider || constants.localProvider);
            const accounts = await web3.eth.requestAccounts();
            const inUseContract = new web3.eth.Contract(constants.IN_USE_CONTRACT_ABI);
            inUseContract.options.address = constants.IN_USE_CONTRACT_ADDRESS;
            const lat = await encryptWithPublicKey(values.userLat);
            const long = await encryptWithPublicKey(values.userLong);
            const ip = await encryptWithPublicKey(values.userIp);

            //console.log("IP:", ip, "LONG:", long, "LAT:", lat);
            
            if(values.loadCode === 0) {
                let res1, res2=true, res3, res4, res5;
                await inUseContract.methods.getService1( 
                    context.id,
                )
                .call((err, res) => {
                    if(err) {
                        alert("Some error occured");
                    } 
                    res1 = res;
                });
                await inUseContract.methods.isAllowed( 
                    context.id,
                    ip,
                    lat,
                    long
                )
                .call((err, res) => {
                    if(err) {
                        alert("Some error occured");
                    } 
                    res2 = res;
                });

                await inUseContract.methods.getService1Count().call((err, res) => {
                    res3 = res;
                });


                await inUseContract.methods.getService2Count().call((err, res) => {
                    res4 = res;
                });

                await inUseContract.methods.getService2(
                    context.id
                ).call((err, res) => {
                    res5 = res;
                    setValues({
                        ...values, 
                        service1InUse: values.service1InUse && res1 && !res2,
                        service2InUse: values.service2InUse && res5 && !res2,
                        service1Available: res3,
                        service2Available: res4
                    })
                })
                
            } else if(values.loadCode === 1) {
                setValues({
                    ...values, 
                    service1InUse: true
                });
                await inUseContract.methods.addService1( 
                    Date.now(),
                    context.id,
                    ip,
                    lat,
                    long
                )
                .send({
                    from: accounts[0]
                })
                .on('receipt', (receipt) => {
                    console.log(receipt);
                });

            } else if(values.loadCode === 2) {
                setValues({
                    ...values,
                    service2InUse: true
                })
                await inUseContract.methods.addService2( 
                    Date.now(), 
                    values.selectedOption,
                    context.id,
                    ip,
                    lat,
                    long
                )
                .send({
                    from: accounts[0]
                })
                .on('receipt', (receipt) => {
                    console.log(receipt);
                });
            } else if(values.loadCode === 4) {
                await inUseContract.methods.changeService1( 
                    context.id,
                    Date.now(),
                    [context.email],
                    1
                )
                .send({
                    from: accounts[0]
                })
                .on('receipt', (receipt) => {
                    console.log(receipt);
                    setValues({
                        ...values,
                        service1InUse: false
                    })
                });
            } else if(values.loadCode === 5) {
                await inUseContract.methods.getGroupFromService2(
                    context.id
                )
                .call((err, res) => {
                    
                    axios.get(`${constants.SERVER_URL}/stark/getgroupbyId`, {
                        params: {
                            id: res
                        }
                    }).then(async(res1) => {
                        await inUseContract.methods.changeService2( 
                            context.id,
                            Date.now(),
                            res1.data.Object.memberEmails,
                            2
                        )
                        .send({
                            from: accounts[0]
                        })
                        .on('receipt', (receipt) => {
                            console.log(receipt);
                            setValues({
                                ...values,
                                service2InUse: false
                            })
                        });
                    }).catch((err) =>{

                    });
                });
            }
        }
        load();
        
    }, [values.loadCode]);


    if(context.verified && !values.onceCalled && values.useService2Clicked) {
        axios.get(`${constants.SERVER_URL}/stark/getgroup`,{
            params: {
                adminUsername: decodeToken(localStorage.getItem(("accessToken"))).username
            }
        }).then((res)=>{
            if(res.data.found) {
                const allGroupsById = {};
                if(res.data.Object.length !== 0) {
                    for(let i = 0; i < res.data.Object.length; i++) {
                        allGroupsById[res.data.Object[i]._id] = res.data.Object[i];
                    }    
                }
                setValues({
                    ...values,
                    allGroupsWhereUserAdmin: res.data.Object,
                    allGroupsById: allGroupsById,
                    onceCalled: true,
                    selectedOption: res.data.Object.length !== 0? res.data.Object[0]._id : '',
                });
            } else {
                alert('Some Error Occurred');
            }
        }).catch((err)=>{
            alert(err);
        });
    }


    const useService1 = async () => {
        //blockchain
        setValues({
            ...values,
            loadCode: 1
        });
    }

    const useService2 = () => {
        setValues({
            ...values,
            useService2Clicked: !values.useService2Clicked,
        });
    }

    const stopUseService1 = () => {
        setValues({
            ...values,
            loadCode: 4
        });
    }

    const stopUseService2 = () => {
        setValues({
            ...values,
            loadCode: 5
        });
    }

    const submitDetails = () => {
        //send log in blockchain
        let currentGroupUsernames = [values.allGroupsById[values.selectedOption].adminUsername, ...values.allGroupsById[values.selectedOption].memberUsernames];
        setValues({
            ...values,
            useService2Clicked : false,
            loadCode: 2,
            currentGroupUsernames: currentGroupUsernames
        });
    }

    const manageGroups = () => {
        navigate('/manage-groups');
    }

    const handleChange = (event) => {
        setValues({
            ...values,
            selectedOption: event.target.value
        });
    }

    if(context.verified) {
        return (
            <>
            <Menubar/>
            <Container>
                <Row style = {{margin: "50px", marginLeft: "120px"}}>
                    <Col style={{alignContent: "center"}}>
                        <CardComponent title = "Service 1" text = "You can use this service individually" buttonText = "Use" showStats disableButton = {values.service1InUse} showStopButton img = "https://sopostech.com/assets/img/cloud-services.gif" click = {useService1} stopclick = {stopUseService1} serviceAvailable = {values.service1Available}/>
                    </Col>
                    <Col style={{alignContent: "center"}}>
                        <CardComponent title = "Service 2" text = "You can use this service in a group" buttonText = "Use" showStats disableButton = {values.service2InUse} showStopButton img = "https://singhdigitalhub.com/wp-content/uploads/2019/06/03.gif" click = {useService2} stopclick = {stopUseService2} serviceAvailable = {values.service2Available}/>
                        {values.useService2Clicked ? (
                            <Card style={{ width: '18rem', marginTop: "15px" }}>
                                {
                                    values.allGroupsWhereUserAdmin.length === 0?
                                    (<Card.Text><br></br>Nothing to Show</Card.Text>) :
                                    (<Form.Select aria-label="Default select example" onChange = {handleChange} value = {values.selectedOption}>
                                        {
                                            values.allGroupsWhereUserAdmin.map((group) => {    
                                                return (<option key = {group._id} value={group._id}>{group.name}</option>);
                                            })
                                            
                                        }
                                    </Form.Select>
                                    )
                                }
                                <Button onClick = {submitDetails} disabled = {values.allGroupsWhereUserAdmin.length === 0}>Use this Service</Button>
                            </Card>
                        ) : (<></>)}
                    </Col>
                    <Col style={{alignContent: "center"}}>
                        <CardComponent title = "Management" text = "Make your Groups" buttonText = "Manage Groups" img = "https://cdn.dribbble.com/users/836931/screenshots/2787289/interactive_ae-2_1.gif" click = {manageGroups}/>
                    </Col>
                </Row>
            </Container>
            </>
        );
    } else {
        return (<></>);
    }
}


export default HomePage;
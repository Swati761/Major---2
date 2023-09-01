import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import ProfileLogs from '../LogCards/ProfileLogs/ProfileLogs';
import { Button } from 'react-bootstrap';
import rsa from 'js-crypto-rsa';
import axios from 'axios';
import constants from '../../config';
import { storeInIndexedDB } from '../../Utils/storeInIndexedDB';
import UploadKeys from '../UploadKeys/UploadKeys';

const Profile = (props) => {

    const uint8ToBase64 = (arr) => Buffer.from(arr).toString('base64');
    
    const updateKeys = async() => {
        const key = await rsa.generateKey(2048);
        const res = await axios.put(`${constants.SERVER_URL}/stark/updateUser`,{
            id: props.user._id,
            username: props.user.username, 
            name: uint8ToBase64(await rsa.encrypt(
                new TextEncoder("utf-8").encode(props.user.name),
                key.publicKey,
                'SHA-256',
            )),
            email: uint8ToBase64(await rsa.encrypt(
                new TextEncoder("utf-8").encode(props.user.email),
                key.publicKey,
                'SHA-256',
            )),
            phoneNumber: uint8ToBase64(await rsa.encrypt(
                new TextEncoder("utf-8").encode(props.user.phoneNumber),
                key.publicKey,
               'SHA-256',
            )),
            pubKey: JSON.stringify(key.publicKey), 
        });
        if(res.data.ok) {
            await storeInIndexedDB(props.user.username, JSON.stringify(key.privateKey));
            alert('Keys Updated');
            window.location.reload();
        }
    }

    return (
            <>
            <div className="gradient-custom-2">
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                <MDBCol lg="9" xl="7">
                    <MDBCard>
                    <MDBCardBody className="text-black p-4">
                        <div className="mb-5">
                        <p className="lead fw-normal mb-1">About</p>
                        <div className="p-4" style={{ backgroundColor: '#fff' }}>
                            <MDBCardText className="font-italic mb-1">Name: {props.user.name}</MDBCardText>
                            <MDBCardText className="font-italic mb-1">Username: {props.user.username}</MDBCardText>
                            <MDBCardText className="font-italic mb-1">Email: {props.user.email}</MDBCardText>
                            <MDBCardText className="font-italic mb-1">Phone Number: {props.user.phoneNumber}</MDBCardText>
                        </div>
                        <Button onClick={updateKeys} style = {{marginBottom: "50px"}}>UPDATE KEYS</Button>
                        <UploadKeys/>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                        <MDBCardText className="lead fw-normal mb-0">Transactions</MDBCardText>
                        </div>
                        <ProfileLogs user = {props.user}/>
                    </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                </MDBRow>
            </MDBContainer>
            </div>
            </>
    );
}


export default Profile;
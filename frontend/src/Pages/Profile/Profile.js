import { useState, useEffect, useContext } from "react";
import Menubar from "../../Components/Menubar/UserMenubar/UserMenubar";
import axios from 'axios';
import constants from "../../config";
import { Context } from "../../Context/context";
import { checkExpiredAccessToken } from "../../Utils/checkRefreshToken";
import rsa from 'js-crypto-rsa';
import Profile from "../../Components/Profile/Profile";
import { getFromIndexedDB } from "../../Utils/getFromIndexedDB";

const ProfilePage = () => {

    const [ values, setValues ] = useState({
        user: ''
    });
    const base64ToUint8 = (str) => Buffer.from(str, 'base64'); 

    const decryptWithPrivateKey = async(username, item) => {
        const pvtKey = await getFromIndexedDB(username);
        
        if(pvtKey && pvtKey.value) {
            const itemDecrypted = await rsa.decrypt(
                base64ToUint8(item),
                JSON.parse(pvtKey.value),
                'SHA-256',
            );
            return Buffer.from(itemDecrypted.buffer).toString();
        } else {
            return item;
        }
    }

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
        if(context.id) {
            axios.get(`${constants.SERVER_URL}/stark/getUser`, {
                params: {
                    id: ""+context.id
                }
            }).then(async(res) => {
                const currentUser = res.data.Object;
                currentUser.name = await decryptWithPrivateKey(currentUser.username, currentUser.name);
                currentUser.phoneNumber = await decryptWithPrivateKey(currentUser.username, currentUser.phoneNumber);;
                currentUser.email = await decryptWithPrivateKey(currentUser.username, currentUser.email);;
                setValues({
                    ...values,
                    user: currentUser
                });
            })
            .catch((err) =>{
                console.log(err);
            });
        }
        
    }, [context.id]);
    
    if(context.verified) {
        return (
            <>
            <Menubar/>
            {
                values.user? (<Profile user = {values.user}/>) : (<></>)
            }
            </>
        );
    } else {
        return (<></>);
    }
}


export default ProfilePage;
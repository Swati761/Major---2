import { useState } from 'react';
import { Button } from 'react-bootstrap';
import ReactFileReader from 'react-file-reader';
import CustomModal from '../../Modal/Modal';
import { storeInIndexedDB } from '../../Utils/storeInIndexedDB';

const UploadKeys = () => {

    const [ values, setValues ] = useState({
        showModal: false
    });

    const handleFiles = (files) => {
        setValues({
            ...values,
            showModal: true
        });
        var reader = new FileReader();
        reader.onload = async function(e) {
            const obj = JSON.parse(reader.result);
            await storeInIndexedDB(obj.id, obj.value);
            window.location.reload();
        }
        reader.readAsText(files[0]);
    }

    return (
        <>
            <CustomModal show = {values.showModal} message = {"Reading Files...Please Wait"} title = {"Upload Keys"}></CustomModal>
            <ReactFileReader handleFiles={handleFiles} fileTypes={'.txt'}>
                <Button>UPLOAD KEYS (if changed machines)</Button>
            </ReactFileReader>
        </>
    );
}

export default UploadKeys;
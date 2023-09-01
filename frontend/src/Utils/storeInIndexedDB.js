import Dexie from 'dexie';
import axios from 'axios';
import fileDownload from 'js-file-download';

export const storeInIndexedDB = async(key, sensitiveData) => {
    const db = new Dexie('KeyDistribution');
    db.version(1).stores(
        {keyDistribution : 'id, value' }
    );
    await db.keyDistribution.put({ id: key, value: sensitiveData });
    const filedata = {"id": key, "value": sensitiveData};
    const blob = new Blob([JSON.stringify(filedata)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    console.log(url);
    const res = await axios.get(url, {
        responseType: 'blob',
    });
    await fileDownload(res.data, `${key}.txt`);
    URL.revokeObjectURL(url);
}
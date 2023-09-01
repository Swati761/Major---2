import Dexie from 'dexie';

export const getFromIndexedDB = async(key) => {
    const db = new Dexie('KeyDistribution');
    db.version(1).stores(
        {keyDistribution : 'id, value' }
    );
    const value = await db.keyDistribution.get(key);
    return value;
}
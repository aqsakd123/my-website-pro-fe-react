import {db, firebase} from "../firebase";

export const addDocument = async (collection, data) => {
    const query = db.collection(collection);
    await query.add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
};

export const editDocument = async (collection, collectionUID, data) => {
    const query = db.collection(collection).doc(collectionUID);
    await query.set({
        ...data,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, {merge: true}).catch(r => console.log(r));
};


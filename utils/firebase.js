import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };


export async function saveLink(projectName, projectDescription, accessLink, githubLink, other_links, files) {

    try {

        // replace all the spaces with hyphens in projectName
        let projectNameUuid = projectName.replace(/\s+/g, '-');
        // replace all the special characters with hyphens in projectName
        projectNameUuid = projectNameUuid.replace(/[^a-zA-Z0-9-]/g, '-');

        let list_of_files = await uploadFiles(projectNameUuid, files);

        const docRef = await addDoc(collection(db, "projects"), {
            "projectName": projectName,
            "projectNameUuid": projectNameUuid,
            "projectDescription": projectDescription,
            "accessLink": accessLink,
            "githubLink": githubLink,
            "other_links": other_links,
            "files": list_of_files,
            "createdAt": new Date().toISOString(),
            "updatedAt": new Date().toISOString()
        });
        console.log("Document written with ID: ", docRef.id);
        return true;
    } catch (error) {
        console.error("Error adding document: ", error);
        return false;
    }

}
export async function uploadFiles(projectName, files) {
    // Implement the logic to upload the files to Firebase Storage and return the URLs
    return [];
    // try {
    //     if (files.length === 0) {
    //         return [];
    //     }
    //     const storage = getStorage(app);
    //     const storageRef = ref(storage, `projects/${projectName}/`);
    //     const fileUrls = [];
    //     for (const file of files) {
    //         const fileRef = ref(storageRef, file.name);
    //         await uploadBytes(fileRef, file);
    //         const url = await getDownloadURL(fileRef);
    //         fileUrls.push(url);
    //     }
    //     return fileUrls;
    // } catch (error) {
    //     console.error("Error uploading files: ", error);
    //     return [];
    // }
}


export async function fetchProjects() {
    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const data = [];
        querySnapshot.forEach((doc) =>
            data.push({ id: doc.id, ...doc.data() })
        );
        return data;
    }
    catch (error) {
        console.error("Error fetching projects: ", error);
        return [];
    }
}
//Var 
 let eventobj = {
 }
 let date = ""
 let plansevent = [];
 

// For Firebase JS SDK v7.20.0 and later, measurementId is optional


import { initializeApp } from 'firebase/app'
import { getFirestore , collection, getDocs,addDoc,onSnapshot,
   query, orderBy,doc,deleteDoc,updateDoc } from 'firebase/firestore'

const firebaseConfig = {
   apiKey: "AIzaSyAWAohZ19uR7XH9CI11UD__cH9OQ_MAfZ4",
   authDomain: "dailyplanner-2748e.firebaseapp.com",
   projectId: "dailyplanner-2748e",
   storageBucket: "dailyplanner-2748e.appspot.com",
   messagingSenderId: "220761301594",
   appId: "1:220761301594:web:dd518ba8b9c4d2b329ae63",
   measurementId: "G-9V8HN3SJQ5"
 };

  initializeApp(firebaseConfig)

  const db = getFirestore()
//creating a colRef
  function createcolRef(condate){
   return  collection(db,condate)
  }
//creating a docref
function createDocRef(condate,ID){

   return doc(db,condate,ID);
}
  ///setting the data value of the object for a plan 
  export function setdata(frmdate, frmcompleted,frmevent,frmFinishingT,frmstartingT){
    
    eventobj =  {
      completed : frmcompleted ,
      event : frmevent,
      finishingT : frmFinishingT ,
      startingT : frmstartingT
    }

    date= frmdate
    
  }

  // adding a new record
  export async function addnewrecord() {
    try {
        let colRef = createcolRef(date);
        await addDoc(colRef, eventobj);

        const btnadd = document.getElementById("btnadd");
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
        console.error("Error adding record:", error);
    }
}
//getting the docs from the DM
export async function display(frmdate){
  try{ 
    plansevent = [] ;
    const q = query(createcolRef(frmdate),orderBy("startingT"))
    const snapshot = await getDocs(q);
    if (snapshot.size > 0 ){
      snapshot.docs.forEach((doc)=>{
        plansevent.push({...doc.data(), id: doc.id});
      });
   return(plansevent)
    } else {
      return plansevent
    }

       
    } catch(err){
    console.log(err)
    }
   
}
//deleting from my database 
export async function deleteplan(collection, ID) {
try{
    await deleteDoc(createDocRef(collection,ID));
    return await display(collection)
  } catch(err){
      console.log(err)
    }

}  
//updating the database 
export async function updateplan(frmdate,frmevent,frmstartingT,frmFinishingT,ID){
 try{
  console.log(ID)
  await updateDoc(createDocRef(frmdate,ID) ,{
    event : frmevent,
    finishingT : frmFinishingT ,
    startingT : frmstartingT
  })
  return await display(frmdate)
}catch(err){
console.log(err)

}

 
}
  





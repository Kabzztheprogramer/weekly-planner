//The basic maintenance/setup of the page 

//geting items from HTML 
const schedulediv = document.getElementById("schedulediv")
const scheduledul = document.getElementById("Dayplanul")
//To make the list scrollable with out having the scrollbar there
//schedulediv.scrollTop = 0 ;
schedulediv.addEventListener('wheel',function(e){
    this.scrollTop += e.deltaY;
    e.preventDefault();
})

//add the tick to the checkbox
function togglechebox(checkbox){
    checkbox.classList.toggle('Checked')
}

//creating the check box for when you done events("to check the check box ")
function createcheckbox (){
    const statuscbx = document.createElement("div")
    statuscbx.classList.add("myCheckbox")
    statuscbx.onclick= function()
    {
        togglechebox(statuscbx)
    }
 return statuscbx
}

//////////////////////////////////////////////////////////////////////////////
//Importing function and setting up variables 

///Importing Database function
import { setdata , addnewrecord , display } from "./index.js"

//Js vars
let arrplans = []
let currentID = ""

//////////////////////////////////////////////////////////////////////////////

//Page functionality 


//A code to change the active button when the page is opened 
const btnactivepage =  document.getElementById("IChome")
btnactivepage.style.padding = "4px";
btnactivepage.style.borderBottom ="#d08e63 solid 4px" ;
btnactivepage.style.borderRadius = "30%";

//geting time and date 
function format(item){
    if (item < 10 ) {
        return '0'+item
    }
}
//Get the current date
function getdate(){
    const  currentDate = new Date();
    let cyear = currentDate.getFullYear() 
    let cmonth = funints(currentDate.getMonth() +1) 
    let cday = funints(currentDate.getDate())
    let fulldate = cyear +'-'+ cmonth+'-'+  cday
    return fulldate
}
//Getting the current time 
function gettime(){
    const  currentDate = new Date();
    let chours = funints(currentDate.getHours())
    let cminutes = funints(currentDate.getMinutes())
    let fulltime = chours+":"+cminutes
    return fulltime
}
console.log(getdate())
console.log(gettime())

//Formating units(1>>01)
function funints(num){
    if (num < 10){
        return "0"+num
    } else return (num)
}
//Get the current & schedule displaying it

async function CScheduleDisplay(){
arrplans = await display(getdate());
if(arrplans.length === 0){
  console.log("nothing")
} else {
    for (let i = 0 ;i < arrplans.length ; i++){
        let planobj= arrplans[i];
        if (planobj.startingT <= gettime() && planobj.finishingT >= gettime()){
            console.log("we are here ")
            let Tduration = `From ${planobj.startingT} to ${planobj.finishingT}`
            setcurrentplan(planobj.event,Tduration)
        }
        setplan(
            `${planobj.startingT} ${planobj.finishingT}`,planobj.event,planobj.completed)
    }
}
}
//Getting the current plan :
function setcurrentplan(pevent,duration ){
    const Currentdiv = document.getElementById("Currenttab")
    const eventlbl = document.createElement("label")
    const durationlbl = document.createElement("label")
    eventlbl.textContent= pevent
    durationlbl.textContent = duration
    Currentdiv.append(eventlbl,durationlbl)
}

CScheduleDisplay()



/*datepicker.addEventListener("change",async (e)=>
{
    e.preventDefault()
    arrplans = await display(datepicker.value);
    if (arrplans.length === 0){
        const itemmessage = document.createElement("li");
        itemmessage.classList.add("lblmessage");
        itemmessage.textContent= 'NO SCHEDULE HAS BEEN ADD FOR THIS DAY ';
        scheduleul.textContent=''
        scheduleul.append(itemmessage)
        
    } else{ 
     displaytofrm()}
    
})*/

//Displays the plan to the list 
async function setplan(duration,pevent,Astatus) { 
    //getting the elements 
    const planli = document.createElement("li")
    const durationlbl = document.createElement("label")
    const eventlbl = document.createElement("label")
    const checkbox = createcheckbox()
    
    //setting the class's of the elemets 
    durationlbl.classList.add("lbltime")
    eventlbl.classList.add("lblevent")
    durationlbl.textContent = duration 
    eventlbl.textContent = pevent 

    if (Astatus === true){
       togglechebox(checkbox)
    }

    planli.append(durationlbl , eventlbl ,checkbox)
    
    scheduledul.append(planli)

}


const btneditdbm = document.getElementById("addpageIC")

btneditdbm .addEventListener("click",()=>{
    btnactivepage.style.border = "none" ;
    window.location.href = 'dayplan.html';
    
} )





//a code for when the page opens
const btnactivepage =  document.getElementById("addpageIC")

btnactivepage.style.padding = "4px";
btnactivepage.style.borderBottom ="#d08e63 solid 6px" ;
btnactivepage.style.borderRadius = "30%";
//add the database tool to the database 
import { setdata , addnewrecord , display ,deleteplan,updateplan} from "./index.js"


//Form elements 
const datepicker = document.getElementById("datepicker")
const frminput = document.querySelector(".inforinputs")
const scheduleul = document.getElementById("scheduleul")
const schedulediv = document.getElementById("schedulediv")
const btnadd = document.getElementById("btnadd")


//Js vars
let arrplans = []
let currentID = ""

//To make the list scrollable with out having the scrollbar there need to study this

let isDragging = false;
let startX;
let scrollLeft;

schedulediv.style.cursor = 'grab';

schedulediv.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - schedulediv.offsetLeft;
    scrollLeft = schedulediv.scrollLeft;
    schedulediv.style.cursor = 'grabbing';
});

schedulediv.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = e.pageX - schedulediv.offsetLeft;
    const walk = x - startX;
    schedulediv.scrollLeft = scrollLeft - walk;
});

schedulediv.addEventListener('mouseup', () => {
    isDragging = false;
    schedulediv.style.cursor = 'grab';
});
//adding displaying a list on change 

datepicker.addEventListener("change",async (e)=>
{
    e.preventDefault()
    arrplans = await display(datepicker.value);
    if (arrplans.length === 0){
        const itemmessage = document.createElement("li");
        itemmessage.classList.add("lblmessage");
        itemmessage.textContent= 'NO SCHEDULE HAS BEEN ADDED FOR THIS DAY ';
        scheduleul.textContent=''
        scheduleul.append(itemmessage)
        
    } else{ 
     displaytofrm()}
    
})


frminput.addEventListener("click",async (e)=>
{    e.preventDefault()
    
  
    let dateval = datepicker.value;
    if (e.target.classList.contains("Bluebtn")){
    //adding  to the database then updating the list 
    let  verifed = await verification()
    if (verifed === true){
        console.log(verifed)
     setdata(
        dateval ,
        false,
        frminput.Inpevent.value, 
        frminput.ftime.value,
        frminput.stime.value,
        
        )
    addnewrecord()
    frminput.reset()
    datepicker.value = dateval
    arrplans = await display(dateval)
    displaytofrm()
    await completed("Bluebtn")}
    
   }else if (e.target.classList.contains("Brownbtn")){
        //Calling the Updating doc function 
        frmupdateDoc(dateval,currentID)
        btnadd.classList.remove("Brownbtn");
        await completed("Brownbtn")
    } 
    
})

//Updating a doc to the database 
async  function frmupdateDoc(date,id){
    arrplans=[]
        arrplans=  await updateplan(date,frminput.Inpevent.value, 
            frminput.stime.value,frminput.ftime.value,id)
            displaytofrm()

}

let btndisplay = document.getElementById("display")
//display button 
btndisplay.addEventListener("click",async ()=>{
    arrplans = await display(datepicker.value)
    displaytofrm()
})


function displaytofrm(){
scheduleul.innerHTML= '';
    for(let i = 0 ; i < arrplans.length ; i++){
        let planobj = arrplans[i] 
        //creating elements that will display in the list 
        const scheduleli = document.createElement("li");
        const labeldiv = document.createElement("div");
        const lbltime = document.createElement("label");
        const lblevent = document.createElement("label");
        const btnedit = document.createElement("button");
        const btndelete = document.createElement("button");

        // Giving the elements there properties
        labeldiv.classList.add("labeldiv");
        lbltime.classList.add("pagelabels");
        lblevent.classList.add("lblheadings");
        btnedit.classList.add("Brownbtn");
        btndelete.classList.add("Bluebtn");

        // Giving the elements there value 
        lbltime.textContent = `${planobj.startingT} to  ${planobj.finishingT}`;
        lblevent.textContent = planobj.event ;
        labeldiv.append(lblevent , lbltime)
        btndelete.textContent="DELETE"
        btnedit.textContent = "EDIT"
        scheduleli.append(labeldiv,btnedit,btndelete) //`${labeldiv} ${btnedit} ${btndelete}`
        scheduleli.id = planobj.id 
        scheduleul.append(scheduleli) 

       
    }




}

//deleting a button 

document.addEventListener("DOMContentLoaded", function() {


 scheduleul.addEventListener("click", async function(e){
       
        //deleting from the database
    if (e.target.classList.contains("Bluebtn")){
        let confirmation = window.confirm("Are you sure you want to delete the plan")
        if (confirmation){
        arrplans= []
        e.preventDefault()
        const listitem  = e.target.closest('li')
        arrplans = await deleteplan(datepicker.value,listitem.id)
        displaytofrm()
     }
    } else if (e.target.classList.contains("Brownbtn")){
        //editing from the database 
        e.preventDefault()
        const Elistitem  = e.target.closest('li')
        for (let i = 0 ; i < arrplans.length;i++){
            let planobj = arrplans[i]
            if (planobj.id === Elistitem.id){
            loadval(planobj.event , planobj.startingT ,planobj.finishingT) ;  
            btnadd.classList.remove("Bluebtn");
            btnadd.classList.add("Brownbtn");
            currentID= planobj.id  ;
            btnadd.textContent = "UPDATE"

            }
        }
        
    }

 })

});

///Displaying the value in the inputs 
function loadval(event,startingT,finishingT){

    frminput.addEventListener("loadevent",(e)=>
    {
        e.preventDefault();
        frminput.Inpevent.value = event;
        frminput.ftime.value = finishingT ;
        frminput.stime.value = startingT ;
    })
    frminput.dispatchEvent(new Event("loadevent"));
}

//geting elements from the html page
const Inpevent = document.getElementById("Ineevent");
const stime  = document.getElementById("fromt") ;
const ftime  = document.getElementById("Tillt") ;
///verification of the entered detials
async function  verification(){

     
        let errevent = false;
        let errdate = false;
        let errstartingT = false;
        let errfinishingT = false;
        if (Inpevent.value === "" ){
            errevent = true
            Inpevent.value = "Add an event"
            Inpevent.style.color= "#FF0000"
            setTimeout((e) => {
                Inpevent.value =""
                Inpevent.placeholder ="Work Out"
                Inpevent.style.color= "black"
            }, 2000);
        }
        if (stime.value === ""){
            errstartingT = true
            stime.style.color= "#FF0000";
              setTimeout((e) => {  
            stime.style.color= "black";
            }, 2000);
        }
        if (ftime.value === ""){
            errfinishingT =true
            ftime.style.color= "#FF0000";
            setTimeout((e) => {  
                ftime.style.color= "black";
                }, 2000);
        }
        if (datepicker.value === ""){
            datepicker.style.color= "#FF0000";
            errdate = true
            setTimeout((e) => {
            datepicker.style.color= "black"
            }, 2000); 
        }

        if (!errdate && !errevent  && !errstartingT && !errfinishingT ){
            console.log("all goood")
            return true
        } else {
            return false
        }
        
}

async function completed(btnclass){

    // getting the imagesetting
    const imgtick = document.createElement("img")
    imgtick.src="tick.png"
    imgtick.classList.add("growing")

    btnadd.classList.remove(btnclass)
    btnadd.textContent =''
    btnadd.classList.add("tickcom")

    btnadd.append(imgtick)

    setTimeout(()=>{
        btnadd.classList.remove("tickcom")
        btnadd.classList.add("Bluebtn");
        btnadd.textContent ="ADD PLAN"
    },1500)

   
}

const btnhomepage = document.getElementById("IChome")

btnhomepage.addEventListener("click",()=>{
    btnactivepage.style.border = "none" ;
    window.location.href = 'homepage.html'
    
})
console.log("Start");

const stundenplanTable = document.querySelector("#stundenplan");
console.log(stundenplanTable);
const stundenplanInnerTable = stundenplanTable.querySelectorAll("table tr")[2];
console.log(stundenplanInnerTable);

const tageContainer = stundenplanInnerTable.querySelectorAll("td");
console.log(tageContainer);

const containerMo = tageContainer[0];
const containerDi = tageContainer[1];
const containerMi = tageContainer[2];
const containerDo = tageContainer[3];
const containerFr = tageContainer[4];
const containerSa = tageContainer[5];

let data = {};
let termine = [];
let faecher = [];

function getTermine(container, tag){
    container.innerText.split("\n\n").forEach((element)=>{
        if(element === "")return;
        let infos = element.split("\n");
        let termin = {
            tag:    tag,
            time:   infos[0],
            dozent: infos[1],
            raum:   infos[2],
            fach:   infos[3]
        };
        if(termin.raum === undefined){
            termin.fach = termin.dozent;
            termin.raum = termin.time;
            termin.time = "";
            termin.dozent = "";
        }else if(termin.fach === undefined){
            termin.fach = termin.raum;
            termin.raum = termin.dozent;
            termin.dozent = "";
        }
        termine.push(termin);
    });
    container.style.display = "none";
}

function printTermine(){
    let newStundenplan = document.createElement("div");

    
    let newStundenplan_mo = document.createElement("div");
    let newStundenplan_di = document.createElement("div");
    let newStundenplan_mi = document.createElement("div");
    let newStundenplan_do = document.createElement("div");
    let newStundenplan_fr = document.createElement("div");
    let newStundenplan_sa = document.createElement("div");

    newStundenplan_mo.id = "stundenplan-mo";
    newStundenplan_di.id = "stundenplan-di";
    newStundenplan_mi.id = "stundenplan-mi";
    newStundenplan_do.id = "stundenplan-do";
    newStundenplan_fr.id = "stundenplan-fr";
    newStundenplan_sa.id = "stundenplan-sa";

    newStundenplan_mo.style = "display:inline-block; flex:1; position:relative;";
    newStundenplan_di.style = "display:inline-block; flex:1; position:relative;";
    newStundenplan_mi.style = "display:inline-block; flex:1; position:relative;";
    newStundenplan_do.style = "display:inline-block; flex:1; position:relative;";
    newStundenplan_fr.style = "display:inline-block; flex:1; position:relative;";
    newStundenplan_sa.style = "display:inline-block; flex:1; position:relative;";

    newStundenplan.append(newStundenplan_mo);
    newStundenplan.append(newStundenplan_di);
    newStundenplan.append(newStundenplan_mi);
    newStundenplan.append(newStundenplan_do);
    newStundenplan.append(newStundenplan_fr);
    newStundenplan.append(newStundenplan_sa);

    newStundenplan.style =  "display: flex;" +
                            "min-height: 400px;" + 
                            "height: 50vh";

    stundenplanTable.append(newStundenplan);

    for (const termin of termine) {

        let terminDiv = document.createElement("div");
        terminDiv.append(termin.time);
        terminDiv.append(document.createElement("br"));
        terminDiv.append(termin.fach + " " + termin.raum);
        terminDiv.append(document.createElement("br"));
        terminDiv.append(termin.dozent);


        let fachSimple = termin.fach.split(" ")[0];
        terminDiv.classList.add(fachSimple);
        if(!faecher.includes(fachSimple)){
            faecher.push(fachSimple);
        }

        let timeSplit = termin.time.split("-");

        terminDiv.style =   "position:absolute;" +
                            "top:" + map(timeSplit[0]) + "%;" +
                            "bottom:" + (100 - map(timeSplit[1])) + "%;" +
                            "width: 100%;" +
                            "padding: 2px 5px;" +
                            "overflow: hidden;" +
                            "background: " + getBgColor(fachSimple) + ";" +
                            "color: " + getColor(fachSimple) + ";" +
                            "border: none;";


        document.getElementById("stundenplan-" + termin.tag).append(terminDiv);
    }

}

function getBgColor(fach){
    if(data[fach] == undefined){
        return "none";
    }else{
        return data[fach].bgColor;
    }
}

function getColor(fach){
    if(data[fach] == undefined){
        return "none";
    }else{
        return data[fach].color;
    }
}

function map(value){
    let maxValue = 17;
    let minValue = 8;
    let scale = (100/(maxValue- minValue));
    return (value - minValue) * scale;
}

getTermine(containerMo, "mo");
getTermine(containerDi, "di");
getTermine(containerMi, "mi");
getTermine(containerDo, "do");
getTermine(containerFr, "fr");
getTermine(containerSa, "sa");

console.log(termine);
printTermine();

function handleResponse(pData) {
    data = pData;
    console.log(data);

    for (const fach of faecher) {
        let divs = document.querySelectorAll("." + fach);
        for (const div of divs) {
            div.style.background = getBgColor(fach);
            div.style.color = getColor(fach);
            console.log(div);
        }
    }

}

function handleError(error) {
    console.log(`Error: ${error}`);
}

function sendMessage(msg) {
    const sending = browser.runtime.sendMessage({
        type: "get-fach-data",
        faecher: msg
    });
    sending.then(handleResponse, handleError);
}

for (const fach of faecher) {
    console.log(fach);
}

sendMessage(faecher);
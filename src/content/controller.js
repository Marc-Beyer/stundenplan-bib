let data = {};
let termine = [];
let faecher = [];

const stundenplanTable = document.querySelector("#stundenplan");

if(stundenplanTable){
    const stundenplanInnerTable = stundenplanTable.querySelectorAll("table tr")[2];
    const tageContainer = stundenplanInnerTable.querySelectorAll("td");

    const containerMo = tageContainer[0];
    const containerDi = tageContainer[1];
    const containerMi = tageContainer[2];
    const containerDo = tageContainer[3];
    const containerFr = tageContainer[4];
    const containerSa = tageContainer[5];

    getTermine(containerMo, "mo");
    getTermine(containerDi, "di");
    getTermine(containerMi, "mi");
    getTermine(containerDo, "do");
    getTermine(containerFr, "fr");
    getTermine(containerSa, "sa");

    (function addOldBtn(){
        let oldBtn = document.createElement("button");
        oldBtn.append("old");
        oldBtn.addEventListener("click", (e) => {
            e.preventDefault();

            let newStundenplan = document.getElementById("new-stundenplan");

            if(newStundenplan.style.display === "flex"){
                for (let index = 0; index < 6; index++) {
                    const element = tageContainer[index];
                    element.style.display = "";
                }
                newStundenplan.style.display = "none";
            }else{
                for (let index = 0; index < 6; index++) {
                    const element = tageContainer[index];
                    element.style.display = "none";
                }
                newStundenplan.style.display = "flex";
            }
            
        });
        stundenplanTable.insertAdjacentElement("afterbegin", oldBtn);
    })();

    (function printTermine(){
        document.querySelector("#stundenplan table").style.minWidth = "602px";

        let newStundenplan = document.createElement("table");
        newStundenplan.id = "new-stundenplan";

        let newStundenplan_mo = document.createElement("td");
        let newStundenplan_di = document.createElement("td");
        let newStundenplan_mi = document.createElement("td");
        let newStundenplan_do = document.createElement("td");
        let newStundenplan_fr = document.createElement("td");
        let newStundenplan_sa = document.createElement("td");

        newStundenplan_mo.id = "stundenplan-mo";
        newStundenplan_di.id = "stundenplan-di";
        newStundenplan_mi.id = "stundenplan-mi";
        newStundenplan_do.id = "stundenplan-do";
        newStundenplan_fr.id = "stundenplan-fr";
        newStundenplan_sa.id = "stundenplan-sa";

        newStundenplan_mo.style = "display:inline-block; flex:1; position:relative; border-right: 2px solid white;";
        newStundenplan_di.style = "display:inline-block; flex:1; position:relative; border-right: 2px solid white;";
        newStundenplan_mi.style = "display:inline-block; flex:1; position:relative; border-right: 2px solid white;";
        newStundenplan_do.style = "display:inline-block; flex:1; position:relative; border-right: 2px solid white;";
        newStundenplan_fr.style = "display:inline-block; flex:1; position:relative; border-right: 2px solid white;";
        newStundenplan_sa.style = "display:inline-block; flex:1; position:relative; border-right: 2px solid white;";

        newStundenplan.append(newStundenplan_mo);
        newStundenplan.append(newStundenplan_di);
        newStundenplan.append(newStundenplan_mi);
        newStundenplan.append(newStundenplan_do);
        newStundenplan.append(newStundenplan_fr);
        newStundenplan.append(newStundenplan_sa);

        newStundenplan.style =  "display: flex;" +
                                "min-height: 500px;" + 
                                "height: 50vh;" +
                                "min-width: 602px;";

        stundenplanTable.append(newStundenplan);

        for (const termin of termine) {

            let terminDiv = document.createElement("div");
            terminDiv.append(termin.time);
            terminDiv.append(document.createElement("br"));
            terminDiv.append(termin.fach);
            terminDiv.append(document.createElement("br"));
            let span = document.createElement("span");
            span.append(termin.raum)
            span.style = "font-weight: bold;";
            terminDiv.append(span);
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

            terminDiv.hidden = getIsBlocked(fachSimple);

            document.getElementById("stundenplan-" + termin.tag).append(terminDiv);
        }

    })();

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

    function setNewData(newData) {
        data = newData;

        for (const fach of faecher) {
            let divs = document.getElementsByClassName(fach);
            for (const div of divs) {
                div.style.background = getBgColor(fach);
                div.style.color = getColor(fach);
                
                div.hidden = getIsBlocked(fach);
            }
        }

    }

    /**
     * MESSAGES
     */

    browser.runtime.onMessage.addListener((msg) => {
        switch (msg.type) {
            case "all-data":
                setNewData(msg.data);
                break;
        }
    });

    function sendMessage(msg) {
        browser.runtime.sendMessage(msg).catch((err) => {
            console.log(err);
        });
    }
    
    function createGetDataMsg(faecher) {
        if (faecher) {
            return {
                type: "get-fach-data",
                faecher
            };
        }
        return {
            type: "get-fach-data",
        };
    }
    
    sendMessage(createGetDataMsg(faecher));
}
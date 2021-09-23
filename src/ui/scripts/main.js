let faecherTable = document.querySelector("#faecher tbody");
let addBtn = document.querySelector("#add-btn");
let addInput = document.querySelector("#add-panel input");
let standardBgColor = document.querySelector("#standard-bg-color");
let standardColor = document.querySelector("#standard-font-color");

let data = {};

function changestandardColor() {
    sendMsg(createChangeValuesDataMsg(standardBgColor.value, standardColor.value));
}

standardBgColor.addEventListener("change", changestandardColor);
standardColor.addEventListener("change", changestandardColor);

addBtn.addEventListener("click", (e) => {
    sendMsg(createGetDataMsg(addInput.value));
    addInput.value = "";
});

function changeFachEventHandler(element, colorInp, bgColorInp, checkBox) {
    sendMsg(createChangeDataMsg(
        element.name,
        colorInp.value,
        bgColorInp.value,
        !checkBox.checked
    ));
}

async function removeFach(tableRow, element) {
    await tableRow.animate(
        [{ transform: "translateX(0px)" }, { transform: "translateX(-800px)" }],
        {
            duration: 250,
        }
    ).finished;

    sendMsg(createDeleteDataMsg(element.name));
}

function appendWithTd(tableRow, element) {
    let td = document.createElement("td");
    td.append(element);
    tableRow.append(td);
}

function addFachToDOM(element) {
    let tableRow = document.createElement("tr");
    let delBtn = document.createElement("button");
    let lable = document.createElement("lable");
    let bgColorInp = document.createElement("input");
    let colorInp = document.createElement("input");
    let checkBox = document.createElement("input");

    tableRow.className = "fach";

    delBtn.className = "del-Btn";
    delBtn.append("X");
    delBtn.addEventListener("click", (e) => {
        removeFach(tableRow, element);
    });

    lable.append(element.name);

    bgColorInp.value = element.bgColor;
    bgColorInp.type = "color";
    bgColorInp.addEventListener("change", (e) =>
        changeFachEventHandler(element, colorInp, bgColorInp, checkBox)
    );

    colorInp.value = element.color;
    colorInp.type = "color";
    colorInp.addEventListener("change", (e) =>
        changeFachEventHandler(element, colorInp, bgColorInp, checkBox)
    );

    checkBox.type = "checkbox";
    checkBox.checked = !element.isBlocked;
    checkBox.addEventListener("change", (e) =>
        changeFachEventHandler(element, colorInp, bgColorInp, checkBox)
    );

    appendWithTd(tableRow, delBtn);
    appendWithTd(tableRow, lable);
    appendWithTd(tableRow, bgColorInp);
    appendWithTd(tableRow, colorInp);
    appendWithTd(tableRow, checkBox);
    faecherTable.append(tableRow);
}

function handleResponse(newData) {
    data = newData;
    let oldFaecher = document.querySelectorAll(".fach");
    for (const fach of oldFaecher) {
        fach.remove();
    }
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            if (key === "__values") {
                standardBgColor.value = data[key].standardBgColor;
                standardColor.value = data[key].standardColor;
            } else {
                if (data[key]) addFachToDOM(data[key]);
            }
        }
    }
}

/**
 * MASSAGE
 */

browser.runtime.onMessage.addListener( (msg) => {
    switch (request.type) {
        case "all-data":
            handleResponse(request.data);
            break;
    }
});

function sendMsg(msg) {
    browser.runtime.sendMessage(msg).catch((err) => {
        console.log(err);
    });
}

function createGetDataMsg(fach) {
    return {
        type: "get-fach-data",
        faecher: [fach],
    };
}

function createChangeDataMsg(name, color, bgColor, isBlocked) {
    return {
        type: "change-fach-data",
        fach: {
            name,
            color,
            bgColor,
            isBlocked,
        },
    };
}

function createDeleteDataMsg(fach) {
    return {
        type: "delete-fach-data",
        fach,
    };
}

function createChangeValuesDataMsg(standardBgColor, standardColor){
    return {
        type: "change-values-data",
        values: {
            standardBgColor,
            standardColor
        }
    };
}
let blockedContainer = document.querySelector("#blocked");
let faecherTable = document.querySelector("#faecher tbody");
let addBtn = document.querySelector("#add-btn");

addBtn.addEventListener("click", (e) => {});

let changeFachEventHandler = (e) => {
    sendChangeDataMessage(
        element.name,
        colorInp.value,
        bgColorInp.value,
        !checkBox.checked
    );
};

function appendWithTd(tableRow, element){
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
        console.log("pressed", element.name);
        sendDeleteDataMessage(element.name);
    });

    lable.append(element.name);

    bgColorInp.value = element.bgColor;
    bgColorInp.type = "color";
    bgColorInp.addEventListener("change", changeFachEventHandler);

    colorInp.value = element.color;
    colorInp.type = "color";
    colorInp.addEventListener("change", changeFachEventHandler);

    checkBox.type = "checkbox";
    checkBox.checked = !element.isBlocked;
    checkBox.addEventListener("change", changeFachEventHandler);

    appendWithTd(tableRow, delBtn);
    appendWithTd(tableRow, lable);
    appendWithTd(tableRow, bgColorInp);
    appendWithTd(tableRow, colorInp);
    appendWithTd(tableRow, checkBox);
    faecherTable.append(tableRow);
}

function handleResponse(data) {
    console.log(data);

    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key) && key !== "__values") {
            addFachToDOM(data[key]);
        }
    }
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

function sendGetDataMessage() {
    const sending = browser.runtime.sendMessage({
        type: "get-fach-data",
        faecher: [],
    });
    sending.then(handleResponse, handleError);
}

function sendDeleteDataMessage(fach) {
    browser.runtime.sendMessage({
        type: "delete-fach-data",
        fach,
    });
}

function sendChangeDataMessage(name, color, bgColor, isBlocked) {
    browser.runtime.sendMessage({
        type: "change-fach-data",
        fach: {
            name,
            color,
            bgColor,
            isBlocked,
        },
    });
}

function handleMessage(request, sender, sendResponse) {
    switch (request.type) {
        case "all-data":
            console.log("data", request.data);
            break;
    }
}

browser.runtime.onMessage.addListener(handleMessage);

sendGetDataMessage();

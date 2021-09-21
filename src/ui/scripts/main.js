let faecherTable = document.querySelector("#faecher tbody");
let addBtn = document.querySelector("#add-btn");

addBtn.addEventListener("click", (e) => {});

function changeFachEventHandler (element, colorInp, bgColorInp, checkBox) {
    sendChangeDataMessage(
        element.name,
        colorInp.value,
        bgColorInp.value,
        !checkBox.checked
    );
};

function appendWithTd(tableRow, element) {
    let td = document.createElement("td");
    td.append(element);
    tableRow.append(td);
}

async function removeFach(tableRow) {
    await tableRow.animate(
        [{ transform: "translateX(0px)" }, { transform: "translateX(-800px)" }],
        {
            duration: 250,
        }
    ).finished;

    tableRow.remove();
}

function addFachToDOM(element) {
    let tableRow = document.createElement("tr");
    let delBtn = document.createElement("button");
    let lable = document.createElement("lable");
    let bgColorInp = document.createElement("input");
    let colorInp = document.createElement("input");
    let checkBox = document.createElement("input");

    delBtn.className = "del-Btn";
    delBtn.append("X");
    delBtn.addEventListener("click", (e) => {
        sendDeleteDataMessage(element.name);
        removeFach(tableRow);
    });

    lable.append(element.name);

    bgColorInp.value = element.bgColor;
    bgColorInp.type = "color";
    bgColorInp.addEventListener("change", e => changeFachEventHandler(element, colorInp, bgColorInp, checkBox));

    colorInp.value = element.color;
    colorInp.type = "color";
    colorInp.addEventListener("change", e => changeFachEventHandler(element, colorInp, bgColorInp, checkBox));

    checkBox.type = "checkbox";
    checkBox.checked = !element.isBlocked;
    checkBox.addEventListener("change", e => changeFachEventHandler(element, colorInp, bgColorInp, checkBox));

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
    console.log("send", name, color, bgColor, isBlocked);
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

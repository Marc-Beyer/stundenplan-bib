let blockedContainer = document.querySelector("#blocked");
let faecherContainer = document.querySelector("#faecher");
let addBtn = document.querySelector("#add-btn");

addBtn.addEventListener("click", (e) => {

});

function handleResponse(data) {
    console.log(data);

    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key) && key !== "__values") {
            const element = data[key];
            let div = document.createElement("div");
            let delBtn = document.createElement("button");
            let lable = document.createElement("lable");
            let bgColorInp = document.createElement("input");
            let colorInp = document.createElement("input");
            let checkBox = document.createElement("input");

            div.className = "fach";

            delBtn.className = "del-Btn";
            delBtn.append("X");
            delBtn.addEventListener("click", (e) => {
                console.log("pressed", element.name);
                sendDeleteDataMessage(element.name);
            });

            lable.append(element.name);

            bgColorInp.value = element.bgColor;
            bgColorInp.type = "color";
            bgColorInp.addEventListener("change", (e) => {
                console.log("pressed", element.name);
                sendChangeDataMessage(element.name, colorInp.value, bgColorInp.value, !checkBox.checked);
            });

            colorInp.value = element.color;
            colorInp.type = "color";
            colorInp.addEventListener("change", (e) => {
                console.log("pressed", element.name);
                sendChangeDataMessage(element.name, colorInp.value, bgColorInp.value, !checkBox.checked);
            });

            checkBox.type = "checkbox";
            checkBox.checked = !element.isBlocked;
            checkBox.addEventListener("change", (e) => {
                console.log("pressed", element.name);
                sendChangeDataMessage(element.name, colorInp.value, bgColorInp.value, !checkBox.checked);
            });

            div.append(delBtn);
            div.append(lable);
            div.append(bgColorInp);
            div.append(colorInp);
            div.append(checkBox);
            faecherContainer.append(div);
        }
    }
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

function sendGetDataMessage() {
    const sending = browser.runtime.sendMessage({
        type: "get-fach-data",
        faecher: []
    });
    sending.then(handleResponse, handleError);
}

function sendDeleteDataMessage(fach) {
    browser.runtime.sendMessage({
        type: "delete-fach-data",
        fach
    });
}

function sendChangeDataMessage(name, color, bgColor, isBlocked) {
    browser.runtime.sendMessage({
        type: "change-fach-data",
        fach: {
            name,
            color, 
            bgColor,
            isBlocked
        }
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


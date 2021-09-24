// All data stored
const initialData = {
    __values: {
        standardBgColor: "#D5DCED",
        standardColor: "#000000",
    },
};

let data = initialData;

// Get the storage
function getStorage() {
    browser.storage.local.get((storedData) => {
        data = storedData.data;
        if (data == undefined) {
            data = initialData;
        }
    }).catch((err) => {
        console.log(err);
    });
}

async function updatedStorage() {
    if(configTabId){
        browser.runtime.sendMessage({ type: "all-data", data }).catch((err) => {
            console.log(err);
        });
    }

    let querying = await browser.tabs.query({ url: "https://intranet.bib.de/tiki-index.php?page=Wochenplan" });
    for (let tab of querying) {
        browser.tabs.sendMessage(tab.id, { type: "all-data", data }).catch((err) => {
            console.log(err);
        });
    }
}

// If the storage has changed invoke getStorage() and update data
browser.storage.onChanged.addListener(updatedStorage);

// Get the Storage at the start
getStorage();

function handleMessage(msg) {
    switch (msg.type) {
        case "change-values-data":
            data.__values = msg.values;
            browser.storage.local.set(data);
            break;

        case "change-fach-data":
            data[msg.fach.name] = {
                name: msg.fach.name,
                color: msg.fach.color,
                bgColor: msg.fach.bgColor,
                isBlocked: msg.fach.isBlocked,
            };
            browser.storage.local.set(data);
            break;

        case "change-fach-data-in-range":
            for (const key in msg.faecher) {
                if (Object.hasOwnProperty.call(msg.faecher, key)) {
                    data[key] = msg.faecher[key];
                    console.log(msg.faecher[key]);
                }
            }
            browser.storage.local.set(data);
            break;

        case "delete-fach-data":
            data[msg.fach] = undefined;
            browser.storage.local.set(data);
            break;

        case "get-fach-data":
            if(!msg.faecher){
                updatedStorage();
                return;
            }
            let responseArr = [];
            for (const fach of msg.faecher) {
                if (data[fach] == undefined) {
                    data[fach] = {
                        name: fach,
                        color: data.__values.standardColor,
                        bgColor: data.__values.standardBgColor,
                        isBlocked: false,
                    };
                }
                responseArr.push(data[fach]);
            }

            browser.storage.local.set(data);
            break;
    }
}

browser.runtime.onMessage.addListener(handleMessage);

// All data stored
const initialData = {
    __values: {
        standartBgColor: "#D5DCED",
        standartColor: "#000000",
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
    });
}

async function updatedStorage() {
    browser.runtime.sendMessage({ type: "all-data", data });

    let querying = await browser.tabs.query({});
    for (let tab of querying) {
        browser.tabs.sendMessage(tab.id, { type: "all-data", data });
    }
}

// If the storage has changed invoke getStorage() and update data
browser.storage.onChanged.addListener(updatedStorage);

// Get the Storage at the start
getStorage();

function handleMessage(request, sender, sendResponse) {
    switch (request.type) {
        case "change-values-data":
            data.__values = request.values;
            browser.storage.local.set(data);
            break;

        case "change-fach-data":
            data[request.fach.name] = {
                name: request.fach.name,
                color: request.fach.color,
                bgColor: request.fach.bgColor,
                isBlocked: request.fach.isBlocked,
            };
            browser.storage.local.set(data);
            break;

        case "change-fach-data-in-range":
            for (const key in request.faecher) {
                if (Object.hasOwnProperty.call(request.faecher, key)) {
                    data[key] = request.faecher[key];
                    console.log(request.faecher[key]);
                }
            }
            browser.storage.local.set(data);
            break;

        case "delete-fach-data":
            data[request.fach] = undefined;
            browser.storage.local.set(data);
            break;

        case "get-fach-data":
            let responseArr = [];
            for (const fach of request.faecher) {
                if (data[fach] == undefined) {
                    data[fach] = {
                        name: fach,
                        color: data.__values.standartColor,
                        bgColor: data.__values.standartBgColor,
                        isBlocked: false,
                    };
                    browser.storage.local.set(data);
                }
                responseArr.push(data[fach]);
            }

            sendResponse(data);
            break;
    }
}

browser.runtime.onMessage.addListener(handleMessage);

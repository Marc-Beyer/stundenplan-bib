// All data stored
const initialData = {
    __values:{
        standartBgColor: "#424242",
        standartColor: "#dddddd"
    }
};

let data = initialData;

// Get the storage
function getStorage(){
    browser.storage.local.get(storedData => {
        data = storedData.data;
        if(data == undefined){
            data = initialData;
        }else{
            browser.runtime.sendMessage({
                type: "all-data",
                data
            });
        }
    });
}

// If the storage has changed invoke getStorage() and update data 
browser.storage.onChanged.addListener(getStorage);

// Get the Storage at the start
getStorage();

function handleMessage(request, sender, sendResponse) {

    switch (request.type) {
        case "change-fach-data":
            data[request.fach.name] = {
                name: request.fach.name,
                color: request.fach.color,
                bgColor: request.fach.bgColor,
                isBlocked: request.fach.isBlocked
            } 
            console.log("change", data[request.fach.name]);
            browser.storage.local.set(data);
            break;
        case "delete-fach-data":
            data[request.fach] = undefined;
            browser.storage.local.set(data);
            break;
        case "get-fach-data":

            let responseArr = [];
            for (const fach of request.faecher) {
                console.log("fach", fach);
                if(data[fach] == undefined){
                    data[fach] = {
                        name: fach,
                        color: data.__values.standartColor,
                        bgColor: data.__values.standartBgColor,
                        isBlocked: false
                    };
                    browser.storage.local.set(data);
                }
                responseArr.push(data[fach]);
            }
            console.log(responseArr);

            sendResponse(data);
            break;
    }
}
  
browser.runtime.onMessage.addListener(handleMessage);
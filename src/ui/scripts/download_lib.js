let downloadBtn = document.getElementById("download-btn");
let uploadBtn = document.getElementById("upload-btn");

downloadBtn.addEventListener("click", (e) => {
    if (data) {
		console.log(data);
        download(JSON.stringify(data), "bib-stundenplan-theme.json", "json");
    }
});

function download(data, filename, type) {
    let file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, filename);
    } else {
        let a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function sendChangeDataRangeMessage(newData) {
    browser.runtime.sendMessage({
        type: "change-fach-data-in-range",
        faecher: newData,
    });
}

//If file is Loaded
function onLoad(event) {
	let fileString = event.target.result;
	let jsonSaveFile = JSON.parse(fileString);

	sendChangeDataRangeMessage(jsonSaveFile);
}

//Get the choosen file and read it as text
function startRead(event) {
    let file = uploadBtn.files[0];
    if (file) {
        let fileReader = new FileReader();

        fileReader.readAsText(file, "UTF-8");

        fileReader.onload = onLoad;
    }
}

//Check if the file-APIs are supported.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    //The file-APIs are supported.
    uploadBtn.addEventListener("change", startRead, false);
} else {
    //The file-APIs are not supported.
    alert("The file-APIs are not supported. You are not able to import.");
}

let downloadBtn = document.getElementById("download-btn");
downloadBtn.addEventListener("click", (e) => {
    if(data){
        download( JSON.stringify(data), "bib-stundenplan-theme.json", "json");
    }
});

function download(data, filename, type) {
	let file = new Blob([data], {type: type});
	if (window.navigator.msSaveOrOpenBlob){
		window.navigator.msSaveOrOpenBlob(file, filename);
	}else{
		let a = document.createElement("a"),
		url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

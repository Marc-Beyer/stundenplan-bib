let cbButtons = Array.from(document.getElementsByClassName("cb_block_button"));

let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (!mutation.addedNodes) return

        for (var i = 0; i < mutation.addedNodes.length; i++) {
            if(mutation.addedNodes[i].className === "cb_block_button"){
                cbButtons.push(mutation.addedNodes[i]);
                changeBtns(mutation.addedNodes[i]);
            }
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
});

let nav = document.getElementById("container");

function changeBtns(cbButton){
    // CbButton.title = "Block '" + userChannelName + "' (Channel Blocker)"
    let channelName = cbButton.title;
    channelName = channelName.replace(/^[^']*'/g, "").replace(/'[^']*$/g, "");
    cbButtons.push(cbButton);
    addOptionToSelect(channelName, cbButtons.length-1);
    console.log("found channel: " + channelName);
}

function addOptionToSelect(name, id){
    let option = document.createElement("option");
    option.value = id;
    option.append(document.createTextNode(name));
    select.append(option);
}

function selectChangeHandler(){
    cbButtons[select.value].click();
}

let div = document.createElement("div");
let select = document.createElement("select");

select.addEventListener("change", selectChangeHandler);

div.append(select);
nav.append(div);

for (let index = 0; index < cbButtons.length; index++) {
    // CbButton.title = "Block '" + userChannelName + "' (Channel Blocker)"
    let channelName = cbButtons[index].title;
    channelName = channelName.replace(/^[^']*'/g, "").replace(/'[^']*$/g, "");
    addOptionToSelect(channelName, index);
    console.log("found channel: " + title);
    
}
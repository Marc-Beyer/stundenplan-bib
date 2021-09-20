// All videos on the page
let videos =  Array.from(document.getElementsByTagName("VIDEO"));
// The navbar
let nav = document.getElementsByClassName("secondary-navigation")[0];
// The slider
let input;

// Create observer and search for videos
let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (!mutation.addedNodes) return;

        // Check all addedNodes if they are a video, if true add them to videos ad change the volume
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            if(mutation.addedNodes[i].tagName === "VIDEO"){
                // If the nav === undefined try to get it and add a slider
                if(nav === undefined){
                    addSlider();
                }
               videos.push(mutation.addedNodes[i]);
               mutation.addedNodes[i].volume = input.value;
            }
        }
    });
});

// Observe changes in children
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
});

// Change volume of all videos on sliderchange
function inputChangeHandler(){
	for(let video of videos){
		video.volume = input.value;
	}
}

// Get nav and crate and add slider
function addSlider(){
    // Get the nav if nav === undefined
    if(nav === undefined){
        nav = document.getElementsByClassName("secondary-navigation")[0];
        if(nav === undefined) return;
    }

    // Create and set up slider
    let div = document.createElement("div");
    input = document.createElement("input");

    input.type = "range";
    input.addEventListener("change", inputChangeHandler);
    input.min = 0;
    input.max = 1;
    input.step = 0.01;
    input.value = 0.3;

    // Add slider to page
    div.append(input);
    nav.append(div);
}

// Try to add a slider to the nav
addSlider();
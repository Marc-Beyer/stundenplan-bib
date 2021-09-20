let configTabId = null;

{
	//if an open config page exists makes config tab active, otherwise creates new config tab and make it active
	async function openConfig(){
		if(configTabId === null){
			let tab = await browser.tabs.create({
				active: true,
				url: "/ui/options.html"
			});

			configTabId = tab.id;
		}else{
			let tab = await browser.tabs.update(
				configTabId,
				{
					active: true
				}
			);

			await browser.windows.update(
				tab.windowId,
				{
					focused: true
				}
			);
		}
	}

    //open config page as default behavior of clicking the browserAction-button
	browser.browserAction.onClicked.addListener(openConfig);
}
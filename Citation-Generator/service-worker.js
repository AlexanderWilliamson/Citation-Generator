chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("hi");
	console.log(message.data);
	if (message.type !== "website-fetcher-htmlpage")
		return;
	
	let modifiedData = message.data.replace(/<script([^>]*)>.*?<\/script>/igs, "").replace(/<style([^>]*)>.*?<\/style>/igs, "").replace(/(<([^>]+)>)/igs, "").replace(/[\n\r]/g, "").replace(/(\s{2,})|(\t)/g, " ");
	
	console.log(modifiedData);
	
	let apiKey = "";
	let requestType = "";
	let request = "";
	
	chrome.storage.local.get(["gemini-api-key", "requested-formats"], (res) => {
		if (res){
			apiKey = res["gemini-api-key"];
			requestType = res["requested-formats"];
		}
		else{
			sendResponse({"type": "service-worker-citation-result", "data": "Request to access chrome.storage.local failed, please try again"});
		}
		
		if (!apiKey){
			sendResponse({"type": "service-worker-citation-result", "data": "Could not get apikey, click on the extension and enter your Google Gemini API key to run this extension"});
			return true;
		}
		
		if (!requestType)
			requestType = "am";
		
		if (requestType == 'a')
			request = `You will be given an html website with just its text, fully cite the website in APA format. Only respond in JSON, using the schema {apacitation:(yourCitation)}. Here is the link to the website ${message.link}. Here is the website. \"${modifiedData}\"`;
		else if (requestType == 'm')
			request = `You will be given an html website with just its text, fully cite the website in MLA format. You will use your best judgement to determine what type of resource you are citing. Only respond in JSON, using the schema {mlacitation:(yourCitation)}. Here is the link to the website ${message.link}. Here is the website. \"${modifiedData}\"`;
		else
			request = `You will be given an html website with just its text, fully cite the website in both APA and MLA format. You will use your best judgement to determine what type of resource you are citing. Only respond in JSON, using the schema {apacitation:(yourAPACitation), mlacitation:(yourMLACitation)}. Here is the link to the website ${message.link}. Here is the website. \"${modifiedData}\"`;
		
		const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
		
		fetch(url, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"contents": [
					{
						"parts": [
							{
								"text": `You will be given an html website with just its text, fully cite the website in APA format. Only respond in JSON, using the schema {citation:(yourCitation)}. Here is the link to the website ${message.link}. Here is the website. \"${modifiedData}\"`
							}
						]
					}
				]
			})
		}).then(response => {
			if(!response.ok) {
				console.log(response.status);
				throw new Error(`HTTP error: ${response.status}`);
			}
			return response.json();
		}).then(data => {
			console.log(data);
			sendResponse({"type": "service-worker-citation-result", "data": data.candidates[0].content.parts[0].text});
		}).catch(error => {
			console.log(error);
			sendResponse({"type": "service-worker-citation-result", "data": error});
		});
		return true;
	});
	return true;
});
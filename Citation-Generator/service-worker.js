chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type !== "website-fetcher-htmlpage")
		return;
	
	let modifiedData = message.data.replace(/<script([^>]*)>.*?<\/script>/igs, "").replace(/<style([^>]*)>.*?<\/style>/igs, "").replace(/(<([^>]+)>)/igs, "").replace(/[\n\r]/g, "").replace(/(\s{2,})|(\t)/g, " ");
	
	let apiKey = "";
	let requestType = "";
	let request = "";
	
	chrome.storage.local.get(["gemini-api-key", "requested-formats"], (res) => {
		if (res){
			apiKey = res["gemini-api-key"];
			requestType = res["requested-formats"];
		}
		else{
			sendResponse({"type": "service-worker-citation-result", "error": "Request to access chrome.storage.local failed, please try again"});
			return true;
		}
		
		if (!apiKey){
			sendResponse({"type": "service-worker-citation-result", "error": "Could not get apikey, click on the extension and enter your Google Gemini API key to run this extension"});
			return true;
		}
		
		if (!requestType){
			sendResponse({"type": "service-worker-citation-result", "error": "No formats are enabled, click on the extension and select which formats you would like the website to be cited in."});
			return true;
		}
		
		if (requestType == 'a')
			request = `You will be given an html website with just its text, fully cite the website in APA format. Remember in APA format the authors must be listed in ascending alphabetical order by last name then first name. When referencing a news article that doesn’t change, APA format no longer requires the retrieval date. Only respond in JSON, using the schema {apacitation:(yourCitation)}. Here is the link to the website ${message.link}. Here is the website. \"${modifiedData}\"`;
		else if (requestType == 'm')
			request = `You will be given an html website with just its text, fully cite the website in MLA format. You will use your best judgement to determine what type of resource you are citing. The titles in the MLA citation should use headline-style capitalization, and in MLA, when there are three or more authors the first author should be written as normal, then "et al." should follow it, along with the rest of the citation. Only respond in JSON, using the schema {mlacitation:(yourCitation)}. Here is the link to the website ${message.link}. Here is the website. \"${modifiedData}\"`;
		else
			request = `You will be given an html website with just its text, fully cite the website in both APA and MLA format. You will use your best judgement to determine what type of resource you are citing. For the APA format, the authors must be listed in ascending alphabetical order by last name then first name. When referencing a news article that doesn’t change, APA format no longer requires the retrieval date. The titles in the MLA citation should use headline-style capitalization. Very important, in MLA when there are three or more authors the first author should be written as normal, then "et al." should follow it, along with the rest of the citation, do not include the other authors. Only respond in JSON, using the schema {apacitation:(yourAPACitation), mlacitation:(yourMLACitation)}. Here is the link to the website ${message.link}. Here is the website. \"${modifiedData}\"`;
		
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
								"text": request
							}
						]
					}
				]
			})
		}).then(response => {
			if(!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			return response.json();
		}).then(data => {
			sendResponse({"type": "service-worker-citation-result", "data": JSON.parse(data.candidates[0].content.parts[0].text.slice(data.candidates[0].content.parts[0].text.indexOf('{'), data.candidates[0].content.parts[0].text.lastIndexOf('}') + 1))});
		}).catch(error => {
			sendResponse({"type": "service-worker-citation-result", "error": error.message.replace(/,/g, "")});
		});
		return true;
	});
	return true;
});
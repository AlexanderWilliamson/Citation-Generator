const apikeyInput = document.getElementById("apikeyInput");
const apaCitationSwitch = document.getElementById("apacitationswitch");
const mlaCitationSwitch = document.getElementById("mlacitationswitch");

document.getElementById("button").addEventListener("click", (evt) =>{
	if (!apikeyInput.value)
		return;
	
	if (!/^aiza.+$/i.test(apikeyInput.value))
		return;
	
	if (apikeyInput.value == "aizadelete")
		chrome.storage.local.remove("gemini-api-key");
	else
		chrome.storage.local.set({"gemini-api-key":apikeyInput.value});
	
	apikeyInput.value = "";
	apikeyInput.placeholder = "(Optional) Update Google Gemini API key";
});

apaCitationSwitch.addEventListener("click", (evt) =>{
	if (evt.srcElement.checked)
		chrome.storage.local.set({"requested-formats": mlaCitationSwitch.checked ? "am": "a"});
	else
		chrome.storage.local.set({"requested-formats": mlaCitationSwitch.checked ? "m": ""});
});

mlaCitationSwitch.addEventListener("click", (evt) =>{
	if (evt.srcElement.checked)
		chrome.storage.local.set({"requested-formats": apaCitationSwitch.checked ? "am": "m"});
	else
		chrome.storage.local.set({"requested-formats": apaCitationSwitch.checked ? "a": ""});
});

chrome.storage.local.get(["gemini-api-key", "requested-formats"], (res) => {
	if (res["gemini-api-key"]){
		apikeyInput.placeholder = "(Optional) Update Google Gemini API key";
	}
	else{
		apikeyInput.placeholder = "Enter Google Gemini API key";
	}
	if (res["requested-formats"]){
		if (res["requested-formats"].includes("a"))
			apaCitationSwitch.checked = true;
		if (res["requested-formats"].includes("m"))
			mlaCitationSwitch.checked = true;
	}
});


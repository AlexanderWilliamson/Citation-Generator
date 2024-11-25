document.addEventListener("keyup", function(event) {
	if (!((event.ctrlKey || event.metaKey) && event.altKey && event.key === 'y')) 
		return;
	
	const websiteHTML = document.getElementsByTagName("html")[0].innerHTML;
	
	if (!websiteHTML)
		return;
	
	if (!document.getElementById("iooigashoW$#Gdgsx-botdiv-websitecitationgeneratordiv")){
		const div = document.createElement("div");
		const topdiv = document.createElement("div");
		const botdiv = document.createElement("div");
		const btn = document.createElement("button");
		const title = document.createElement("p");
		

		div.style = "position:fixed; top:50px; right:0px; width:25em; max-width:25em; height:25em; overflow:auto; z-index:999; background-color:white; border:3px black solid;";
		div.id = "iooigashoW$#Gdgsx-botdiv-websitecitationgeneratorbigdiv";
		
		topdiv.innerHTML = "Citation Generator";
		topdiv.style = "position:absolute; top:0px; width:100%; background-color:black; color:white; font-weight:bold; padding-left:2%";
		topdiv.id = "iooigashoW$#Gdgsx-botdiv-websitecitationgeneratorheaderdiv";

		botdiv.innerHTML = "Loading...";
		botdiv.style = "position:absolute; top:20px; width:97%; white-space: normal; overflow-x:hidden; word-wrap: break-word; padding-left:2%";
		botdiv.id = "iooigashoW$#Gdgsx-botdiv-websitecitationgeneratordiv";

		btn.innerHTML = "X";
		btn.style = "position:absolute; top:0px; right:0px; background:red; width:1.2em; height:1.2em; text-align:center; padding:0;";
		btn.addEventListener("click", (evt) => {div.remove();});

		topdiv.appendChild(btn);

		div.appendChild(topdiv);
		div.appendChild(botdiv);

		document.body.appendChild(div);
		
		citationGeneratorDragElement(div);
	}
	else{
		document.getElementById("iooigashoW$#Gdgsx-botdiv-websitecitationgeneratordiv").innerHTML = "Loading...";
	}
	
	chrome.runtime.sendMessage({"type": "website-fetcher-htmlpage", "data": websiteHTML, "link": window.location.href}, (response) => {
		let finalResponse = "";
		
		if (response.error)
			finalResponse = response.error;
		else{
			if (response.data.apacitation)
				finalResponse += "APA: " + citationGenratorItalicizeText(response.data.apacitation);
				
			if (response.data.mlacitation){
				if (finalResponse)
					finalResponse += "<br><br>";
				finalResponse += "MLA: " + citationGenratorItalicizeText(response.data.mlacitation);
			}
		}
		if (!finalResponse)
			finalResponse = "The model failed to properly format it's response, please try again."
		
		document.getElementById("iooigashoW$#Gdgsx-botdiv-websitecitationgeneratordiv").innerHTML = finalResponse;
	});
});

function citationGenratorItalicizeText(txt){
	let insideAstericks = false;
	let finalResult = "";
	for (let i = 0; i < txt.length; i++){
		if (txt[i] == '*'){
			insideAstericks = !insideAstericks;
			if (insideAstericks)
				finalResult += "<i>";
			else
				finalResult += "</i>";
		}
		else
			finalResult += txt[i];
	}
	return finalResult;
}

function citationGeneratorDragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	document.getElementById("iooigashoW$#Gdgsx-botdiv-websitecitationgeneratorheaderdiv").onmousedown = citationGeneratorDragMouseDown;

	function citationGeneratorDragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = citationGeneratorCloseDragElement;
		document.onmousemove = citationGeneratorElementDrag;
	}

	function citationGeneratorElementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}

	function citationGeneratorCloseDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;
	}
}
document.addEventListener("keyup", function(event) {
	if (!((event.ctrlKey || event.metaKey) && event.altKey && event.key === 'y')) 
		return;
	
	const websiteHTML = document.getElementsByTagName("html")[0].innerHTML;
	
	if (!websiteHTML)
		return;
	
	chrome.runtime.sendMessage({"type": "website-fetcher-htmlpage", "data": websiteHTML, "link": window.location.href}, (response) => {
		if (document.getElementById("iooigashoW$#Gdgsx-botdiv-websitecitationgeneratordiv")){
			document.getElementById("iooigashoW$#Gdgsx-botdiv-websitecitationgeneratordiv").innerHTML = response.data;
		}
		else{
			const div = document.createElement("div");
			const topdiv = document.createElement("div");
			const botdiv = document.createElement("div");
			const btn = document.createElement("button");
			const title = document.createElement("p");

			div.style = "position:fixed; top:50px; right:0px; width:25em; max-width:25em; height:25em; overflow:auto; z-index:999; background-color:white; border:3px black solid;"

			topdiv.innerHTML = "Text Summarizer";
			topdiv.style = "position:absolute; top:0px; width:98%; background-color:black; color:white; font-weight:bold; padding-left:2%";

			botdiv.innerHTML = response.data;
			botdiv.style = "position:absolute; top:20px; width:97%; white-space: normal; overflow-x:hidden; word-wrap: break-word; padding-left:2%";
			botdiv.id = "iooigashoW$#Gdgsx-botdiv-websitecitationgeneratordiv";

			btn.innerHTML = "X";
			btn.style = "position:absolute; top:0px; right:0px; background:red; width:1.2em; height:1.2em; text-align:center; padding:0;";
			btn.addEventListener("click", (evt) => {div.remove();});

			topdiv.appendChild(btn);

			div.appendChild(topdiv);
			div.appendChild(botdiv);

			document.body.appendChild(div);
		}
	});
});
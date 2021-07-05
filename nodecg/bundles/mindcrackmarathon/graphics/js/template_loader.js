async function load_scripts(urls) {
	function load(url, attrs) {
		return new Promise(resolve => {
			let script = document.createElement('script');
			script.onload = resolve;
			script.src = url
			script.async = false

			for (const attr in attrs) {
				if (!attrs.hasOwnProperty(attr)) continue;
				script.setAttribute(attr, attrs[attr]);
			}

			document.head.appendChild(script);
		});
	}

	let promises = [];

	// Create function to start loading all scripts
	for (const url in urls) {
		if (!urls.hasOwnProperty(url)) continue;
		promises.push(load(url, urls[url]));
	}

	// Wait for those scripts to load
	await Promise.all(promises);
}

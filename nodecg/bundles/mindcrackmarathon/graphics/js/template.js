// noinspection HtmlUnknownTarget
const content=`
<div id="suppBox" class="hidden"></div>
<div id="overlay-wrapper">
	<div id="main-bar">
		<!-- off bar text color || base bg color || font-size || "border" w/ same color as bar -->
		<div id="goal-bar">
			<!-- Progress bar: on bar text color || bar bg color -->
			<div id="goal-bar-progress" style="width: 10%; color: #ffffff; background-color: #000099;">
				<div id="goal-progress-text" style="">This is just some text that will exist here...</div>
			</div>
			<div id="goal-text">This is just some text that will exist here...</div>
		</div>
		<div id="info-bar-wrapper">
			<img id="mc_logo" src="" alt="Mindcrack logo"/>
			<div id="info-bar">
				<div id="marathon_logo">
					<div>MINDCRACK</div>
					<img src="images/marathon_logo.png" alt="marathon logo"/>
				</div>

				<div id="section-container">
					<div id="section-1" class="section">
						<div id="section1Label" class="section-label">{time left}</div>
					</div>

					<div id="section-2" class="section">
						<div id="section2Label" class="section-label">{current total}</div>
					</div>

					<div id="section-3" class="section">
						<div id="section3Label" class="section-label">{current goal}</div>
					</div>

					<div id="section-4" class="section">
						<div id="section4Label" class="section-label">{last donation}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="sponsor-box"></div>
</div>

<!--<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>-->
<!--<script src="/bundles/utility/js/utilities.js"></script>
<script src="js/replicant_definitions.js"></script>
<script src="js/common_bar.js"></script>
<script src="js/supplemental_bar.js"></script>-->
`;

document.body.innerHTML = content;

// <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossOrigin="anonymous"></script>

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

(async () => await load_scripts({
	'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js': {
		'integrity': 'sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==',
		'crossOrigin': 'anonymous'
	},
	'/bundles/utility/js/utilities.js': {},
	'js/replicant_definitions.js': {},
	'js/common_bar.js': {},
	'js/supplemental_bar.js': {}
}))();

// We can access Replicants from other bundles by specifying the bundle name as a second parameter.
const settingReplicant = nodecg.Replicant('main_bar_settings');
const sponsorReplicant = nodecg.Replicant('assets:sponsors');
const supplementalReplicant = nodecg.Replicant('supplemental');
const sponsorBox = $('#sponsor-box');
const supplementalBox = $('#suppBox');


let supplementalCount = 0;
let supplementalInterval = 0;
let supplementalNextTimeout = 0;
let supplementalRotations = 0;
let supplementalRotationsComplete = 0;
let supplementalSpeedBetween = 0;
let supplementalSpeedEach = 0;
let currentSupplementalIndex = -1;

let sponsorRotation = 0;
let sponsorInterval = 0;
let sponsorCount = 0;
let currentSponsorIndex = -1;

function rotateSponsors() {
	if (sponsorCount === 0) return; // No sponsors. No need to run rotate anything
	if (sponsorCount === 1 && currentSponsorIndex === 0) return; // Sponsor already set. No need to rotate anything;

	// Hide old & show new
	sponsorBox.find('div').fadeOut(2000);
	$(`#sponsorIndex${++currentSponsorIndex}`).fadeIn(2000)

	if (sponsorCount === 1 && currentSponsorIndex === 0) return; // Just to stop the rotations
	if (sponsorCount - 1 === currentSponsorIndex) currentSponsorIndex = -1; // Reset
}

function showSupplementBox() {
	// Stop the timeout (in case this function is ever called early)
	clearTimeout(supplementalNextTimeout);
	// Reset control vars
	currentSupplementalIndex = -1;
	supplementalRotationsComplete = 0;

	// Show the box
	supplementalBox.removeClass('hidden');

	// Set intial message
	rotateSupplement(true, 800)

	// Start rotating
	supplementalInterval = setInterval(rotateSupplement, supplementalSpeedEach);
}

function rotateSupplement(firstRun = false, fadeSpeed = 1500) {
	if (supplementalCount === 0) {
		// Stop the timer. There is nothing to show. No reason to run...
		hideSupplementBox();
		return;
	}

	if (supplementalRotationsComplete === supplementalRotations) {
		// All rotations complete. Hide it
		hideSupplementBox();
		return;
	}

	if (supplementalCount === 1 && currentSupplementalIndex === 0) {
		// Supplemental already set. No need to rotate anything;
		supplementalRotationsComplete++;
		return;
	}

	// Hide old & show new
	supplementalBox.find('> div.supp-message.shown')
		.addClass('hiding')
		.fadeOut(fadeSpeed, () => supplementalBox
			.find('> div.supp-message.hiding')
			.removeClass('shown').removeClass('hiding'));

	// Track current, because JS...
	// BUG: (the actual issue: it doesnt track the last element,
	//   for some reason I cant be bothered to figure out right now)
	let shown = ++currentSupplementalIndex;
	$(`#supp-${shown}`).fadeIn(fadeSpeed, () => {
		$(`#supp-${shown}`).addClass('shown')
	});

	if (supplementalCount - 1 === currentSupplementalIndex) {
		// Reset the index and increment counter
		currentSupplementalIndex = -1;
		supplementalRotationsComplete++;
	}
}

function hideSupplementBox(armRestart = true) {
	// Hide the box
	supplementalBox.addClass('hidden');
	supplementalBox.find('> div.supp-message').fadeOut(500, ()=>supplementalBox.find('> div.supp-message').removeClass('shown'));

	// Stop the rotation timer
	clearInterval(supplementalInterval);
	supplementalInterval = 0; // Set it back to 0 just for state

	clearTimeout(supplementalNextTimeout); // Just in case... =)
	if (armRestart) supplementalNextTimeout = setTimeout(showSupplementBox, supplementalSpeedBetween);
}


// ###########################
// ### REPLICANT LISTENERS ###
// ###########################
sponsorReplicant.on('change', (newSponsors) => {
	// Reset vars
	sponsorBox.text(''); // Empty sponsors container
	currentSponsorIndex = -1; // Reset index to update on next run
	sponsorCount = 0;

	// Add new
	newSponsors.forEach(sponsor => {
		sponsorBox.append(`<div id="sponsorIndex${sponsorCount++}" style="display: none"><img src="${sponsor['url']}" alt="Sponsor" /></div>`)
	});
	rotateSponsors();
});


settingReplicant.on('change', (newData) => {
	newData = newData || {}

	let extraLife = newData.extraLife === undefined ? true : newData.extraLife;
	if (extraLife) {
		document.querySelector('#mc_logo').src = 'images/ExtraLife_MindcrackLogoW.png';
	} else {
		document.querySelector('#mc_logo').src = 'images/mindcrack.png';
	}

	let marathon = newData.marathon === undefined ? true : newData.marathon;
	if (marathon) {
		$('#marathon_logo div').hide();
		$('#marathon_logo img').show();
	} else {
		$('#marathon_logo div').show();
		$('#marathon_logo img').hide();
	}

	clearInterval(sponsorInterval);
	sponsorRotation = parseInt(newData.sponsorRotation || '60000');
	sponsorInterval = setInterval(rotateSponsors, sponsorRotation);

	$('#overlay-wrapper').css('background', newData.mainBarColor || '#19181a');
	$('#section-container div.section-label').css('color', newData.mainTextColor || '#ffffff');
	$('#section-container div.section').css('border-color', newData.barSeparatorColor || '#ffffff');

	$('#section1Label').text(newData.section1Label || 'Time Left');
	$('#section2Label').text(newData.section2Label || 'Current Total');
	$('#section3Label').text(newData.section3Label || 'Current Goal');
	$('#section4Label').text(newData.section4Label || 'Last Donation');

	$('#section-container div#section-1').css('width', '' + (parseInt(newData.section1Width) || '220') + 'px');
	$('#section-container div#section-2').css('width', '' + (parseInt(newData.section2Width) || '300') + 'px');
	$('#section-container div#section-3').css('width', '' + (parseInt(newData.section3Width) || '300') + 'px');
	$('#section-container div#section-4').css('width', '' + (parseInt(newData.section4Width) || '380') + 'px');

	let donationBarFillColor = newData.donationBarFillColor || '#8ed717';
	let donationBarOffColor = newData.donationBarOffColor || '#5f780d';
	let donationBarTextFillColor = newData.donationBarTextFillColor || '#000000';
	let donationBarTextOffColor = newData.donationBarTextOffColor || '#ffffff';
	let donationTextFormat = newData.donationTextFormat || 'Raised: {current}/{goal} ({percent}) so far';

	// Stop the messages
	clearInterval(supplementalInterval);
	clearTimeout(supplementalNextTimeout);
	// Update values
	supplementalRotations = parseInt(newData.suppRotations || '2');
	supplementalSpeedBetween = parseInt(newData.suppShowEvery || '300000');
	supplementalSpeedEach = parseInt(newData.suppShowEach || '20000');
	// Restart
	if (supplementalInterval) showSupplementBox();
	else supplementalNextTimeout = setTimeout(showSupplementBox, supplementalSpeedBetween);
});


async function updateSupplements(supplementals) {
	if (supplementals && Object.keys(supplementals).length) {
		// Has supplements
		hideSupplementBox();
		clearInterval(supplementalInterval);
		clearTimeout(supplementalNextTimeout);
		await new Promise(res => setTimeout(res, 1000)); // Sleep for a sec to give the box time to disappear

		supplementalCount = 0;
		supplementalBox.text(''); // Clear it
		for (const bundle in supplementals) {
			// noinspection JSUnfilteredForInLoop
			supplementals[bundle].forEach(supp => {
				// Add elements
				let $element = $(supp);
				let $element_container = $('<div id="supp-' + (supplementalCount++) + '" class="supp-message supp-'+bundle+'" style="display: none"></div>');
				$element_container.append($element);
				supplementalBox.append($element_container);
			});
		}

		// Restart the timer
		if (supplementalInterval) showSupplementBox();
		else supplementalNextTimeout = setTimeout(showSupplementBox, supplementalSpeedBetween);
	}
}

supplementalReplicant.on('change', updateSupplements);

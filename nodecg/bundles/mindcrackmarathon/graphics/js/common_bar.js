const sponsorBox = $('#sponsor-box');

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
});

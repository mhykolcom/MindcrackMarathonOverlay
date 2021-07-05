const sponsorBox = $('#sponsor-box');

let sponsorRotation = 0;
let sponsorInterval = 0;
let sponsorCount = 0;
let currentSponsorIndex = -1;

const goalBar = document.getElementById("goal-bar");
const goalBarProgress = document.getElementById("goal-bar-progress");
const goalProgressText = document.getElementById("goal-progress-text");
const goalText = document.getElementById("goal-text");
let donationBarText = '';
let donationBarStyle = {
	text: {fill: '', off: ''},
	bar: {fill: '', off: ''}
};

function rotateSponsors() {
	if (sponsorCount === 0) return; // No sponsors. No need to run rotate anything
	if (sponsorCount === 1 && currentSponsorIndex === 0) return; // Sponsor already set. No need to rotate anything;

	// Hide old & show new
	sponsorBox.find('div').fadeOut(2000);
	$(`#sponsorIndex${++currentSponsorIndex}`).fadeIn(2000)

	if (sponsorCount === 1 && currentSponsorIndex === 0) return; // Just to stop the rotations
	if (sponsorCount - 1 === currentSponsorIndex) currentSponsorIndex = -1; // Reset
}

function updateDonationBar(current, goal) {
	current = parseFloat(current)
	goal = parseFloat(goal)

	if (current <= 0 && goal <= 0) {
		goalBar.setAttribute('style', 'display: none;')
		console.log('No goal set')
		nodecg.log.warn('No goal set')
		return;
	}

	let percent = (current / goal) * 100;
	if (percent >= 100) {
		percent = 100;
	}

	let width = 0;
	if (current > 0) {
		width = Math.ceil(percent)
		if (width >= 100) {
			if (current < goal) width = 99;
			else width = 100;
		}
	}

	let goal_bar_style = '';
	goal_bar_style += `color: ${donationBarStyle.text.off};`;
	goal_bar_style += `background-color: ${donationBarStyle.bar.off};`;

	let goal_bar_progress_style = '';
	goal_bar_progress_style += `width: ${width}%;`;
	goal_bar_progress_style += `color: ${donationBarStyle.text.fill};`;
	goal_bar_progress_style += `background-color: ${donationBarStyle.bar.fill};`;

	goalBar.setAttribute('style', goal_bar_style)
	goalBarProgress.setAttribute('style', goal_bar_progress_style)

	let barText = donationBarText;
	barText = prepOutput(barText, {
		current: '$'+current,
		goal: '$'+goal,
		percent: percent.toFixed(2)+'%',
	});

	goalText.innerText = barText;
	goalProgressText.innerText = barText;
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

	// Logo
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

	// Sponsors
	clearInterval(sponsorInterval);
	sponsorRotation = parseInt(newData.sponsorRotation || '60000');
	sponsorInterval = setInterval(rotateSponsors, sponsorRotation);

	// Section control and formatting
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

	// Donation bar
	donationBarText = newData.donationTextFormat || 'Raised: {current}/{goal} ({percent}) so far';
	donationBarStyle = {
		text: {
			fill: (newData.donationBarTextFillColor || '#000000'),
			off: (newData.donationBarTextOffColor || '#ffffff')
		},
		bar: {
			fill: (newData.donationBarFillColor || '#8ed717'),
			off: (newData.donationBarOffColor || '#5f780d')
		}
	};

	// Temp vars until it gets hooked up to API
	let current=237.81;
	let goal=500.00;
	updateDonationBar(current, goal);
});

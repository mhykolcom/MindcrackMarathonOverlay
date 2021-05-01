const timeLabel = document.querySelector('#timeLabel');

// We can access Replicants from other bundles by specifying the bundle name as a second parameter.
const settingReplicant = nodecg.Replicant('main_bar_settings');

settingReplicant.on('change', (newData, oldValue) => {
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

	// TODO: Something with this
	let sponsorRotation = parseInt(newData.sponsorRotation || '60000');

	$('#overlay-wrapper').css('background', newData.mainBarColor || '#19181a');
	$('#section-container div.section-label').css('color', newData.mainTextColor || '#ffffff');
	$('#section-container div.section').css('border-color', newData.barSeparatorColor || '#ffffff');

	$('#section1Label').text(newData.section1Label || 'Time Left');
	$('#section2Label').text(newData.section2Label || 'Time Left');
	$('#section3Label').text(newData.section3Label || 'Time Left');
	$('#section4Label').text(newData.section4Label || 'Time Left');

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

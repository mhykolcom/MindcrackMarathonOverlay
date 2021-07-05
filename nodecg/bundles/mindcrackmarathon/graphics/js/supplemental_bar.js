const supplementalBox = $('#suppBox');

let supplementalCount = 0;
let supplementalInterval = 0;
let supplementalNextTimeout = 0;
let supplementalRotations = 0;
let supplementalRotationsComplete = 0;
let supplementalSpeedBetween = 0;
let supplementalSpeedEach = 0;
let currentSupplementalIndex = -1;


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
	//   for some reason and I cant be bothered to figure out right now)
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
settingReplicant.on('change', (newData) => {
	newData = newData || {}

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

		// Always add schedule first
		if ('schedule' in supplementals) {
			addSuppMessage(supplementals['schedule'][0], 'schedule');
		}

		for (const bundle in supplementals) {
			if (!supplementals.hasOwnProperty(bundle)) continue;

			// Skip schedule (already added)
			if (bundle === 'schedule') continue;

			// Add each item in bundle supplemental to suppBox
			supplementals[bundle].forEach(supp => {
				addSuppMessage(supp, bundle);
			});
		}

		// Restart the timer
		if (supplementalInterval) showSupplementBox();
		else supplementalNextTimeout = setTimeout(showSupplementBox, supplementalSpeedBetween);
	}

	function addSuppMessage(supp, bundle) {
		// Add elements
		let $element = $(supp);
		let $element_container = $('<div id="supp-' + (supplementalCount++) + '" class="supp-message supp-' + bundle + '" style="display: none"></div>');
		$element_container.append($element);
		supplementalBox.append($element_container);
	}
}

supplementalReplicant.on('change', updateSupplements);


const FORCE_START_SUPPLEMENTAL_ROTATION = 'forceStartRotation';
const FORCE_NEXT_SUPPLEMENTAL_ROTATION = 'forceNextRotation';
async function doSupplementalControl(data) {
	// console.log('control: ', data)

	if (!data.action) return nodecg.log.error('Requested supplemental control, but no data/action was specified', data);
	if (![FORCE_START_SUPPLEMENTAL_ROTATION, FORCE_NEXT_SUPPLEMENTAL_ROTATION].includes(data.action)) return nodecg.log.error('Unknown action', data)

	const action = data.action;

	if (action === FORCE_START_SUPPLEMENTAL_ROTATION) {
		// Stop the box
		hideSupplementBox();
		clearInterval(supplementalInterval);
		clearTimeout(supplementalNextTimeout);

		// Sleep for a sec to give the box time to disappear
		await new Promise(res => setTimeout(res, 1000));

		// (Re)start
		showSupplementBox();
	} else if (action === FORCE_NEXT_SUPPLEMENTAL_ROTATION) {
		rotateSupplement();
	}
}

nodecg.listenFor('supplementalControl', doSupplementalControl)

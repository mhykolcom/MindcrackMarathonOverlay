// We can access Replicants from other bundles by specifying the bundle name as a second parameter.
// NodeCG requires that bundle names match their directory names, but you can always check the `package.json` to double check.
const countdown = document.getElementById("countdown");
const body = document.getElementsByTagName("body");
const countdownReplicant = nodecg.Replicant('countdown1');
let countdownHandler;

let targetDateTime;
let pre_text;
let post_text;
let finished_text;

let displayFormat;
let daysFormat;
let hoursFormat;
let minsFormat;
let secsFormat;
let bg_color;
let text_color;
let text_size;

function prepChanges(newDatetime) {
	targetDateTime = newDatetime.datetime.date + ' ' + newDatetime.datetime.time + ' EDT';
	pre_text = newDatetime.text.pre;
	post_text = newDatetime.text.post;
	finished_text = newDatetime.text.complete;

	displayFormat = newDatetime.formatting.display;
	daysFormat = newDatetime.formatting.days;
	hoursFormat = newDatetime.formatting.hours;
	minsFormat = newDatetime.formatting.mins;
	secsFormat = newDatetime.formatting.secs;

	bg_color = newDatetime.style.background_color;
	text_color = newDatetime.style.text_color;
	text_size = newDatetime.style.text_size;

	body[0].setAttribute('style', 'background-color:' + bg_color + '; opacity: 1;')
	countdown.setAttribute('style', `color: ${text_color}; font-size: ${text_size};`)

	if (countdownHandler) clearInterval(countdownHandler)
	if (!newDatetime.datetime.date || !newDatetime.datetime.time) {
		countdown.innerText = 'No date/time set for the countdown';
		return;
	}

	countdownHandler = setInterval(updateCountdown, 500)
	updateCountdown()
}

function updateCountdown() {
	const total = Date.parse(targetDateTime) - Date.parse(new Date());
	if (total <= 0) {
		if (countdownHandler) clearInterval(countdownHandler);
		if (finished_text || finished_text.length > 0) {
			countdown.innerText = finished_text;
		} else {
			countdown.innerText = '';
			body[0].setAttribute('style', 'background-color: transparent; opacity: 0')
		}
		return;
	}

	const seconds = Math.floor((total / 1000) % 60);
	const minutes = Math.floor((total / 1000 / 60) % 60);
	const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
	const days = Math.floor(total / (1000 * 60 * 60 * 24));

	let countdownText = '';
	if (days && daysFormat.includes('#')) countdownText += daysFormat.replace('#', days)
	if ((days || hours) && hoursFormat.includes('#')) countdownText += hoursFormat.replace('#', ('' + hours).padStart(2, '0'))
	countdownText += minsFormat.replace('#', ('' + minutes).padStart(2, '0'))
	countdownText += secsFormat.replace('#', ('' + seconds).padStart(2, '0'))

	if (!pre_text) pre_text = '';
	if (!post_text) post_text = '';

	let renderText = displayFormat;
	renderText = prepOutput(renderText, {
		pre: pre_text,
		datetime: countdownText,
		post: post_text
	});

	countdown.innerText = renderText;
}

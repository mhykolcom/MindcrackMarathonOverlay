const goal_bar = document.getElementById("goal_bar");
const goal_bar_progress = document.getElementById("goal_bar_progress");
const goal_progress_text = document.getElementById("goal_progress_text");
const goal_text = document.getElementById("goal_text");

// Change will be called when the Replicant loads too, so we can use it to set the initial value.
function update(newGoal) {
	let current = parseInt(newGoal.progress.current)
	let goal = parseInt(newGoal.progress.goal)
	if (current <= 0 && goal <= 0) {
		goal_bar.setAttribute('style', 'display: none;')
		console.log('No goal set')
		nodecg.log.warn('No goal set')
		return;
	}

	let width = 0;
	if (current > 0) {
		width = Math.ceil((current / goal) * 100)
		if (width >= 100) {
			if (current < goal) width = 99;
			else width = 100;
		}
	}

	let goal_bar_style = '';
	goal_bar_style += `height: ${newGoal.style.bar.size};`;
	goal_bar_style += `color: ${newGoal.style.text.off_color};`;
	goal_bar_style += `background-color: ${newGoal.style.bar.off_color};`;
	goal_bar_style += `font-size: ${newGoal.style.text.size};`;
	goal_bar_style += `outline: 1px solid ${newGoal.style.bar.color};`;

	let goal_bar_progress_style = '';
	goal_bar_progress_style += `height: ${newGoal.style.bar.size};`;
	goal_bar_progress_style += `width: ${width}%;`;
	goal_bar_progress_style += `color: ${newGoal.style.text.color};`;
	goal_bar_progress_style += `background-color: ${newGoal.style.bar.color};`;

	goal_bar.setAttribute('style', goal_bar_style)
	goal_bar_progress.setAttribute('style', goal_bar_progress_style)

	let bar_text = (current >= goal && newGoal.text.goal) ? newGoal.formatting.goal : newGoal.formatting.display;
	bar_text = prepOutput(bar_text, {
		pre: newGoal.text.pre,
		finish: (newGoal.text.goal || ''),
		current: newGoal.text.prefix + newGoal.progress.current,
		goal: newGoal.text.prefix + newGoal.progress.goal,
		post: newGoal.text.post,
	});

	goal_text.innerText = bar_text;
	goal_progress_text.innerText = bar_text;
}

const styling = {
	'style': {
		'bar': {
			'color': '#0000ff',
			'off_color': '#fff',
			'size': '120px',
		},
		'text': {
			'color': '#000',
			'off_color': '#000',
			'size': '1em',
		}
	}
}

const bar_formatting = 'Put whatever - {current}/{goal} you want here...';

function mcUpdate(current, goal) {
	current = parseInt(current)
	goal = parseInt(goal)

	let width = 0;
	if (current > 0) {
		width = Math.ceil((current / goal) * 100)
		if (width >= 100) {
			if (current < goal) width = 99;
			else width = 100;
		}
	}

	let goal_bar_style = '';
	goal_bar_style += `height: ${styling.bar.size};`;
	goal_bar_style += `color: ${styling.text.off_color}`;
	goal_bar_style += `background-color: ${styling.bar.off_color};`;
	goal_bar_style += `font-size: ${styling.text.size};`;
	goal_bar_style += `outline: 1px solid ${styling.bar.color};`;

	let goal_bar_progress_style = '';
	goal_bar_progress_style += `height: ${styling.bar.size};`;
	goal_bar_progress_style += `width: ${width}%;`;
	goal_bar_progress_style += `color: ${styling.text.color};`;
	goal_bar_progress_style += `background-color: ${styling.bar.color};`;

	goal_bar.setAttribute('style', goal_bar_style)
	goal_bar_progress.setAttribute('style', goal_bar_progress_style)

	let bar_text = prepOutput(bar_formatting, {
		current: newGoal.text.prefix + newGoal.progress.current,
		goal: newGoal.text.prefix + newGoal.progress.goal,
	});

	goal_text.innerText = bar_text;
	goal_progress_text.innerText = bar_text;
}

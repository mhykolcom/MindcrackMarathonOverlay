let subRep = nodecg.Replicant('subRep', { defaultValue: 0 });
let bitRep = nodecg.Replicant('bitRep', { defaultValue: 0 });
let tipRep = nodecg.Replicant('tipRep', { defaultValue: 0 });
let goalRep = nodecg.Replicant('goalRep');
let countdownRep = nodecg.Replicant('countdown');
let styleRep = nodecg.Replicant('styleRep');
let goalBar = {};

const roundAccurately = (number, decimalPlaces) => Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces);


const styling = {
    'bar': {
        'color': '#ecbf00',
        'off_color': '#bebebe',
    },
    'text': {
        'color': '#000',
        'off_color': '#000',
    }
}

const bar_formatting = '{current} / {goal} Sub Pts';

subRep.on('change', (newValue, oldValue) => {
    $('#subcount').text(newValue.toLocaleString());
    goalBar.subCount = newValue
});

bitRep.on('change', (newValue, oldValue) => {
    $('#bitcount').text(newValue.toLocaleString());

});

tipRep.on('change', (newValue, oldValue) => {
    $('#tipcount').text(newValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
});

goalRep.on('change', (newValue, oldValue) => {
    $('#goalTitle').text(newValue.goalTitle);
    $('#goalText').text(newValue.goalText);
    //console.log(subRep.value);
    goalBar.subGoal = newValue;
    //update(subRep.value, newValue.goalAmount);
    /*if (newValue.goalTitle == "") {
        $('#goalTextCol').addClass('text-center');
        $('#goalTextCol').removeClass('text-right');
    } else {
        $('#goalTextCol').addClass('text-right');
        $('#goalTextCol').removeClass('text-center');
    }*/
})

styleRep.on('change', (newValue, oldValue) => {
    $('body').css('font-size', newValue.size + 'em');
    $('.box').css(`background-color`, `rgba(${newValue.colorR}, ${newValue.colorG}, ${newValue.colorB}, ${newValue.opacity})`);
    $('.box').css('box-shadow', `5px 5px 5px 0px rgba(0,0,0,${newValue.opacity})`);
    $('.box').css('border', `5px solid rgba(255,255,255,${newValue.opacity})`);
    /*$('#goal_bar').css('height',(newValue.size-0.4) + 'rem');
    $('#goal_bar_progress').css('height',(newValue.size-0.4) + 'rem');*/
})


let countdownHandler;
let targetDateTime;


function prepChanges(newDatetime) {
    targetDateTime = newDatetime.date + ' ' + newDatetime.time;
    finished_text = "Finished!"

    if (countdownHandler) clearInterval(countdownHandler)
    if (!newDatetime.date || !newDatetime.time) {
        countdown.innerText = 'Not Set';
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
        }
        return;
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    let countdownText = '';
    if (days) countdownText += days + ':'
    if (days || hours) countdownText += ('' + hours).padStart(2, '0') + ':'
    countdownText += ('' + minutes).padStart(2, '0') + ':'
    countdownText += ('' + seconds).padStart(2, '0')

    countdown.innerText = countdownText;
    //console.log(goalBar)
    update(goalBar.subCount, goalBar.subGoal.goalAmount);
}



//###############################
//##### CHANGE THIS ... #########
//update(150, 50000);
//##### CHANGE THIS ... #########
//###############################



function update(current, goal) {
    //current = parseInt(current)
    //goal = parseInt(goal)

    let width = 0;
    if (current > 0) {
        width = Math.ceil((current / goal) * 10000) / 100
            //if (width >= 100) {
            //if (current < goal) width = 99;
            //else width = 100;
            //}
    }

    const goal_bar = document.getElementById("goal_bar");
    const goal_bar_progress = document.getElementById("goal_bar_progress");
    const goal_progress_text = document.getElementById("goal_progress_text");
    const goal_text = document.getElementById("goal_text");

    let goal_bar_style = '';
    //goal_bar_style += `height: ${styling.bar.size};`;
    goal_bar_style += `color: ${styling.text.off_color};`;
    goal_bar_style += `background-color: ${styling.bar.off_color};`;
    goal_bar_style += `font-size: ${styling.text.size};`;
    goal_bar_style += `outline: 1px solid ${styling.bar.color};`;

    let goal_bar_progress_style = '';
    //goal_bar_progress_style += `height: ${styling.bar.size};`;
    goal_bar_progress_style += `width: ${width}%;`;
    goal_bar_progress_style += `color: ${styling.text.color};`;
    goal_bar_progress_style += `background-color: ${styling.bar.color};`;

    //console.log(goal_bar);
    //console.log(goal_bar_style);

    goal_bar.setAttribute('style', goal_bar_style)
    goal_bar_progress.setAttribute('style', goal_bar_progress_style)

    let bar_text = prepOutput(bar_formatting, {
        current: current,
        goal: goal,
        percent: Math.ceil((current / goal) * 10000) / 100,
    });

    goal_text.innerText = bar_text;
    goal_progress_text.innerText = bar_text;
}

function prepOutput(output, replacements) {

    if (replacements) {
        // noinspection JSUnfilteredForInLoop
        for (const findVar in replacements) {
            let findVarReg = new RegExp('\\{' + findVar + '}', "g");
            output = output.replace(findVarReg, replacements[findVar])
        }
    }
    return output.replace(/\\n/g, '\n').trim()
}
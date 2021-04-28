const flash = document.querySelector('#flash');
const show = document.querySelector('#show');
const hide = document.querySelector('#hide');

let replicantData = null;
let commonData = {
	message_name: '',
	replicant: '',
	flashClickHandler: null,
	showClickHandler: null,
	hideClickHandler: null,
}

flash.onclick = () => {
	if (commonData.flashClickHandler) commonData.flashClickHandler()
	saveReplicantData();
	sendControlMessage(null, 'flash', $('#flash_time').val());
};
show.onclick = () => {
	if (commonData.showClickHandler) commonData.showClickHandler()
	saveReplicantData();
	sendControlMessage(null, 'show');
};
hide.onclick = () => {
	if (commonData.hideClickHandler) commonData.hideClickHandler()
	sendControlMessage(null, 'hide');
};

function initCommonData(replicant, message_name, flash_click_handler, show_click_handler, hide_click_handler) {
	commonData['replicant'] = replicant || '';
	commonData['message_name'] = message_name || '';
	commonData['flashClickHandler'] = flash_click_handler || null;
	commonData['showClickHandler'] = show_click_handler || null;
	commonData['hideClickHandler'] = hide_click_handler || null;
}

function setSaveData(data) {
	replicantData = data
}

function sendControlMessage(name, action, time, target) {
	let data = {'action': (action || 'nothing')};
	if (time) data['time'] = time;
	if (target) data['target'] = target;
	nodecg.sendMessage((name || commonData.message_name), data);
}

function saveReplicantData() {
	if (!commonData.replicant) throw 'You need to define the replicant. Run initCommonData()';
	if (replicantData===null) throw 'You need to save the values using setSaveData()';
	commonData.replicant.value = replicantData || '';

	// Reset data
	replicantData = null;
}

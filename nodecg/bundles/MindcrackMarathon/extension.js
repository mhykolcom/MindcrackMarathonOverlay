'use strict';

module.exports = nodecg => {
	const streamlabs = nodecg.extensions['nodecg-streamlabs'];
	let subRep = nodecg.Replicant('subRep', {defaultValue: 0});
	let bitRep = nodecg.Replicant('bitRep', {defaultValue: 0});
	let tipRep = nodecg.Replicant('tipRep', {defaultValue: 0});

	streamlabs.on("rawEvent", event => {
		const data = event.message[0]
		switch (event.type) {
			case "subscription":
				// DO SUBS
				nodecg.log.info(`Sub: ${data.display_name}, ${data.months} months, tier: ${data.sub_plan}`)
				if (data.repeat == true) { break; }
				switch (data.sub_plan) {
					case "Prime":
						subRep.value++
						break;
					case "1000":
						subRep.value++
						break;
					case "2000":
						subRep.value += 2
						break;
					case "3000":
						subRep.value += 6
						break;
				}
				nodecg.log.info(`Total subs: ${subRep.value}`)
				break;
			case "bits":
				// DO BITS
				nodecg.log.info(`Bits: ${data.display_name}, ${data.amount}`)
				if (data.repeat == true) { break; }
				bitRep.value += parseInt(data.amount);
				nodecg.log.info(`Total bits: ${bitRep.value}`)
				break;
			case "donation":
				// DO TIPS
				nodecg.log.info(`Tip: ${data.from}, ${data.amount}`)
				if (data.repeat == true) { break; }
				tipRep.value += parseFloat(data.amount);
				nodecg.log.info(`Total tips: ${tipRep.value}`)
				break;
		}
	});
}
/**
 * @param {PasswordGenerationOptions} options
 * @returns
 */
export function generatePassword (options) {
	const minimum = options.uppercase + options.lowercase + options.number + options.special;
	const length = options.length < minimum ? minimum : options.length;

	const positions = [];

	for (let i = 0, l = options.lowercase; i < l; i++) {
		positions.push('l');
	}

	for (let i = 0, l = options.uppercase; i < l; i++) {
		positions.push('u');
	}

	for (let i = 0, l = options.number; i < l; i++) {
		positions.push('n');
	}

	for (let i = 0, l = options.special; i < l; i++) {
		positions.push('s');
	}

	for (let i = 0, l = length - Math.max(0, minimum); i < l; i++) {
		positions.push('r');
	}

	shuffle(positions);

	let charset = '';

	let lowercaseCharset = 'abcdefghijkmnopqrstuvwxyz';
	let uppercaseCharset = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
	let numberCharset = '23456789';
	let specialCharset = '!@#$%^&*';

	if (options.ambiguous) {
		lowercaseCharset += 'l';
		uppercaseCharset += 'IO';
		numberCharset += '10';
	}

	if (options.lowercase > -1) {
		charset += lowercaseCharset;
	}

	if (options.uppercase > -1) {
		charset += uppercaseCharset;
	}

	if (options.number > -1) {
		charset += numberCharset;
	}

	if (options.special > -1) {
		charset += specialCharset;
	}

	let password = '';

	for (let idx = 0; idx < options.length; idx++) {
		let selectedCharset;

		switch (positions[idx]) {
			case 'l':
				selectedCharset = lowercaseCharset;
				break;
			case 'u':
				selectedCharset = uppercaseCharset;
				break;
			case 'n':
				selectedCharset = numberCharset;
				break;
			case 's':
				selectedCharset = specialCharset;
				break;
			case 'r':
				selectedCharset = charset;
				break;
		}

		password += selectedCharset[random(0, selectedCharset.length - 1)];
	}

	return password;
}

/**
 * https://stackoverflow.com/a/12646864
 * @param {any[]} array
 */
function shuffle (array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = random(0, 1);

		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

/**
 * https://github.com/EFForg/OpenWireless/blob/master/app/js/diceware.js
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function random (min, max) {
	const range = max - min;
	let rval = 0;

	const bits = Math.ceil(Math.log2(range));

	if (bits > 53) {
		throw new Error('cannot generate random number larger than 53 bits');
	}

	const bytes = Math.ceil(bits / 8);
	const mask = (2 ** bits) - 1;

	const arr = new Uint8Array(bytes);
	crypto.getRandomValues(arr);

	let p = (bytes - 1) * 8;

	for (let i = 0; i < bytes; i++) {
		rval += arr[i] * (2 ** p);
		p -= 8;
	}

	rval = rval & mask;

	if (rval >= range) {
		return random(min, max);
	}

	return rval + min;
}

/**
 * @typedef {object} PasswordGenerationOptions
 * @property {number} length Password length
 * @property {number} lowercase Include lowercase characters
 * @property {number} uppercase Include uppercase characters
 * @property {number} number Include number characters
 * @property {number} special Include special characters
 * @property {boolean} ambiguous Include potentially ambiguous characters
 */

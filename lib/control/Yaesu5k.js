/**
 * TODO:
 * AI (AUTO INFORMATION) ?
 * BY (BUSY) ?
 * CO (CONTOUR)
 * DN (DOWN) ?
 * ED/EU (ENCORDER (eh?) DOWN/UP) ?
 * FR (FUNCTION RX)
 * FT (FUNCTION TX)
 * ID (IDENTIFICATION)
 * IF (INFORMATION)
 * MX (MOX)
 * OI (OPPOSITE BAND INFORMATION)
 * PS (POWER SWITCH)
 * QI (QMB STORE)
 * QR (QMB RECALL)
 * QS (QUICK SPLIT)
 */

/**
 * Important commands
 * FA (FREQ VFO-A)
 * FB (FREQ VFO-B)
 */

import { default as Serial, Parity } from './Serial';
import Mode from './Mode';
import Trx from './Trx';
import Trx2 from './Trx2';

export default const Yaesu5k = function(params) {
	if(!params.vfoA) {
		this._serial = new Serial({
			port: params.serial,
			speed: params.bps,
			parity: params.parity
		});
	}
	
	Trx2.call(this);

}.schema({
	port: 'string',
	parity: Parity,
	bps: 'uint'
});

util.inherits(Yaesu5k, Trx2);

Yaesu5k.prototype._read = function(regex) {
	if()	
}.schema(RegExp)


Yaesu5k.prototype.autoUpdate = function(eh) {
	this._serial.on('data', function(buffer) {
		
	})
}

Yaesu5k.prototype._ready = function(callback) {
	var _this = this;

	var p1 = this._readyPromise.then(() => _this._serial.connect() }).then(callback)
	var p2 = timeoutPromise(TIMEOUT).then(() => { throw new Error("Timeout"); })
	
	this._readyPromise = Promise.race(p1, p2)
	return this._readyPromise;
}


/**
 * Waits for pattern 'regex' to appear in stream
 * @param regex {RegExp}
 * @returns {Promise}
 */
Yaesu5k.prototype._wait = function(regex) {
	var s = '',
	    serial = null,
	    resolve = null;
	
	var data = function(buffer) {
		s += buffer.toString();
		var m = regex.exec(s);
		if(m) {
			resolve(m);
			resolve = null;
		}
	}
	
	return this._ready(function(s) {
		return new Promise(function(resolve) {
			resolve = resolve;
			serial = s;
			serial.on('data', data);
			return retPromise
		});
	})
	.then(function(param) {
		if(serial) serial.removeListener('data', data);
		return param;
	})
	.catch(function(error)) {
		if(serial) serial.removeListener('data', data);
		throw error;
	}
}

Yaesu5k.prototype.setFrequency = function(frequency) {
	// example frequency: 14250000

	frequency = String(frequency);
	if(frequency.length > 8) return Promise.reject(new Error('frequency (' + frequency + ') too high'));
	frequency = new Array(8 - frequency.length + 1).join('0') + frequency;

	console.log('setting frequency: ', frequency);
	
	return this.send((this._vfoA ? 'FB' : 'FA') + frequency + ';');
}.schema('uint');

Yaesu5k.prototype.getFrequency = function() {
	var retPromise = this._read(this._vfoA ? /FB([0-9]{8});/ : /FA([0-9]{8});/)
		.then(function(m) {
			return parseInt(m[1]);
		})

	this.send(this._vfoA ? 'FB;' : 'FA;');
	
	return retPromise;
}

Yaesu5k.prototype.setMode = function(mode) {
	
}.schema(Mode);



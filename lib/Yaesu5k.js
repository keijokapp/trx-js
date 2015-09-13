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
	this._serial = new Serial(params);
	this._serial.connection();
}.schema({
	port: 'string',
	parity: Parity,
});

util.inherits(Yaesu5k, Trx2);

/**
 * Waits for pattern 'regex' to appear in stream
 * @param regex {RegExp}
 * @returns {Promise}
 */
Yaesu5k.prototype._wait = function(regex) {
	var s = '', resolve = null;
	
	var data = function(buffer) {
		s += buffer.toString();
		var m = regex.exec(s);
		if(m) {
			resolve(m);
			resolve = null;
		}
	}

	return this.ready(function(s) {
		return (new Promise(function(_resolve) { 
			resolve = _resolve;
			s.on('data', data);
			setTimeout(function() { resolve(/* undefined */); }, TIMEOUT);
		}))
		.then(function(param) {
			s.removeListener('data', data);
			if(arguments.length) return param;
			throw new Error();
		});
	});
}

Yaesu5k.prototype.setFunctionRx = function(rx) {
	return this._ready(function(s) {
		// value mapping:
		// AB
		// 00 <> 01
		// 01 <> 11
		// 10 <> 00
		// 11 <> 10
		// Formula: rxB >> 1 | !rxA
		var rxA = this._vfoB ? rx : this._vfoA._status.functionRx,
		    rxB = this._vfoA ? rx : this._vfoB._status.functionRx;
		s.send('FR' + (rxB >> 1 | !rxA) + ';');
		this._state.functionRx = rx;
	});
}

Yaesu5k.prototype.getFunctionRx = function() {
	return this._ready(function(s) {
		var r = this._wait()
		.then(function(param) {
			// value mapping:
			//       AB
			// 00 <> 10
			// 01 <> 00
			// 10 <> 11
			// 11 <> 01
			var rxA = !param[1],
				rxB = !!param[0];
			if(this._vfoA) {
				this._vfoA.emit('status', {
					functionRx: rxA
				});
				this.emit('status', {
					functionRx: rxB
				});
			} else {
				this.emit('status', {
					functionRx: rxA
				});
				if(this._vfoB)
					this._vfoB.emit('status', {
						functionRx: rxB
					});
			}
		});
	});
};

Yaesu5k.prototype.setFrequency = function(frequency) {
	return this.ready(function(s) {
		
	});
}

Yaesu5k.prototype._setCommand = function(command, params) {
	assert(command.length == 2);

	this._serial
	.then(function(s) {
		s.send(command + params + ';');
		return s;
	});
}.schema('string', 'string');

Yaesu5k.prototype._getCommand = function(command, param) {
	assert(command.length == 2);

	this._serial
	.then(function(s) {
		s.send(command + param + ';');
		return this._waitFor(command + param)
	});
}.schema('string', 'string');


Yaesu5k.prototype.frequency = function(freq) {
	if(Number.isInteger(freq))
		return this._setCommand('FA', (this._secondary ? '1' : '0') + freq);
	else
		return this._readCommand('FA')
			.then(function() {
				
			});
}.schema(['uint', 'undefined']);

Yaesu5k.prototype.mode = function(mode) {
	
}.schema(Mode);



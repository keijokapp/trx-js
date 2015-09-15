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

	this._waitPromise = null;

	Trx2.call(this);
}.schema({
	port: 'string',
	parity: Parity,
});

util.inherits(Yaesu5k, Trx2);

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

Yaesu5k.prototype.setFunctionRx = function(rx) {
	return this._ready(function(s) {
		// value mapping:
		// AB
		// 00 <> 01
		// 01 <> 11
		// 10 <> 00
		// 11 <> 10
		var rxA = this._vfoA ? this._vfoA._status.functionRx : rx,
		    rxB = this._vfoB ? this._vfoB._status.functionRx : rx;
		s.send('FR' + (rxB ? '1' : '0') + (rxA ? '0' : '1') + ';');
		this._state.functionRx = rx;
	});
}

Yaesu5k.prototype.getFunctionRx = function() {
	var _this = this;
	
	return this._wait(/FR([10]{2});/)
		.then(function(param) {
			console.log('functionRx answer: ', param);
			// value mapping:
			//       AB
			// 00 <> 10
			// 01 <> 00
			// 10 <> 11
			// 11 <> 01
			var rxA = !param[1],
				rxB = !!param[0];
			if(_this._vfoA) {
				this._vfoA.emit('status', {
					functionRx: rxA
				});
				this.emit('status', {
					functionRx: rxB
				});
			} else {
				_this.emit('status', {
					functionRx: rxA
				});
				if(_this._vfoB)
					_this._vfoB.emit('status', {
						functionRx: rxB
					});
			}
		});
};

Yaesu5k.prototype.setFrequency = function(frequency) {
	return this._ready(function(s) {
		var rxA = this._vfoB ? rx : this._vfoA._status.functionRx,
		s.send('FR' + (rxB >> 1 | !rxA) + ';');
		this._state.functionRx = rx;
	});
}


Yaesu5k.prototype.mode = function(mode) {
	
}.schema(Mode);



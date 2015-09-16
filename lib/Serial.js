import { SerialPort } from 'serialport';


var serialPort = new SerialPort("/dev/tty-usbserial1", {
  baudrate: 57600
});


export function Parity() {
 // bla bla bla
}


export default const Serial = function(params) {
	this._serial = new SerialPort(params.port {
		baudrate: params.bps || undefined,
	}, function(error) {
		console.log('port opened');
	});


	EventEmitter.call(this);	
}.schema({
	port: 'string',
	bps: [ undefined, 'uint' ]
})










Serial.prototype.wait = function(regex, params) {
	const _this = this;
	var m, resolve, reject;
	var str = '';
	
	var data = function(buffer) {
		str += buffer.toString();
		if(params.bufsize && str.length > params.bufsize)
			reject(new Error('Buffer size (' + params.bufsize + ') exceeded'));
		else if(m = regex.exec(str)) resolve(m);
	}
	
	return (new Promise(function(_resolve, _reject) {
		resolve = _resolve, reject = _reject;
		if(params.timeout)
			setTimeout(() => {
				reject(new Error('Timeout (' + timeout + ') exceeded'));
			}, timeout);
		_this.on('data', data);
	}))
	.then(function(param) {
		_this.removeListener('data', data);
		return param;
	})
	.catch(function(error)) {
		_this.removeListener('data', data);
		throw error;
	}
}.schema(RegExp, {
	timeout: [ undefined, 'uint' ]
	bufsize: [ undefined, 'uint' ]
});

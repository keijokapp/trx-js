import { SerialPort as Serial } from 'serialport';

export default function TrxConnection(param) {
	this._serial = new SerialPort({
		baudrate: 9600
	});
	this._serial.on('open', function() {
		
	});

	this._buffer = ''; // input buffer
	this._serial.on('data', function(buffer) {
		
//		this._buffer += 
	});
}

TrxConnection.prototype.frequency = function(freq) {
	return this.connection()
	.then(function() {
		if(Number.isInteger(freq)) {
			return this.// ...	
		} else {
		
		}
	}
}

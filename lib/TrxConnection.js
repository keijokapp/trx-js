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

TrxConnection.prototype.connection = function() {
	return this._connection
}

TrxConnection.prototype.frequency = function(freq) {
	return this.connection()
	.then(function() {
		if(Number.isInteger(freq)) {
			// send get reqest to serial port
			
			return //this.// ...	
		} else {
		
		}
	}
}


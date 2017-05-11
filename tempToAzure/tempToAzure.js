'use strict';

const dht = require('node-dht-sensor');
const Protocol = require('azure-iot-device-mqtt').Mqtt;

const Client = require('azure-iot-device').Client;
const Message = require('azure-iot-device').Message;

const connectionString = 'HostName=hollierDevices.azure-devices.net;DeviceId=foobar;SharedAccessKey=B3+01GKhZnkIXoqUazHGCKfxugQZSQIPhE3/xZsTE+k=';

let client = Client.fromConnectionString(connectionString, Protocol);

let msgInterval = client.open((error) => {

	if (error) {
		console.error(`Error connectiong to hub: ${error.message}`);
	} else {
		console.log('Connected to the Azure IoT hub');

		client.on('error', (error) => {
			console.error(`${error.message}`);
		});

		client.on('disconnect', () => {
			clearInterval(msgInterval);
			client.removeAllListeners();
		});


		setInterval(() => {
			dht.read(11, 4, (error, temperature, humidity) => {
				if (!error) {
					console.log(`Temperature: ${temperature.toFixed(1)}C - Humidity: ${humidity.toFixed(1)}%`);

					// write the values to the IoT hub
					let data = JSON.stringify({ deviceId: 'foobar', temperature: temperature.toFixed(1), humidity: humidity.toFixed(1) });
      					let message = new Message(data);
					client.sendEvent(message, (error, result) => {
						if (error) {
							console.error(`Error sending message to the hub: ${error.toString()}`);
						} else {
							console.log(`Message send result: ${result.constructor.name}`);
						}
					});
				} else {
					console.error(`DHT sensor error: ${error}`);
				}
			});
		}, 10000);
	}
});

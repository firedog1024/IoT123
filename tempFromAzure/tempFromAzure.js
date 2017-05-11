'use strict';

const Protocol = require('azure-iot-device-mqtt').Mqtt;
const Client = require('azure-iot-device').Client;

const PythonShell = require('python-shell') 

const connectionString = 'HostName=hollierDevices.azure-devices.net;DeviceId=barfoo;SharedAccessKey=XwniLR1JsFq8w/pEvM42oG8YRB/qw0TZVqwU3H5xo28=';

let client = Client.fromConnectionString(connectionString, Protocol);
let displayTemp = true;

client.open((error) => {
    if (error) {
       console.error(`Could not connect: ${error.message}`);
    } else {
       const options = { mode: 'text', pythonOptions: ['-u'] };
       let pyshell = new PythonShell('display.py');

       console.log('Connected to IoT hub - waiting for messages');

       client.on('message', (msg) => {
          console.log(`Incoming message [Id: ${msg.messageId} - Body: ${msg.data}]`);

          let data = JSON.parse(msg.data);

          if (data.deviceId === 'foobar') {
             if (displayTemp) {
                pyshell.send(`|t|${data.temperature}`);
             } else {
                pyshell.send(`|h|${data.humidity}`);
             }
          } 
          else if (data.deviceId === 'switcher') {
             if (data.display === 'temperature') {
                displayTemp = true;
		console.log('change display to temperature');
             } else {
                displayTemp = false;
                console.log('change display to humidity');
             }
          }	

          client.complete(msg, (error, result) => {
             if (error) {
                console.error(`Complete message error ${error.toString()}`);
             }
          });
       });

       client.on('error', (err) => {
          console.error(err.message);
       });

       client.on('disconnect', () => {
          client.removeAllListeners();
       });
    }
});

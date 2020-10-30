// Loading CS Interface and express via npm
const csInterface = new CSInterface();
const loc = window.location.pathname;
const dir = decodeURI(loc.substring(1, loc.lastIndexOf('/')));
/** @type {import("socket.io")} */
const io = require(dir + "/node_modules/socket.io/lib/index.js");
const fs = require('fs');

let port = 42300;
const portFile = "port.txt";
/** @type {import("socket.io").Server} */
let server = undefined;

function init() {

    // Port persistence
    try {
        port = parseInt(fs.readFileSync(portFile));
    } catch (e) {
        fs.writeFileSync(portFile, port);
    }
    document.getElementById('portInput').value = port;

    // Server handling
    restartServer(port);

    document.getElementById("statusContainer").innerHTML = "Ready!";
    document.getElementById("statusContainer").className = "green";
}

function restartServer(serverPort) {

    if (serverPort > 65535) {
        console.log("Port number to high. So damn high!")
        return;
    }

    // Stop server, save file, start server
    if (server) {
        server.close();
    }
    fs.writeFileSync(portFile, serverPort);
    server = io.listen(serverPort);

    let ready = true;

    server.on('connection', function (socket) {
        socket.on('event', function (data) {
            console.log("Received: " + data);
            if (ready) {
                ready = false;
                document.getElementById('lastCommandContainer').innerHTML = 'Event: ' + data.name;
                csInterface.evalScript("demo.receiveEvent(" + JSON.stringify(data) + ");", function () {
                    ready = true;
                })
            } else {
                console.log("Dumped: " + data);
            }
        });
    });
}

function openHostWindow() {
    console.log('start "' + dir + '"');
    require('child_process').exec('start "" "' + dir + '/../host"');
}

function changeView(settingsView) {
    if (settingsView) {
        document.getElementById("defaultView").className = "notSoVisible";
        document.getElementById("settingsView").className = "visible";
    } else {
        document.getElementById("defaultView").className = "visible";
        document.getElementById("settingsView").className = "notSoVisible";
    }
}

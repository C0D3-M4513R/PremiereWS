// Loading CS Interface and express via npm
const csInterface = new CSInterface();
const loc = window.location.pathname;
const dir = decodeURI(loc.substring(1, loc.lastIndexOf('/')));
const io = require(dir + "/node_modules/socket.io/lib/index.js");

function init() {

    const server = io.listen(42300);

    server.on('connection', function (socket) {
        socket.on('hello', function (data) {
            csInterface.evalScript("demo.showMsg('Got " + data + "');")
        });
    });

    csInterface.evalScript("demo.showMsg('Hell orld!');")

    document.getElementById("statusContainer").innerHTML = "Ready!";
    document.getElementById("statusContainer").className = "green";
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

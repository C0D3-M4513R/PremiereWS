// Loading CS Interface and express via npm
const csInterface = new CSInterface();
const loc = window.location.pathname;
const dir = decodeURI(loc.substring(1, loc.lastIndexOf('/')));

function init() {

    // TODO: Initialize stuff
    csInterface.evalScript("demo.showMsg('Hell orld!');")

    document.getElementById("statusContainer").innerHTML = "Ready!";
    document.getElementById("statusContainer").className = "green";
}

function openHostWindow() {
    console.log('start "' + dir + '"');
    require('child_process').exec('start "" "' + dir + '/../host"');
}

function changeView(settingsView) {
    if(settingsView) {
        document.getElementById("defaultView").className = "notSoVisible";
        document.getElementById("settingsView").className = "visible";
    } else {
        document.getElementById("defaultView").className = "visible";
        document.getElementById("settingsView").className = "notSoVisible";
    }
}

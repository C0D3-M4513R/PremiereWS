/// <reference path="../typings/JavaScript.d.ts"/>
/// <reference path="../typings/PlugPlugExternalObject.d.ts"/>
/// <reference path="../typings/PremierePro.14.0.d.ts"/>
/// <reference path="../typings/XMPScript.d.ts"/>
/// <reference path="../typings/extendscript.d.ts"/>
/// <reference path="../typings/global.d.ts"/>
var demo = {
    showMsg: function () {
        alert("Hello World!");
    },
    setZoom: function (zoomLevel) {
        setZoomOfCurrentClip(zoomLevel);
        return true;
    },
    receiveEvent: function (data) {
        switch (data.name) {
            case "zoom":
                break;
            case "move":
                break;
        }
        return true;
    }
};




function setZoomOfCurrentClip(zoomLevel) {
    var clipInfo = getFirstSelectedClip(true);
    var scaleInfo = clipInfo.clip.components[1].properties[1];
    scaleInfo.setValue(zoomLevel, true);
    return true;
}
function getFirstSelectedClip(videoClip) {
    var currentSequence = app.project.activeSequence;
    var tracks = videoClip ? currentSequence.videoTracks : currentSequence.audioTracks;
    for (var i = 0; i < tracks.numTracks; i++) {
        for (var j = 0; j < tracks[i].clips.numItems; j++) {
            var currentClip = tracks[i].clips[j];
            if (currentClip.isSelected()) {
                return {
                    clip: currentClip,
                    trackIndex: i,
                    clipIndex: j
                };
            }
        }
    }
    return null;
}

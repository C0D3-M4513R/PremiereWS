// type WSEvent = ZoomEvent | MoveEvent | RotateEvent | OpacityEvent | AudioLevelEvent | LumetriEvent;
/// <reference path="../typings/JavaScript.d.ts"/>
/// <reference path="../typings/PlugPlugExternalObject.d.ts"/>
/// <reference path="../typings/PremierePro.14.0.d.ts"/>
/// <reference path="../typings/XMPScript.d.ts"/>
/// <reference path="../typings/extendscript.d.ts"/>
/// <reference path="../typings/global.d.ts"/>
/// <reference path="events.ts"/>
//Tell TypeScript, if something is of a particular type
function castRelativeEvent(data) {
    return "delta" in data;
}
function castAbsoluteEvent(data) {
    return "level" in data;
}
function castResetEvent(data) {
    return "reset" in data;
}
function castMoveEvent(data) {
    return "move" === data.name;
}
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
            case "move":
                if (castResetEvent(data) && data.reset) {
                    resetPositionOfCurrentClip();
                }
                else if (castMoveEvent(data)) {
                    moveCurrentClip(data.deltaX, data.deltaY);
                }
                break;
            case "zoom":
                if (castRelativeEvent(data) && data.delta) {
                    changeZoomOfCurrentClip(data.delta);
                }
                else if (castAbsoluteEvent(data) && data.level) {
                    setZoomOfCurrentClip(data.level);
                }
                break;
            case "rotate":
                if (castRelativeEvent(data) && data.delta) {
                    rotateCurrentClip(data.delta);
                }
                else if (castAbsoluteEvent(data) && data.level) {
                    setRotationOfCurrentClip(data.level);
                }
                break;
            case "opacity":
                if (castRelativeEvent(data) && data.delta) {
                    changeOpacityOfCurrentClip(data.delta);
                }
                else if (castAbsoluteEvent(data) && data.level) {
                    setOpacityOfCurrentClip(data.level);
                }
                break;
            case "audio":
                if (castRelativeEvent(data) && data.delta) {
                    changeAudioLevel(data.delta);
                }
                break;
            case "lumetri":
                // TODO (1): Implement
                // TODO (2): Create enum-like structure for easier property selection
                break;
        }
    }
};
function moveCurrentClip(deltaX, deltaY) {
    var clipInfo = getFirstSelectedClip(true);
    var positionInfo = clipInfo.clip.components[1].properties[0];
    var _a = positionInfo.getValue(), positionX = _a[0], positionY = _a[1];
    positionInfo.setValue([positionX + deltaX, positionY + deltaY], true);
}
function resetPositionOfCurrentClip() {
    var clipInfo = getFirstSelectedClip(true);
    var positionInfo = clipInfo.clip.components[1].properties[0];
    positionInfo.setValue([0.5, 0.5], true);
}
function setZoomOfCurrentClip(zoomLevel) {
    var clipInfo = getFirstSelectedClip(true);
    var scaleInfo = clipInfo.clip.components[1].properties[1];
    scaleInfo.setValue(zoomLevel, true);
}
function changeZoomOfCurrentClip(delta) {
    var clipInfo = getFirstSelectedClip(true);
    var scaleInfo = clipInfo.clip.components[1].properties[1];
    var current = scaleInfo.getValue();
    scaleInfo.setValue(current + delta, true);
}
function setRotationOfCurrentClip(level) {
    var clipInfo = getFirstSelectedClip(true);
    var info = clipInfo.clip.components[1].properties[4];
    info.setValue(level, true);
}
function rotateCurrentClip(delta) {
    var clipInfo = getFirstSelectedClip(true);
    var info = clipInfo.clip.components[1].properties[4];
    var current = info.getValue();
    info.setValue(current + delta, true);
}
function setOpacityOfCurrentClip(level) {
    var clipInfo = getFirstSelectedClip(true);
    var info = clipInfo.clip.components[0].properties[0];
    info.setValue(level, true);
}
function changeOpacityOfCurrentClip(delta) {
    var clipInfo = getFirstSelectedClip(true);
    var info = clipInfo.clip.components[0].properties[0];
    var current = info.getValue();
    info.setValue(current + delta, true);
}
function changeAudioLevel(levelInDb) {
    var clipInfo = getFirstSelectedClip(false);
    var levelInfo = clipInfo.clip.components[0].properties[1];
    var level = 20 * Math.log(parseFloat(levelInfo.getValue())) * Math.LOG10E + 15;
    var newLevel = level + levelInDb;
    var encodedLevel = Math.min(Math.pow(10, (newLevel - 15) / 20), 1.0);
    levelInfo.setValue(encodedLevel, true);
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

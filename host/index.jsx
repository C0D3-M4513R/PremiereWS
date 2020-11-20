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
            case "move":
                if (data.reset) {
                    resetPositionOfCurrentClip();
                }
                else {
                    moveCurrentClip(data.deltaX, data.deltaY);
                }
                break;
            case "zoom":
                if (data.reset) {
                    setZoomOfCurrentClip(100);
                }
                else if (data.delta) {
                    changeZoomOfCurrentClip(data.delta);
                }
                else if (data.level) {
                    setZoomOfCurrentClip(data.level);
                }
                break;
            case "rotate":
                if (data.reset) {
                    setRotationOfCurrentClip(0);
                }
                else if (data.delta) {
                    rotateCurrentClip(data.delta);
                }
                else if (data.level) {
                    setRotationOfCurrentClip(data.level);
                }
                break;
            case "opacity":
                if (data.reset) {
                    setOpacityOfCurrentClip(100);
                }
                else if (data.delta) {
                    changeOpacityOfCurrentClip(data.delta);
                }
                else if (data.level) {
                    setOpacityOfCurrentClip(data.level);
                }
                break;
            case "audio":
                changeAudioLevel(data.delta);
                break;
            case "lumetri":
                if (data.reset) {
                    resetLumetriProperty(data.property);
                }
                else if (data.delta) {
                    changeLumetriProperty(data.delta, data.property, true);
                }
                else if (data.level) {
                    changeLumetriProperty(data.level, data.property, false);
                }
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
/**
 * Changes the selected property of the current clip's first lumetri component.
 * @param data the relative or absolut value to set or add
 * @param propertyIndex the index of the property to change
 * @param relative true, if the change shall be relative
 */
function changeLumetriProperty(data, propertyIndex, relative) {
    var lumetri = getLumetriComponent();
    if (lumetri) {
        var property = lumetri.properties[propertyIndex];
        if (relative) {
            property.setValue(property.getValue() + data, true);
        }
        else {
            property.setValue(data, true);
        }
    }
}
/**
 * Resets the selected property of the current clip's first lumetri component.
 * @param propertyIndex
 */
function resetLumetriProperty(propertyIndex) {
    // FIXME: Not all properties of lumetri are currently supported
    var lumetri = getLumetriComponent();
    if (lumetri) {
        var property = lumetri.properties[propertyIndex];
        if (propertyIndex == 24 || propertyIndex == 31 || propertyIndex == 36) {
            property.setValue(100, true);
        }
        else {
            property.setValue(0, true);
        }
    }
}
/**
 * Returns the lumetri component of the currently selected clip or undefined.
 */
function getLumetriComponent() {
    var clip = getFirstSelectedClip(true).clip;
    for (var i = 2; i < clip.components.length; i++) {
        if (clip.components[i].properties[2].displayName && clip.components[i].properties[2].displayName === "Einfache Korrektur") {
            return clip.components[i];
        }
    }
    return undefined;
}

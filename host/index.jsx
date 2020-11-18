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
    receiveEvent: function (data) {
        switch (data.name) {
            case "move":
                if (castResetEvent(data) && data.reset) {
                    modifyClip(new ModifyInfo(1, 0), function () {
                        return [0.5, 0.5];
                    });
                }
                else if (castMoveEvent(data)) {
                    modifyClip(new ModifyInfo(1, 0), function (info) {
                        var value = info.getValue();
                        return [value[0] + data.deltaX, value[1] + data.deltaY];
                    });
                }
                break;
            case "zoom":
                if (castRelativeEvent(data) && data.delta) {
                    modifyClip(new ModifyInfo(1, 1), function (info) {
                        return info.getValue() + data.delta;
                    });
                }
                else if (castAbsoluteEvent(data) && data.level) {
                    modifyClip(new ModifyInfo(1, 1), function () {
                        return data.level;
                    });
                }
                break;
            case "rotate":
                if (castRelativeEvent(data) && data.delta) {
                    modifyClip(new ModifyInfo(1, 4), function (info) {
                        return info.getValue() + data.delta;
                    });
                }
                else if (castAbsoluteEvent(data) && data.level) {
                    modifyClip(new ModifyInfo(1, 4), function () {
                        return data.level;
                    });
                }
                break;
            case "opacity":
                if (castRelativeEvent(data) && data.delta) {
                    modifyClip(new ModifyInfo(0, 0), function (info) {
                        return info.getValue() + data.delta;
                    });
                }
                else if (castAbsoluteEvent(data) && data.level) {
                    modifyClip(new ModifyInfo(0, 0), function () {
                        return data.level;
                    });
                }
                break;
            case "audio":
                if (castRelativeEvent(data) && data.delta) {
                    modifyClip(new ModifyInfo(0, 0), function (info) {
                        return levelToDB(dbToLevel(parseFloat(info.getValue())) + data.delta);
                    });
                }
                break;
            case "lumetri":
                // TODO (1): Implement
                // TODO (2): Create enum-like structure for easier property selection
                break;
        }
    }
};
var ModifyInfo = /** @class */ (function () {
    function ModifyInfo(component, property, videoClip, setInfoBool) {
        if (videoClip === void 0) { videoClip = true; }
        if (setInfoBool === void 0) { setInfoBool = true; }
        this.component = component;
        this.property = property;
        this.videoClip = videoClip;
        this.setInfoBool = setInfoBool;
    }
    return ModifyInfo;
}());
/**
 * Modify the clip according
 * @param setting Which clip should get modified?
 * @param processor How should that clip get modified?
 */
function modifyClip(setting, processor) {
    var clipInfo = getFirstSelectedClip(setting.videoClip);
    var info = clipInfo.clip.components[setting.component].properties[setting.property];
    info.setValue(processor(info), setting.setInfoBool);
}
function dbToLevel(db) {
    return 20 * Math.log(db) * Math.LOG10E + 15;
}
function levelToDB(level) {
    return Math.min(Math.pow(10, (level - 15) / 20), 1.0);
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

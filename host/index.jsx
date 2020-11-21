/// <reference path="../typings/JavaScript.d.ts"/>
/// <reference path="../typings/PlugPlugExternalObject.d.ts"/>
/// <reference path="../typings/PremierePro.14.0.d.ts"/>
/// <reference path="../typings/XMPScript.d.ts"/>
/// <reference path="../typings/extendscript.d.ts"/>
/// <reference path="../typings/global.d.ts"/>
/// <reference path="events.ts"/>
var _a, _b;
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
var demo = {
    showMsg: function () {
        alert("Hello World!");
    },
    receiveEvent: function (data) {
        modifyClip(data);
    }
};
/**
 * This defines all Information about the Modification
 */
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
var Infos = (_a = {},
    _a["move"] = new ModifyInfo(1, 0),
    _a["zoom"] = new ModifyInfo(1, 1),
    _a["rotate"] = new ModifyInfo(1, 4),
    _a["opacity"] = new ModifyInfo(0, 0),
    _a["audio"] = new ModifyInfo(0, 1, false),
    _a["lumetri"] = new ModifyInfo(null, null) //This is still relevant for the other properties
,
    _a);
var defaultSetFunc = function (info, data) { return data.level; };
var defaultChangeFunc = function (info, data) { return info.getValue() + data.delta; };
/**
 * Explicitly Define, which function does what.
 * This will Hold, all Functions, that do stuff, for a single Event
 */
var ClipModifyFunctionHolder = /** @class */ (function () {
    function ClipModifyFunctionHolder(Change, Set, Reset, GetClip, GetInfo) {
        if (GetClip === void 0) { GetClip = defaultGetClip; }
        if (GetInfo === void 0) { GetInfo = defaultGetInfo; }
        this.Change = Change;
        this.Set = Set;
        this.Reset = Reset;
        this.GetClip = GetClip;
        this.GetInfo = GetInfo;
    }
    return ClipModifyFunctionHolder;
}());
var defaultGetClip = function (setting) { return getFirstSelectedClip(setting.videoClip); };
var defaultGetInfo = function (clip, setting) { return clip.clip.components[setting.component].properties[setting.property]; };
/**
 * The way the Data is laid out here is defined by {@link ClipModifyFunctionHolder}.
 * This will hold all Functions for all Events
 */
var Processor = (_b = {},
    _b["move"] = new ClipModifyFunctionHolder(function (info, data) {
        var value = info.getValue();
        return [value[0] + data.delta[0], value[1] + data.delta[1]];
    }, function (info, data) { return [data.level[0], data.level[1]]; }, function () { return [0.5, 0.5]; }),
    _b["zoom"] = new ClipModifyFunctionHolder(defaultChangeFunc, defaultSetFunc, function () { return 100; }),
    _b["rotate"] = new ClipModifyFunctionHolder(defaultChangeFunc, defaultSetFunc, function () { return 0; }),
    _b["opacity"] = new ClipModifyFunctionHolder(defaultChangeFunc, defaultSetFunc, function () { return 100; }),
    _b["audio"] = new ClipModifyFunctionHolder(function (info, data) { return levelToDB(dbToLevel(parseFloat(info.getValue())) + data.delta); }, function (info, data) { return levelToDB(data.level); }, function () { return levelToDB(0); }),
    _b["lumetri"] = new ClipModifyFunctionHolder(defaultChangeFunc, defaultSetFunc, function (info, data) {
        if (data.property == 24 || data.property == 31 || data.property == 36)
            return 100;
        return 0;
    }, getLumetriComponent, function (clip, setting, data) { return clip.properties[data.property]; }),
    _b);
/**
 * Modify the clip according
 */
function modifyClip(data) {
    var setting = Infos[data.name];
    var proc = Processor[data.name];
    var clipInfo = proc.GetClip(setting);
    var info = proc.GetInfo(clipInfo, setting, data);
    var func;
    //This is basically tricking the compiler?
    //Get Function
    if (castResetEvent(data) && data["reset"]) {
        func = proc.Reset;
    }
    else if (castAbsoluteEvent(data) && data["level"]) {
        func = proc.Set;
    }
    else if (castRelativeEvent(data) && data["delta"]) {
        func = proc.Change;
    }
    else {
        alert("Event not Found. Was the sent data correct?");
    }
    alert("setting value:" + func(info, data));
    info.setValue(func(info, data), setting.setInfoBool);
}
/**
 * Convert from db to an audio Level?
 * @param db db number to convert
 */
function dbToLevel(db) {
    return 20 * Math.log(db) * Math.LOG10E + 15;
}
/**
 * Converts an audio level to a db number
 * @param level
 */
function levelToDB(level) {
    return Math.min(Math.pow(10, (level - 15) / 20), 1.0);
}
/**
 * Returns the lumetri component of the currently selected clip or undefined.
 */
function getLumetriComponent() {
    var clip = getFirstSelectedClip(true).clip;
    for (var i = 2; i < clip.components.length; i++) {
        if (clip.components[i].properties[2].displayName && clip.components[i].properties[2].displayName === "Basic Correction") {
            return clip.components[i];
        }
    }
    return undefined;
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

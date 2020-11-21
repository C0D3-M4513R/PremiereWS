/// <reference path="../typings/JavaScript.d.ts"/>
/// <reference path="../typings/PlugPlugExternalObject.d.ts"/>
/// <reference path="../typings/PremierePro.14.0.d.ts"/>
/// <reference path="../typings/XMPScript.d.ts"/>
/// <reference path="../typings/extendscript.d.ts"/>
/// <reference path="../typings/global.d.ts"/>
/// <reference path="events.ts"/>

declare interface Track {
  overwriteClip(clipProjectItem: ProjectItem, time: Time): void;
}

//Tell TypeScript, if something is of a particular type
function castRelativeEvent<D>(data:WSEvent): data is RelativeEvent<D>{
  return "delta" in data
}
function castAbsoluteEvent<D>(data:WSEvent): data is AbsoluteEvent<D>{
  return "level" in data
}
function castResetEvent(data:WSEvent): data is ResetEvent{
  return "reset" in data
}

var demo = {
  showMsg: function () {
    alert("Hello World!")
  },
  receiveEvent: function (data: WSEvent) {
    modifyClip(data)
  }
}

/**
 * This defines all Information about the Modification
 */
class ModifyInfo{
  constructor(
      public component:number,
      public property:number,
      public videoClip:boolean=true,
      public setInfoBool:boolean=true
  ) {
  }
}

const Infos:Record<string,ModifyInfo>={
  ["move"]:new ModifyInfo(1, 0),
  ["zoom"]:new ModifyInfo(1, 1),
  ["rotate"]:new ModifyInfo(1,4),
  ["opacity"]:new ModifyInfo(0,0),
  ["audio"]:new ModifyInfo(0,1,false),
  ["lumetri"]:new ModifyInfo(null,null)//This is still relevant for the other properties
}

/**
 * Defines a Function Type, for easier use
 */
type ClipModifyFunction<T>=(info:any,data:T)=>any
const defaultSetFunc:ClipModifyFunction< AbsoluteEvent<number> >=(info, data) => {return data.level};
const defaultChangeFunc:ClipModifyFunction< RelativeEvent<number> >=(info, data) => {return info.getValue() + data.delta};
/**
 * Explicitly Define, which function does what.
 * This will Hold, all Functions, that do stuff, for a single Event
 */
class ClipModifyFunctionHolder<T>{
  constructor(public Change: ClipModifyFunction<T>,
              public Set: ClipModifyFunction<T>,
              public Reset: ClipModifyFunction<T>,
              public GetClip: (setting:ModifyInfo) => any = defaultGetClip,
              public GetInfo: (clip,setting:ModifyInfo,data:T) => any = defaultGetInfo) {
  }
}
const defaultGetClip = (setting)=>getFirstSelectedClip(setting.videoClip)
const defaultGetInfo = (clip,setting)=>clip.clip.components[setting.component].properties[setting.property]
/**
 * The way the Data is laid out here is defined by {@link ClipModifyFunctionHolder}.
 * This will hold all Functions for all Events
 */
const Processor: Record<string, ClipModifyFunctionHolder<WSEvent>> = {
  ["move"]: new ClipModifyFunctionHolder<MoveEvent>(
      (info, data) => {
        const value = info.getValue()
        return [value[0] + data.delta[0], value[1] + data.delta[1]]
      },
      (info, data: MoveEvent) => [data.level[0], data.level[1]],
      () => [0.5, 0.5]
  ),
  ["zoom"]: new ClipModifyFunctionHolder<ZoomEvent>(defaultChangeFunc,defaultSetFunc,() =>100),
  ["rotate"]: new ClipModifyFunctionHolder<RotateEvent>(defaultChangeFunc,defaultSetFunc,() =>0),
  ["opacity"]: new ClipModifyFunctionHolder<OpacityEvent>(defaultChangeFunc,defaultSetFunc,() =>100),
  ["audio"]: new ClipModifyFunctionHolder<AudioLevelEvent>(
      (info, data) => {return levelToDB(dbToLevel(parseFloat(info.getValue())) + data.delta)},
      (info, data) => {return levelToDB(data.level)},
      () => {return levelToDB(0)}),
  ["lumetri"]: new ClipModifyFunctionHolder<LumetriEvent>(defaultChangeFunc, defaultSetFunc, (info, data) => {
    if (data.property == 24 || data.property == 31 || data.property == 36) return 100;
    return 0;
  },getLumetriComponent,(clip, setting,data) => clip.properties[data.property] )
}

/**
 * Modify the clip according
 */
function modifyClip<T extends WSEvent>(data:T){
  const setting:ModifyInfo = Infos[data.name]
  const proc:ClipModifyFunctionHolder<T> = Processor[data.name]

  const clipInfo = proc.GetClip(setting)
  const info = proc.GetInfo(clipInfo,setting,data)

  let func;
  //This is basically tricking the compiler?
  //Get Function
  if(castResetEvent(data)&&data["reset"]){
    func=proc.Reset
  }else if (castAbsoluteEvent(data)&&data["level"]){
    func=proc.Set
  }else if (castRelativeEvent(data)&&data["delta"]){
    func=proc.Change
  } else {
    alert("Event not Found. Was the sent data correct?")
  }
  alert("setting value:" +func(info,data))
  info.setValue(func(info,data), setting.setInfoBool)
}

/**
 * Convert from db to an audio Level?
 * @param db db number to convert
 */
function dbToLevel(db:number){
  return 20 * Math.log(db) * Math.LOG10E + 15;
}

/**
 * Converts an audio level to a db number
 * @param level
 */
function levelToDB(level:number){
  return Math.min(Math.pow(10, (level - 15)/20), 1.0);
}

/**
 * Returns the lumetri component of the currently selected clip or undefined.
 */
function getLumetriComponent(): any {
  const clip = getFirstSelectedClip(true).clip
  for (let i = 2; i < clip.components.length; i++) {
    if (clip.components[i].properties[2].displayName && clip.components[i].properties[2].displayName === "Basic Correction") {
      return clip.components[i]
    }
  }
  return undefined
}

function getFirstSelectedClip(videoClip: boolean) {
  const currentSequence = app.project.activeSequence;
  const tracks = videoClip ? currentSequence.videoTracks : currentSequence.audioTracks;
  for (let i = 0; i < tracks.numTracks; i++) {
    for (let j = 0; j < tracks[i].clips.numItems; j++) {
      const currentClip = tracks[i].clips[j];
      if (currentClip.isSelected()) {
        return {
          clip: currentClip,
          trackIndex: i,
          clipIndex: j
        }
      }
    }
  }
  return null;
}

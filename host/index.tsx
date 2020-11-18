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
function castRelativeEvent(data:WSEvent): data is RelativeEvent{
  return "delta" in data
}
function castAbsoluteEvent(data:WSEvent): data is AbsoluteEvent{
  return "level" in data
}
function castResetEvent(data:WSEvent): data is ResetEvent{
  return "reset" in data
}
function castMoveEvent(data:WSEvent): data is MoveEvent{
  return "move"===data.name
}


var demo = {
  showMsg: function () {
    alert("Hello World!")
  },
  receiveEvent: function (data: WSEvent) {
    switch (data.name) {
      case "move":
        if (castResetEvent(data)&&data.reset) {
          modifyClip(new ModifyInfo(1,0),() => {
            return [0.5,0.5]
          })
        } else if (castMoveEvent(data)){
          modifyClip(new ModifyInfo(1,0),(info) => {
            const value=info.getValue()
            return [value[0]+data.deltaX,value[1]+data.deltaY]
          })
        }
        break;
      case "zoom":
        if (castRelativeEvent(data)&&data.delta) {
          modifyClip(new ModifyInfo(1,1),(info) => {
            return info.getValue()+data.delta
          })
        } else if (castAbsoluteEvent(data)&&data.level) {
          modifyClip(new ModifyInfo(1,1),() => {
            return data.level
          })
        }
        break;
      case "rotate":
        if (castRelativeEvent(data)&&data.delta) {
          modifyClip(new ModifyInfo(1,4),(info) => {
            return info.getValue()+data.delta
          })
        } else if (castAbsoluteEvent(data)&&data.level) {
          modifyClip(new ModifyInfo(1,4),() => {
            return data.level
          })
        }
        break;
      case "opacity":
        if (castRelativeEvent(data)&&data.delta) {
          modifyClip(new ModifyInfo(0,0),(info) => {
            return info.getValue()+data.delta
          })
        } else if (castAbsoluteEvent(data)&&data.level) {
          modifyClip(new ModifyInfo(0,0),() => {
            return data.level
          })
        }
        break;
      case "audio":
        if(castRelativeEvent(data)&&data.delta){
          modifyClip(new ModifyInfo(0,0),(info) => {
            return levelToDB(dbToLevel(parseFloat(info.getValue()))+data.delta)
          })
        }
        break;
      case "lumetri":

        // TODO (1): Implement
        // TODO (2): Create enum-like structure for easier property selection
        break;
    }
  }
}

class ModifyInfo{
  constructor(
      public component:number,
      public property:number,
      public videoClip:boolean=true,
      public setInfoBool:boolean=true
  ) {
  }

}

/**
 * Modify the clip according
 * @param setting Which clip should get modified?
 * @param processor How should that clip get modified?
 */
function modifyClip(setting:ModifyInfo, processor: (info:any)=>any){
  const clipInfo = getFirstSelectedClip(setting.videoClip)
  const info = clipInfo.clip.components[setting.component].properties[setting.property]
  info.setValue(processor(info), setting.setInfoBool)
}

function dbToLevel(db:number){
  return 20 * Math.log(db) * Math.LOG10E + 15;
}

function levelToDB(level:number){
  return Math.min(Math.pow(10, (level - 15)/20), 1.0);
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
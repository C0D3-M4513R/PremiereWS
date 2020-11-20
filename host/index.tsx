/// <reference path="../typings/JavaScript.d.ts"/>
/// <reference path="../typings/PlugPlugExternalObject.d.ts"/>
/// <reference path="../typings/PremierePro.14.0.d.ts"/>
/// <reference path="../typings/XMPScript.d.ts"/>
/// <reference path="../typings/extendscript.d.ts"/>
/// <reference path="../typings/global.d.ts"/>

declare interface Track {
  overwriteClip(clipProjectItem: ProjectItem, time: Time): void;
}

var demo = {
  showMsg: function () {
    alert("Hello World!")
  },
  setZoom: function (zoomLevel: number): boolean {
    setZoomOfCurrentClip(zoomLevel);
    return true;
  },
  receiveEvent: function (data: WSEvent) {
    switch (data.name) {
      case "move":
        if (data.reset) {
          resetPositionOfCurrentClip();
        } else {
          moveCurrentClip(data.deltaX, data.deltaY)
        }
        break;
      case "zoom":
        if (data.delta) {
          changeZoomOfCurrentClip(data.delta)
        } else if (data.level) {
          setZoomOfCurrentClip(data.level);
        }
        break;
      case "rotate":
        if (data.delta) {
          rotateCurrentClip(data.delta)
        } else if (data.level) {
          setRotationOfCurrentClip(data.level);
        }
        break;
      case "opacity":
        if (data.delta) {
          changeOpacityOfCurrentClip(data.delta)
        } else if (data.level) {
          setOpacityOfCurrentClip(data.level);
        }
        break;
      case "audio":
        changeAudioLevel(data.delta);
        break;
      case "lumetri":

        // TODO (1): Implement
        // TODO (2): Create enum-like structure for easier property selection
        break;
    }
  }
}

function moveCurrentClip(deltaX: number, deltaY: number) {
  const clipInfo = getFirstSelectedClip(true)
  const positionInfo = clipInfo.clip.components[1].properties[0]
  const [positionX, positionY] = positionInfo.getValue()
  positionInfo.setValue([positionX + deltaX, positionY + deltaY], true)
}

function resetPositionOfCurrentClip() {
  const clipInfo = getFirstSelectedClip(true)
  const positionInfo = clipInfo.clip.components[1].properties[0]
  positionInfo.setValue([0.5, 0.5], true)
}

function setZoomOfCurrentClip(zoomLevel: number) {
  const clipInfo = getFirstSelectedClip(true)
  const scaleInfo = clipInfo.clip.components[1].properties[1]
  scaleInfo.setValue(zoomLevel, true)
}

function changeZoomOfCurrentClip(delta: number) {
  const clipInfo = getFirstSelectedClip(true)
  const scaleInfo = clipInfo.clip.components[1].properties[1]
  const current: number = scaleInfo.getValue()
  scaleInfo.setValue(current + delta, true);
}

function setRotationOfCurrentClip(level: number) {
  const clipInfo = getFirstSelectedClip(true)
  const info = clipInfo.clip.components[1].properties[4]
  info.setValue(level, true)
}

function rotateCurrentClip(delta: number) {
  const clipInfo = getFirstSelectedClip(true)
  const info = clipInfo.clip.components[1].properties[4]
  const current: number = info.getValue()
  info.setValue(current + delta, true)
}

function setOpacityOfCurrentClip(level: number) {
  const clipInfo = getFirstSelectedClip(true)
  const info = clipInfo.clip.components[0].properties[0]
  info.setValue(level, true)
}

function changeOpacityOfCurrentClip(delta: number) {
  const clipInfo = getFirstSelectedClip(true)
  const info = clipInfo.clip.components[0].properties[0]
  const current: number = info.getValue()
  info.setValue(current + delta, true)
}

function changeAudioLevel(levelInDb: number) {
  const clipInfo = getFirstSelectedClip(false)
  const levelInfo = clipInfo.clip.components[0].properties[1];
  const level = 20 * Math.log(parseFloat(levelInfo.getValue())) * Math.LOG10E + 15;
  const newLevel = level + levelInDb;
  const encodedLevel = Math.min(Math.pow(10, (newLevel - 15)/20), 1.0);
  levelInfo.setValue(encodedLevel, true);
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
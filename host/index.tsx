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
        moveCurrentClip(data.deltaX, data.deltaY)
        break;
      case "zoom":
        // TODO: Implement this (1)
        break;
      case "rotate":
        // TODO: Implement this (2)
        break;
      case "opacity":
        // TODO: Implement this (3)
        // TODO: (4) Write MIDI Client
        break;
      case "audio":
        break;
      case "lumetri":
        break;
    }
  }
}

function moveCurrentClip(deltaX: number, deltaY: number) {
  const clipInfo = getFirstSelectedClip(true);
  const positionInfo = clipInfo.clip.components[1].properties[0];
  const [positionX, positionY] = positionInfo.getValue();
  positionInfo.setValue([positionX + deltaX, positionY + deltaY], true);
}

function setZoomOfCurrentClip(zoomLevel: number) {
  const clipInfo = getFirstSelectedClip(true);
  const scaleInfo = clipInfo.clip.components[1].properties[1];
  scaleInfo.setValue(zoomLevel, true);
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
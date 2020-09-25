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
  showMsg : function() {
    alert("Hello World!")
  }
}
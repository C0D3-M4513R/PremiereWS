// type WSEvent = ZoomEvent | MoveEvent | RotateEvent | OpacityEvent | AudioLevelEvent | LumetriEvent;

interface WSEvent{
  name:string
}
interface AbsoluteEvent extends WSEvent{
  level?:number
}
interface RelativeEvent extends WSEvent{
  delta?:number
}
interface ResetEvent extends WSEvent{
  reset?:boolean
}

interface MoveEvent extends ResetEvent{
  name: "move"
  deltaX: number//TODO: make this fit in with RelativeEvent
  deltaY: number//      maybe have delta and level in Relative and Absolute be a typevariable and have delta be an array?
  // reset?: boolean // sets position back to 0.5, 0.5
}

interface ZoomEvent extends AbsoluteEvent,RelativeEvent{
  name: "zoom"
  // level?: number
  // delta?: number
}

interface RotateEvent extends AbsoluteEvent,RelativeEvent{
  name: "rotate"
  // level?: number // 0 to 360+
  // delta?: number
}

interface OpacityEvent extends AbsoluteEvent,RelativeEvent {
  name: "opacity"
  // level?: number // between 0 and 100
  // delta?: number
}

interface AudioLevelEvent extends RelativeEvent {
  name: "audio"
  // delta: number
}

interface LumetriEvent extends AbsoluteEvent,RelativeEvent {
  name: "lumetri"
  property: number
  // level?: number
  // delta?: number
}
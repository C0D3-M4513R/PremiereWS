interface WSEvent{
  name:string
}
interface AbsoluteEvent<D> extends WSEvent{
  level?:number
}
interface RelativeEvent<D> extends WSEvent{
  delta?:number
}
interface RegularEvent<D> extends RelativeEvent<D>,AbsoluteEvent<D>{}
interface ResetEvent extends WSEvent{
  reset?:boolean
}

interface MoveEvent extends RegularEvent<[number,number]>,ResetEvent{
  name: "move"
  // reset?: boolean // sets position back to 0.5, 0.5
}

interface ZoomEvent extends RegularEvent<number>,ResetEvent{
  name: "zoom"
  // level?: number
  // delta?: number
}

interface RotateEvent extends RegularEvent<number>,ResetEvent{
  name: "rotate"
  // level?: number // 0 to 360+
  // delta?: number
}

interface OpacityEvent extends RegularEvent<number>,ResetEvent {
  name: "opacity"
  // level?: number // between 0 and 100
  // delta?: number
}

interface AudioLevelEvent extends RegularEvent<number>,ResetEvent {
  name: "audio"
  // delta: number
}

interface LumetriEvent extends RegularEvent<number>,ResetEvent {
  name: "lumetri"
  property: number
  // level?: number
  // delta?: number
}
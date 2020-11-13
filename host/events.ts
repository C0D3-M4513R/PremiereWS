type WSEvent = ZoomEvent | MoveEvent | RotateEvent | OpacityEvent | AudioLevelEvent | LumetriEvent;

interface MoveEvent {
  name: "move"
  deltaX: number
  deltaY: number
  reset?: boolean // sets position back to 0.5, 0.5
}

interface ZoomEvent {
  name: "zoom"
  level?: number
  delta?: number 
}

interface RotateEvent {
  name: "rotate"
  level?: number // 0 to 360+
  delta?: number 
}

interface OpacityEvent {
  name: "opacity"
  level?: number // between 0 and 100
  delta?: number
}

interface AudioLevelEvent {
  name: "audio"
  delta: number
}

interface LumetriEvent {
  name: "lumetri"
  property: number
  level?: number
  delta?: number
}
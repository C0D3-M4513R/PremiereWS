type WSEvent = ZoomEvent | MoveEvent | RotateEvent | OpacityEvent | AudioLevelEvent | LumetriEvent;

interface MoveEvent {
  name: "move"
  deltaX: number
  deltaY: number
}

interface ZoomEvent {
  name: "zoom"
  level?: number
  delta?: number
}

interface RotateEvent {
  name: "rotate"
  level?: number
  delta?: number
}

interface OpacityEvent {
  name: "opacity"
  level?: number
  delta?: number
}

interface AudioLevelEvent {
  name: "audio"
  level?: number
  delta?: number
}

interface LumetriEvent {
  name: "lumetri"
  property: number
  level?: number
  delta?: number
}
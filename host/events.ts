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
  reset?: boolean // sets value back to 1.0
}

interface RotateEvent {
  name: "rotate"
  level?: number // 0 to 360+
  delta?: number 
  reset?: boolean // sets level back to 0
}

interface OpacityEvent {
  name: "opacity"
  level?: number // between 0 and 100
  delta?: number
  reset?: boolean // sets level back 0
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
  reset?: boolean // sets value back to default value
}
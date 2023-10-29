import { EventType } from '../enums/event-type.enum'

export interface Event {
  id: number
  name: string
  description: string
  type: EventType
  priority: number
}

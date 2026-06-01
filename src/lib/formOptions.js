import { CalendarClock, CloudRain, Droplets, FileSearch, Flame, Home, Zap } from 'lucide-react'

export const SERVICE_OPTIONS = [
  {
    value: 'full-roof-replacement',
    label: 'Full Roof Replacement',
    icon: Home,
  },
  {
    value: 'leak-repair-maintenance',
    label: 'Leak Repair & Maintenance',
    icon: Droplets,
  },
  {
    value: 'emergency-storm-tarping',
    label: 'Emergency Storm Damage / Tarping',
    icon: CloudRain,
  },
  {
    value: 'water-fire-restoration',
    label: 'Water & Fire Restoration',
    icon: Flame,
  },
]

export const TIMELINE_OPTIONS = [
  {
    value: 'asap-emergency',
    label: 'ASAP / Emergency Restoration',
    icon: Zap,
  },
  {
    value: 'within-1-2-weeks',
    label: 'Within 1-2 Weeks',
    icon: CalendarClock,
  },
  {
    value: 'planning-ahead',
    label: 'Planning Ahead / Insurance Discovery',
    icon: FileSearch,
  },
]

export const SERVICES = SERVICE_OPTIONS.map((o) => o.value)
export const TIMELINES = TIMELINE_OPTIONS.map((o) => o.value)

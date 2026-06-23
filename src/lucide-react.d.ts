declare module 'lucide-react' {
  import * as React from 'react'
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number
    strokeWidth?: string | number
    absoluteStrokeWidth?: boolean
  }
  export type LucideIcon = React.FC<LucideProps>
  export const LayoutDashboard: LucideIcon
  export const CheckSquare: LucideIcon
  export const BarChart2: LucideIcon
  export const Users: LucideIcon
  export const Link2: LucideIcon
  export const FileText: LucideIcon
  export const MessageSquarePlus: LucideIcon
  export const Menu: LucideIcon
  export const X: LucideIcon
  export const ArrowRight: LucideIcon
  export const AlertCircle: LucideIcon
  export const Target: LucideIcon
  export const Zap: LucideIcon
  export const CheckCircle2: LucideIcon
  export const Circle: LucideIcon
  export const Clock: LucideIcon
  export const ExternalLink: LucideIcon
  export const TrendingUp: LucideIcon
  export const TrendingDown: LucideIcon
  export const Minus: LucideIcon
  export const Video: LucideIcon
  export const Calendar: LucideIcon
  export const FolderOpen: LucideIcon
  export const Globe: LucideIcon
  export const Image: LucideIcon
  export const Wrench: LucideIcon
  export const Receipt: LucideIcon
  export const Send: LucideIcon
  export const CheckCircle: LucideIcon
}

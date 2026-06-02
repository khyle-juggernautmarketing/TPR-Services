import type { Metadata } from 'next'
import { ThankYouContent } from '@/components/ThankYouContent'

export const metadata: Metadata = {
  title: 'Thank You',
  robots: { index: false, follow: false },
}

export default function ThankYouPage() {
  return <ThankYouContent />
}

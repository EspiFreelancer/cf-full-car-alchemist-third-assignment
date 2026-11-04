import Image from 'next/image'
import { cn } from '@/lib/utils'

interface BrandLogoProps {
  className?: string
  priority?: boolean
}

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/full-car-logo.jpg"
      alt="Full Car Alchemist"
      width={1510}
      height={704}
      priority={priority}
      className={cn('h-auto w-full object-contain', className)}
    />
  )
}

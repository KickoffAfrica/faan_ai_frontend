'use client'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

interface LogoProps {
  size?: 'default' | 'sm'
  className?: string
}

function Logo({ size = 'default', className }: LogoProps) {
  const isMobile = useIsMobile()
  const isSmall = size === 'sm'
  const imageSize = isSmall ? 40 : isMobile ? 50 : 80

  return (
    <div className={cn('flex items-center gap-2 min-w-0', className)}>
      <Image src="/Faan.logo_ 1.svg" alt="Logo" width={imageSize} height={imageSize} className="shrink-0" />
      <div className='flex flex-col min-w-0'>
        <h1 className={cn('dark:text-white text-primary-950 font-bold truncate', isSmall ? 'text-base' : 'md:text-2xl text-sm')}>
          FAAN Assist
        </h1>
        <p className={cn('text-blue-500 dark:text-[#EEF0F1] uppercase', isSmall ? 'text-[10px]' : 'md:text-sm text-[8px]')}>
          Always Online
        </p>
      </div>
    </div>
  )
}

export default Logo

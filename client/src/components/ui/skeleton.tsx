import type { ComponentProps } from 'react'

import { cn } from '#/lib/utils'

type SkeletonProps = ComponentProps<'div'>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('bg-gray-100 animate-pulse rounded', className)}
      {...props}
    />
  )
}

export function OpportunitySkeleton() {
  return (
    <div className="border-line bg-surface flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-baseline gap-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-7 w-full max-w-[400px]" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center gap-2 pt-1">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

export function TrainingSkeleton() {
  return (
    <div className="border-line bg-surface flex flex-col gap-3 overflow-hidden rounded-lg border">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export function GuideSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-56 w-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
      </div>
    </div>
  )
}

export function TemplateSkeleton() {
  return (
    <div className="flex flex-col shadow-sm">
      <Skeleton className="h-32 w-full" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
      </div>
    </div>
  )
}

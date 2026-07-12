import type { ComponentProps } from 'react'

import { cn } from '#/lib/utils'

type SkeletonProps = ComponentProps<'div'>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded bg-neutral-100', className)}
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
    <div>
      <div className="mb-4 grid aspect-352/226 grid-cols-2 gap-2.5 overflow-hidden rounded-2xl bg-neutral-50/80 p-3">
        <Skeleton className="rounded-sm" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="mb-1 flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export function GuideSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-352/195 rounded-lg" />
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
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#DFDFDF]">
      <Skeleton className="aspect-352/208 rounded-none border-b border-[#DFDFDF]" />
      <div className="flex flex-col gap-2 px-4 py-5">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
      </div>
    </div>
  )
}

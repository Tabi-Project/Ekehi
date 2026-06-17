import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '#/lib/utils'

const ModalRoot = DialogPrimitive.Root
const ModalTrigger = DialogPrimitive.Trigger
const ModalClose = DialogPrimitive.Close
const ModalPortal = DialogPrimitive.Portal

function ModalOverlay({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-neutral-950/50',
        className,
      )}
      {...props}
    />
  )
}

type ModalContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  hideClose?: boolean
}

function ModalContent({
  className,
  children,
  hideClose = false,
  ...props
}: ModalContentProps) {
  return (
    <ModalPortal>
      <ModalOverlay />
      <DialogPrimitive.Content
        className={cn(
          'border-border bg-bg-base fixed top-1/2 left-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border p-6 shadow-xl',
          className,
        )}
        {...props}
      >
        {children}
        {hideClose ? null : (
          <DialogPrimitive.Close
            aria-label="Close"
            className="text-text-muted hover:text-text-primary focus-visible:ring-primary absolute top-4 right-4 rounded p-1 focus-visible:ring-2 focus-visible:outline-none"
          >
            <X size={18} aria-hidden />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </ModalPortal>
  )
}

function ModalTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('text-text-primary text-xl font-semibold', className)}
      {...props}
    />
  )
}

function ModalDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-text-secondary text-sm', className)}
      {...props}
    />
  )
}

function ModalFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('flex justify-end gap-2 pt-2', className)} {...props} />
  )
}

export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Content: ModalContent,
  Title: ModalTitle,
  Description: ModalDescription,
  Footer: ModalFooter,
  Close: ModalClose,
})

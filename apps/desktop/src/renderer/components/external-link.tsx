import { cn } from '@dsh-bot/ui/lib/utils'
import { useMutation } from '@tanstack/react-query'
import type { ComponentProps } from 'react'

import { openExternalLinkMutationOptions } from '@/renderer/actions/shell'

type ExternalLinkProps = ComponentProps<'button'> & { href?: string }

export default function ExternalLink({
  children,
  className,
  href,
  disabled,
  ...props
}: ExternalLinkProps) {
  const openLink = useMutation(openExternalLinkMutationOptions())
  function open() {
    if (!href) {
      return
    }

    openLink.mutate({ url: href })
  }

  return (
    <button
      className={cn('cursor-pointer underline', className)}
      {...props}
      disabled={disabled || openLink.isPending}
      onClick={open}
    >
      {children}
    </button>
  )
}

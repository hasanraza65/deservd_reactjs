import type { SVGProps } from 'react'

/**
 * Inline icon set. Everything is stroked at 1.5 on a 24 grid and inherits
 * currentColor, so icons always match the text they sit beside.
 */

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

function Base({ children, title, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

function Solid({ children, title, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

/* --- Brand benefits ------------------------------------------------------- */

export const IconProtein = (props: IconProps) => (
  <Base {...props}>
    <path d="M3.6 16.4c.4-3.1 2.1-5 4.7-6 1-.4 1.6-1 1.6-2.1V6.5a1.95 1.95 0 1 1 3.9 0v1.8c0 1.4.7 2.4 2 3.1 2.5 1.3 4 3.3 4 5.7 0 1.7-1.2 2.9-3 2.9H6.5c-1.9 0-3.2-1.3-2.9-3.6Z" />
    <path d="M8.7 14.6c1.8-.9 3.7-.9 5.5 0" />
  </Base>
)

export const IconOven = (props: IconProps) => (
  <Base {...props}>
    <rect x="3.2" y="4" width="17.6" height="16" rx="2.4" />
    <path d="M3.2 9.4h17.6" />
    <path d="M6.6 6.7h.01M9.4 6.7h.01" />
    <rect x="6.6" y="12.2" width="10.8" height="5.2" rx="1.2" />
  </Base>
)

export const IconLeaf = (props: IconProps) => (
  <Base {...props}>
    <path d="M20.2 3.8c0 8.1-4.7 12.6-11.1 12.6A5.1 5.1 0 0 1 4 11.3C4 6.4 9.3 3.8 20.2 3.8Z" />
    <path d="M4.2 20.2c1.7-4.5 4.7-7.6 9.1-9.3" />
  </Base>
)

export const IconHeart = (props: IconProps) => (
  <Base {...props}>
    <path d="M12 20.3 4.6 13a4.75 4.75 0 0 1 6.7-6.7l.7.7.7-.7A4.75 4.75 0 1 1 19.4 13L12 20.3Z" />
  </Base>
)

export const IconDumbbell = (props: IconProps) => (
  <Base {...props}>
    <path d="M6.8 9.2v5.6M4 10.4v3.2M17.2 9.2v5.6M20 10.4v3.2M6.8 12h10.4" />
  </Base>
)

export const IconCookie = (props: IconProps) => (
  <Base {...props}>
    <path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5 3.6 3.6 0 0 1-4.4-4.4A3.6 3.6 0 0 1 12 3.5Z" />
    <path d="M9 10h.01M13.4 13.6h.01M8.6 14.8h.01" />
  </Base>
)

export const IconBox = (props: IconProps) => (
  <Base {...props}>
    <path d="M3.4 7.6 12 3.8l8.6 3.8v8.8L12 20.2l-8.6-3.8V7.6Z" />
    <path d="M3.4 7.6 12 11.4l8.6-3.8M12 11.4v8.8" />
  </Base>
)

/* --- Interface ------------------------------------------------------------ */

export const IconSearch = (props: IconProps) => (
  <Base {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.4-4.4" />
  </Base>
)

export const IconUser = (props: IconProps) => (
  <Base {...props}>
    <circle cx="12" cy="8.2" r="3.7" />
    <path d="M4.8 20c.6-3.7 3.6-6 7.2-6s6.6 2.3 7.2 6" />
  </Base>
)

export const IconCart = (props: IconProps) => (
  <Base {...props}>
    <path d="M2.6 3.6h2.2l2.3 11.1a1.8 1.8 0 0 0 1.8 1.4h8.4a1.8 1.8 0 0 0 1.8-1.4l1.4-7H6.2" />
    <circle cx="9.6" cy="20" r="1.3" />
    <circle cx="17.4" cy="20" r="1.3" />
  </Base>
)

export const IconMenu = (props: IconProps) => (
  <Base {...props}>
    <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
  </Base>
)

export const IconClose = (props: IconProps) => (
  <Base {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
)

export const IconArrowRight = (props: IconProps) => (
  <Base {...props}>
    <path d="M4.5 12h15M13.5 6l6 6-6 6" />
  </Base>
)

export const IconPlus = (props: IconProps) => (
  <Base {...props}>
    <path d="M12 5v14M5 12h14" />
  </Base>
)

export const IconMinus = (props: IconProps) => (
  <Base {...props}>
    <path d="M5 12h14" />
  </Base>
)

export const IconCheck = (props: IconProps) => (
  <Base {...props}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Base>
)

export const IconStar = (props: IconProps) => (
  <Solid {...props}>
    <path d="m12 2.7 2.9 6 6.6.9-4.8 4.6 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6-4.8-4.6 6.6-.9Z" />
  </Solid>
)

export const IconMail = (props: IconProps) => (
  <Base {...props}>
    <rect x="2.8" y="5" width="18.4" height="14" rx="2.2" />
    <path d="m3.4 6.6 8.6 6 8.6-6" />
  </Base>
)

export const IconPhone = (props: IconProps) => (
  <Base {...props}>
    <path d="M6.4 3.6h3l1.5 3.7-2 1.3a11.6 11.6 0 0 0 5.5 5.5l1.3-2 3.7 1.5v3a2 2 0 0 1-2.2 2A16.4 16.4 0 0 1 4.4 5.8a2 2 0 0 1 2-2.2Z" />
  </Base>
)

/* --- Social (filled marks) ------------------------------------------------ */

export const IconInstagram = (props: IconProps) => (
  <Solid {...props}>
    <path d="M12 2.2c-2.7 0-3 0-4.1.1-1 0-1.8.2-2.4.5a4.8 4.8 0 0 0-1.8 1.1A4.8 4.8 0 0 0 2.6 5.7c-.3.6-.4 1.3-.5 2.4C2 9.2 2 9.5 2 12.2s0 3 .1 4.1c0 1 .2 1.8.5 2.4a4.8 4.8 0 0 0 1.1 1.8 4.8 4.8 0 0 0 1.8 1.1c.6.3 1.3.4 2.4.5 1 0 1.4.1 4.1.1s3 0 4.1-.1c1 0 1.8-.2 2.4-.5a5.1 5.1 0 0 0 2.9-2.9c.3-.6.4-1.3.5-2.4 0-1 .1-1.4.1-4.1s0-3-.1-4.1c0-1-.2-1.8-.5-2.4a4.8 4.8 0 0 0-1.1-1.8 4.8 4.8 0 0 0-1.8-1.1c-.6-.3-1.3-.4-2.4-.5-1 0-1.4-.1-4.1-.1Zm0 1.8c2.6 0 2.9 0 4 .1.9 0 1.4.2 1.7.3.5.2.8.4 1.1.7.3.3.5.6.7 1.1.1.3.3.8.3 1.7 0 1 .1 1.3.1 4s0 2.9-.1 4c0 .9-.2 1.4-.3 1.7-.2.5-.4.8-.7 1.1-.3.3-.6.5-1.1.7-.3.1-.8.3-1.7.3-1 0-1.3.1-4 .1s-2.9 0-4-.1c-.9 0-1.4-.2-1.7-.3-.5-.2-.8-.4-1.1-.7a2.9 2.9 0 0 1-.7-1.1c-.1-.3-.3-.8-.3-1.7 0-1-.1-1.3-.1-4s0-2.9.1-4c0-.9.2-1.4.3-1.7.2-.5.4-.8.7-1.1.3-.3.6-.5 1.1-.7.3-.1.8-.3 1.7-.3 1 0 1.3-.1 4-.1Z" />
    <path d="M12 15.5a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6Zm0-8.4a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2Zm6.5-.2a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
  </Solid>
)

export const IconTikTok = (props: IconProps) => (
  <Solid {...props}>
    <path d="M16.6 2.2h-3.1v13.1a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.8 5.8 0 0 0-.8-.1 5.7 5.7 0 1 0 5.7 5.7V8.5a6.7 6.7 0 0 0 4 1.3V6.7a3.9 3.9 0 0 1-2.9-1.3 4 4 0 0 1-1.1-3.2Z" />
  </Solid>
)

export const IconFacebook = (props: IconProps) => (
  <Solid {...props}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
  </Solid>
)

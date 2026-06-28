export type AvatarSize = 'sm' | 'lg'

interface AvatarProps {
  name: string
  size?: AvatarSize
  className?: string
}

const SIZE: Record<AvatarSize, string> = {
  sm: 'w-8.5 h-8.5 text-caption',
  lg: 'w-13 h-13 text-md',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function Avatar({ name, size = 'sm', className = '' }: AvatarProps) {
  return (
    <div
      aria-label={name}
      className={[
        'rounded-full bg-ink text-white flex items-center justify-center font-medium select-none shrink-0',
        SIZE[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {getInitials(name)}
    </div>
  )
}

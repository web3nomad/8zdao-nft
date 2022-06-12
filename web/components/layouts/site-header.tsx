import clsx from 'clsx'
import Link from 'next/link'

export default function SiteHeader() {
  return (
    <header className={clsx(
      'text-center p-4'
    )}>
      <Link href='/'>
        <a className='text-lg font-bold'>8ZDAO</a>
      </Link>
    </header>
  )
}

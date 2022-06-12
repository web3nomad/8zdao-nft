import React, { ReactNode } from 'react'
import Head from 'next/head'
import clsx from 'clsx'

import SiteHeader from '@/components/layouts/site-header'
import SiteFooter from '@/components/layouts/site-footer'

type Props = {
  children?: ReactNode
}

/**
 * see https://github.com/vercel/next.js/blob/canary/examples/blog/pages/_document.js
 * to override default html template
 */

export default function Layout({ children }: Props) {
  return (
    <div className={clsx(
      'overflow-hidden',
      'min-h-screen',
      'flex flex-col',
      'bg-black text-white'
    )}>
      <Head>
        <title>8ZDAO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SiteHeader />
      <main className='flex-1 flex flex-col'>{children}</main>
      <SiteFooter />
    </div>
  )
}

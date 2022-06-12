import type { NextLayoutPage } from 'next'
import { ethers } from 'ethers'
import clsx from 'clsx'
import Layout from '@/components/layout'
import { useEffect, useState, useCallback } from 'react'
import ConnectButton from '@/components/connect-button'
import { useRecoilValue } from 'recoil'
import { walletAddressState } from '@/lib/recoil/wallet'

const Home: NextLayoutPage = () => {
  const [pendingTx, setPendingTx] = useState('')
  const walletAddress = useRecoilValue(walletAddressState)

  const mint = useCallback(async () => {
    const provider = new ethers.providers.Web3Provider((global as any).ethereum)
    const signer = provider.getSigner()
    const erc721 = new ethers.Contract('0xb94fb1122b86d64c034992fd3e6acbf4472d335d', [
      'function mint() public payable',
    ], signer)
    const tx = await erc721.mint({ value: ethers.utils.parseEther('0.1') })
    setPendingTx(tx.hash)
    await tx.wait()
  }, [])

  const Mint = () => {
    if (pendingTx) {
      return <div className='text-center my-8'>
        <div>Your 8ZNFT is being minted</div>
        <a
          className='underline text-xs'
          href={'https://etherscan.io/tx/' + pendingTx} target='_blank' rel='noreferrer'
        >{ pendingTx }</a>
      </div>
    } else if (walletAddress) {
      return <button className={clsx(
        'border-2 border-white hover:border-white/75 hover:text-white/75',
        'rounded-full px-16 py-2 my-8',
      )} onClick={() => mint()}>MINT 1 8Z</button>
    } else {
      return <></>
    }
  }

  return (
    <div className='flex-1 w-full flex flex-col items-center justify-center'>
      <ConnectButton />
      <Mint />
    </div>
  )
}

Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default Home

import type { NextLayoutPage } from 'next'
import { ethers } from 'ethers'
import clsx from 'clsx'
import Layout from '@/components/layout'
import { useEffect, useState, useCallback } from 'react'
import ConnectButton from '@/components/connect-button'
import { useRecoilState, useRecoilValue } from 'recoil'
import { chaineIDState, walletAddressState } from '@/lib/recoil/wallet'
import { switchNetwork } from '@/lib/utils'

const Home: NextLayoutPage = () => {
  const [pendingTx, setPendingTx] = useState('')
  const walletAddress = useRecoilValue(walletAddressState)
  const [chainID, setChainID] = useRecoilState(chaineIDState)
  const price = 0.1

  const mint = useCallback(async () => {
    if (chainID !== 1) {
      await switchNetwork('0x1')
      setChainID(1)
    }

    const provider = new ethers.providers.Web3Provider((global as any).ethereum)
    const signer = provider.getSigner()

    const balance = await provider.getBalance(await signer.getAddress())
    const balanceInEth = parseFloat(ethers.utils.formatEther(balance))
    if (balanceInEth <= price) {
      alert('You need at least ' + price + 'ETH + gas fee')
      return
    }

    const erc721 = new ethers.Contract('0xb94fb1122b86d64c034992fd3e6acbf4472d335d', [
      'function mint() public payable',
    ], signer)
    try {
      const tx = await erc721.mint({ value: ethers.utils.parseEther(price + '') })
      setPendingTx(tx.hash)
      await tx.wait()
    } catch (e: any) {
      if (e.code === 4001) return // User denied transaction signature
      alert('Something went wrong.' + (e.code ? 'Error: ' + e.code : ''))
    }
  }, [])

  const Mint = () => {
    if (pendingTx) {
      return <div className='text-center my-8'>
        <div>Your 8ZNFT is being minted</div>
        <a
          className='underline text-xs'
          href={'https://etherscan.io/tx/' + pendingTx} target='_blank' rel='noreferrer'
        >{pendingTx}</a>
      </div>
    } else if (walletAddress) {
      return <>
        <button className={clsx(
          'border-2 border-white hover:border-white/75 hover:text-white/75',
          'rounded-full px-16 py-2 mt-8 mb-2',
        )} onClick={() => mint()}>MINT 1 8Z</button>
        <span className='text-xs sm:text-sm'>Ξ{price} + gas fee</span>
      </>
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

import type { NextLayoutPage } from 'next'
import { BigNumber, ethers } from 'ethers'
import clsx from 'clsx'
import Layout from '@/components/layout'
import { useEffect, useState, useCallback } from 'react'
import ConnectButton from '@/components/connect-button'
import RoundedButton from '@/components/rounded-button'
import { useRecoilState, useRecoilValue } from 'recoil'
import { chaineIDState, walletAddressState } from '@/lib/recoil/wallet'
import { contractAddr, price, totalSupply, mintedNumState, isSoldOutState } from '@/lib/recoil/contract'
import { switchNetwork } from '@/lib/utils'
import { abi } from '@/lib/abi'

const Home: NextLayoutPage = () => {
  const [pendingTx, setPendingTx] = useState('')
  const walletAddress = useRecoilValue(walletAddressState)
  const [chainID, setChainID] = useRecoilState(chaineIDState)
  const [minted, setMinted] = useRecoilState(mintedNumState)
  const isSoldOut = useRecoilValue(isSoldOutState)


  const RPC = "https://rpc.ankr.com/eth"

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const contract = new ethers.Contract(contractAddr, abi, provider)
    contract.totalSupply().then((res: BigNumber) => {
      setMinted(res.toNumber())
    })
  }, [])

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

    const erc721 = new ethers.Contract(contractAddr, [
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
  }, [minted, chainID])

  const Mint = () => {
    if (!walletAddress) return <></>

    if (pendingTx) {
      return <div className='text-center my-8'>
        <div>Your 8ZNFT is being minted</div>
        <a
          className='underline text-xs'
          href={'https://etherscan.io/tx/' + pendingTx} target='_blank' rel='noreferrer'
        >{pendingTx}</a>
      </div>
    }

    if (isSoldOut) {
      return <>
        <RoundedButton
          disabled={true}
          text='SOLD OUT'
        /><a className='underline text-xs sm:text-sm'
          href='https://opensea.io/collection/8zdao' target='_blank' rel='noreferrer'>buy in OpenSea</a>
      </>
    } else {
      return <>
        <RoundedButton onClick={mint} text='MINT 1 8Z' /><span className='text-xs sm:text-sm'>Ξ{price} + gas fee</span>
      </>
    }

  }

  return (
    <div className='flex-1 w-full flex flex-col items-center justify-center'>
      <ConnectButton />
      <span className='text-xs sm:text-sm'>{minted === undefined
        ? 'Loading...'
        : `${minted} / ${totalSupply} minted`
      }</span>
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

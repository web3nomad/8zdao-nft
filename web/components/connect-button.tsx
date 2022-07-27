import clsx from 'clsx'
import { useCallback, useEffect, useRef } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { useRecoilState } from 'recoil'
import { walletAddressState, chaineIDState } from '@/lib/recoil/wallet'
import { switchNetwork } from '@/lib/utils'

// const maskedAddress = (address: string) => address.toLowerCase().replace(/0x(\w{4})\w+(\w{4})/, '0x$1...$2')

const RoundedButton = ({ onClick = () => { }, text }: { onClick?: Function, text: string }) => {
  return (
    <button className={clsx(
      'border-2 border-white hover:border-white/75 hover:text-white/75',
      'rounded-full px-16 py-2 my-8',
    )} onClick={() => onClick()}>{text}</button>
  )
}

export default function ConnectButton() {
  const [walletAddress, setWalletAddress] = useRecoilState(walletAddressState)
  const [chainID, setChainID] = useRecoilState(chaineIDState)
  const modalRef = useRef<Web3Modal>()

  const connect = useCallback(async () => {
    if (!modalRef.current) return

    const instance = await modalRef.current.connect()
    console.log('connected')
    const provider = new ethers.providers.Web3Provider(instance)

    // switch to the right network
    instance.on('chainChanged', (chainID: number) => {
      return setChainID(chainID)
    })
    const { chainId } = await provider.getNetwork()
    if (chainId !== 1) {
      await switchNetwork('0x1')
      setChainID(1)
    }

    const signer = provider.getSigner()
    console.log('signed')
    setWalletAddress(await signer.getAddress())
  }, [setChainID, setWalletAddress])

  function disconnect() {
    if (!modalRef.current) return

    modalRef.current.clearCachedProvider()
    setWalletAddress('')
  }

  useEffect(() => {
    modalRef.current = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
      providerOptions: {},
    })
    console.log('modal created', modalRef.current.cachedProvider)

    if (modalRef.current.cachedProvider) {
      connect()
    }
  }, [connect])

  if (typeof window === 'undefined') {
    return <RoundedButton text='Connect Wallet' />
  } else if (walletAddress) {
    return (
      <>
        <div className='inline-block text-xs sm:text-sm py-1 mx-2'>{walletAddress}</div>
        <button className={clsx(
          'hover:text-white/75',
          'text-xs px-4 py-1 mx-2',
        )} onClick={() => disconnect()}>Disconnect</button>
      </>
    )
  } else {
    return <RoundedButton onClick={connect} text='Connect Wallet' />
  }

}

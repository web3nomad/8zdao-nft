import clsx from 'clsx'
import { useCallback, useEffect, useRef } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { useRecoilState, useRecoilValue } from 'recoil'
import { walletAddressState, chaineIDState, walletAddressShortState } from '@/lib/recoil/wallet'
import { switchNetwork } from '@/lib/utils'
import RoundedButton from './rounded-button'

export default function ConnectButton() {
  const [walletAddress, setWalletAddress] = useRecoilState(walletAddressState)
  const walletAddressShort = useRecoilValue(walletAddressShortState)
  const [chainID, setChainID] = useRecoilState(chaineIDState)
  const modalRef = useRef<Web3Modal>()

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install a wallet like MetaMask, or open this page in a browser that supports Ethereum.')
      return
    }
    if (!modalRef.current) return

    const instance = await modalRef.current.connect()
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

    if (modalRef.current.cachedProvider) {
      connect()
    }
  }, [connect])

  if (typeof window === 'undefined') {
    return <RoundedButton text='Connect Wallet' />
  } else if (walletAddress) {
    return (
      <div className='fixed top-0 right-0 p-4'>
        <div className='inline-block text-xs sm:text-sm py-1 mx-2'>{walletAddressShort}</div>
        <button className={clsx(
          'hover:text-white/75',
          'text-xs px-4 py-1 mx-2',
        )} onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  } else {
    return <RoundedButton onClick={connect} text='Connect Wallet' />
  }

}

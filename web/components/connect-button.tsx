import clsx from 'clsx'
import { useEffect } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { useRecoilState } from 'recoil'
import { walletAddressState } from '@/lib/recoil/wallet'

// const maskedAddress = (address: string) => address.toLowerCase().replace(/0x(\w{4})\w+(\w{4})/, '0x$1...$2')

const WEB3: {
  getModal: Function,
  providerOptions: any,
  _modal: Web3Modal | null
} = {
  providerOptions: {},
  getModal: function() {
    if (!this._modal) {
      this._modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
        providerOptions: this.providerOptions,
      })
    }
    return this._modal
  },
  _modal: null,
}

const RoundedButton = ({ onClick=()=>{}, text }: { onClick?: Function, text: string }) => {
  return (
    <button className={clsx(
      'border-2 border-white hover:border-white/75 hover:text-white/75',
      'rounded-full px-16 py-2 my-8',
    )} onClick={() => onClick()}>{ text }</button>
  )
}

export default function ConnectButton() {
  const [walletAddress, setWalletAddress] = useRecoilState(walletAddressState)

  async function connect() {
    const web3Modal = WEB3.getModal()
    const instance = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(instance)
    const signer = provider.getSigner()
    setWalletAddress(await signer.getAddress())
  }

  function disconnect() {
    const web3Modal = WEB3.getModal()
    web3Modal.clearCachedProvider()
    setWalletAddress('')
  }

  useEffect(() => {
    const web3Modal = WEB3.getModal()
    if (web3Modal.cachedProvider) {
      connect()
    }
  })

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

export async function switchNetwork(chainId = '0x1') {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId }],
  })
}

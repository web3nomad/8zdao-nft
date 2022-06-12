module.exports = async ({
  getNamedAccounts, deployments, getChainId, ethers
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const [
    NFT8ZDAORenderer,
  ] = await Promise.all([
    deployments.get('NFT8ZDAORenderer'),
  ]);

  await deploy('NFT8ZDAO', {
    from: deployer,
    log: true,
    args: [NFT8ZDAORenderer.address],
  });

}

module.exports.tags = ['nft'];

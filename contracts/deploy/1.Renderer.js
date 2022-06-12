module.exports = async ({
  getNamedAccounts, deployments, getChainId,
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('NFT8ZDAORenderer', {
    from: deployer,
    log: true,
    args: [],
  });
}

module.exports.tags = ['renderer'];

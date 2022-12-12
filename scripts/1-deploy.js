
const main = async () => {



  const certData = require("../dados/config.json");
  console.log(certData)



  walletMnemonic1 = ethers.Wallet.fromMnemonic(certData.ROLE_01, "m/44'/52752'/0'/0")

  console.log(walletMnemonic1.address)


  walletMnemonic2 = ethers.Wallet.fromMnemonic(certData.ROLE_02, "m/44'/52752'/0'/0")

  console.log(walletMnemonic2.address)

  //0xaFdca2844e9eB9d2FBC6e534ffbdD06e4126eB56
  //0x7DCda78C7137945B1d26a718C587eB76D894D920


  const NFTContractFactory = await hre.ethers.getContractFactory('NFTMetadata');
  const NFTContract = await NFTContractFactory.deploy(certData.name, certData.symbol)
  await NFTContract.deployed();

  await NFTContract.setContractURI(getJsonContract(certData))
  console.log("NFTMetadata deployed to:        ", NFTContract.address)
  const PortifolioFactory = await hre.ethers.getContractFactory("PortfolioManagement")

  const portifolio = await PortifolioFactory.deploy([walletMnemonic1.address, walletMnemonic2.address], NFTContract.address, 2);

  await portifolio.deployed();
  console.log("PortfolioManagement deployed to:", portifolio.address)

  //await NFTContract.transferOwnership(portifolio.address)

}

function getJsonContract(certData) {

  //https://docs.opensea.io/docs/contract-level-metadata

  let metadata = {
    "name": certData.name,
    "image": "ipfs://" + certData.cid_img + "/" + certData.image_contract,
    "description": certData.description
  }

  metadata = JSON.stringify(metadata)

  let json = btoa(metadata)
  let strBase64 = btoa(unescape(encodeURIComponent(metadata)));
  //console.log(metadata)
  return String(`data:application/json;base64,${strBase64}`);
}


const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
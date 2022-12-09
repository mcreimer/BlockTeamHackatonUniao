
const main = async () => {


  const certData = require("../dados/config.json");
  console.log(certData)
  const NFTContractFactory = await hre.ethers.getContractFactory('NFTMetadata');
  const NFTContract = await NFTContractFactory.deploy(certData.name, certData.symbol)
  await NFTContract.deployed();


  await NFTContract.setContractURI(getJsonContract(certData))
  /*let str = await NFTContract.contractURI()
  console.log("---------------------")
  console.log(str)
  console.log("---------------------")*/

  console.log("Contract deployed to:", NFTContract.address)

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
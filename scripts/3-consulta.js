const { parse } = require("csv-parse");
const fs = require("fs")

const main = async () => {


    let path_dados = "../dados/"

    console.log("INICIO _____________________________________")

    const certData = require(path_dados + "config.json");
    console.log(certData)



    //const NFTContractFactory = await hre.ethers.getContractFactory('NFTMetadata');
    //const NFTContract = await NFTContractFactory.deploy(certData.name, certData.symbol)
    //await NFTContract.deployed();

    const NFTContractFactory = await hre.ethers.getContractFactory('NFTMetadata')
    const NFTContract = await NFTContractFactory.attach(certData.nft_addr)

    console.log("Contract config:   ", certData.nft_addr)
    console.log("Contract attach to:", NFTContract.address)


    const tokenID = 6921000115005


    const tokenURI = await NFTContract.tokenURI(tokenID)

    //console.log(tokenURI)

    const strBase64 = tokenURI.replace("data:application/json;base64,", "")
    const plain = Buffer.from(strBase64, 'base64').toString('utf8')
    console.log(JSON.stringify(JSON.parse(plain), null, 2))

    console.log("FIM _____________________________________")
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

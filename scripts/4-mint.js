const { parse } = require("csv-parse");
const fs = require("fs")

const main = async () => {


    let path_dados = "../dados/"

    console.log("INICIO _____________________________________")

    const certData = require(path_dados + "config.json");
    console.log(certData)



    const NFTContractFactory = await hre.ethers.getContractFactory('NFTMetadata');
    const NFTContract = await NFTContractFactory.deploy(certData.name, certData.symbol)
    await NFTContract.deployed();

    //const NFTContractFactory = await hre.ethers.getContractFactory('CommunityNFT')
    //const NFTContract = await NFTContractFactory.attach(certData.contract_addr)

    console.log("Contract config:   ", certData.contract_addr)
    console.log("Contract attach to:", NFTContract.address)


    //let info = await certificateNFTContract.getContractInfo()
    //let mapImgCerts = new Map();

    var end = new Promise(function (resolve, reject) {

        const createReadStream = fs.createReadStream(certData.csv, 'utf8')
            .pipe(
                parse({
                    delimiter: ",",
                    columns: true,
                    ltrim: true,
                })
            )
            .on("data", async function (row) {

                console.log("MINT..................");
                console.log(row['Rip Imóvel']);
                //console.log(typeof row);

                //mapImgCerts.set(row['Rip Imóvel'], row);


                await NFTContract.addProperties(row['Rip Imóvel'],
                    [
                        ["name", "Rip Imóvel:" + row['Rip Imóvel'] + " |  Matrícula:" + row['Matrícula']],
                        ["image", "ipfs://" + "bafybeib66hzee67t5tlhsw3r2jqjyl2izwnhfkicny2ihv3el3q53z52ka" + "/" + "spu_imovel_nft.png"],
                        ["description", row['Endereço'] + "-" + row['Bairro'] + " | " + row['Município'] + "-" + row['UF'] + "- CEP:" + row['CEP']]])


                let attributes = [];
                console.log("---------------------------")
                console.log(row)
                Object.entries(row).forEach(entry => {
                    const [key, value] = entry;
                    console.log(key, value);
                    attributes.push(["", key, value, "key", "value", "trait_type"]);
                });


                await NFTContract.addAttributes(row['Rip Imóvel'], attributes)


                try {

                    await NFTContract.safeMint(
                        certData.custodia_addr,
                        row['Rip Imóvel'],
                        ""
                    )
                    
                } catch (error) {
                    console.log(row['Rip Imóvel']);
                    console.log(error);            
                    process.exit(1);        
                }
          

                attribute = await NFTContract.tokenURI(row['Rip Imóvel'])
                console.log('String TOKEN URI : ', attribute);


            })
            .on("error", function (error) {
                console.log(error.message);
            })
            .on("end", function () {
                console.log("parsed csv data");
            });

        createReadStream.on('finish', () => {
            console.log(`You have successfully read a ${certData.csv}.`);

        })
    });


    await (async function () {
        await end;
     
    }());

    console.log("-----------------------------------------")

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
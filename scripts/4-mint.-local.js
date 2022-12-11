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

    console.log("Contract config:   ", certData.nft_addr)
    console.log("Contract attach to:", NFTContract.address)

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


                let properties = [
                    ["name", "Rip Imóvel:" + row['Rip Imóvel'] + " |  Matrícula:" + row['Matrícula']],
                    ["image", "ipfs://" + "bafybeib66hzee67t5tlhsw3r2jqjyl2izwnhfkicny2ihv3el3q53z52ka" + "/" + "spu_imovel_nft.png"],
                    ["description", row['Endereço'] + "-" + row['Bairro'] + " | " + row['Município'] + "-" + row['UF'] + "- CEP:" + row['CEP']]
                ]


                let attributes = [];
                console.log("---------------------------")
                //console.log(row)
                Object.entries(row).forEach(entry => {
                    const [key, value] = entry;
                    //console.log(key, value);
                    attributes.push(["", key, value, "key", "value", "trait_type"]);
                });


                const tx1 = await NFTContract.safeMintMetadata(certData.custodia_addr, row['Rip Imóvel'], properties, attributes)

                await tx1.wait()


                const tokenURI = await NFTContract.tokenURI(row['Rip Imóvel'])

                //console.log(tokenURI)
                const strBase64 = tokenURI.replace("data:application/json;base64,", "")
                const plain = Buffer.from(strBase64, 'base64').toString('utf8')
                console.log("--------------------------------------------")
                console.log(JSON.stringify(JSON.parse(plain), null, 2))
                console.log("--------------------------------------------")



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

    let myMap = {};

    readCsv(certData, myMap)

    console.log(myMap)

    console.log("FIM _____________________________________")
}



function readCsv(certData, myMap) {


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

            myMap[row['Rip Imóvel']] = row

            let properties = [
                ["name", "Rip Imóvel:" + row['Rip Imóvel'] + " |  Matrícula:" + row['Matrícula']],
                ["image", "ipfs://" + "bafybeib66hzee67t5tlhsw3r2jqjyl2izwnhfkicny2ihv3el3q53z52ka" + "/" + "spu_imovel_nft.png"],
                ["description", row['Endereço'] + "-" + row['Bairro'] + " | " + row['Município'] + "-" + row['UF'] + "- CEP:" + row['CEP']]
            ]


            let attributes = [];
            console.log("---------------------------")
            //console.log(row)
            Object.entries(row).forEach(entry => {
                const [key, value] = entry;
                //console.log(key, value);
                attributes.push(["", key, value, "key", "value", "trait_type"]);
            });



            if ("643000255000" != row['Rip Imóvel'] && "643000235000" != row['Rip Imóvel'] && "643000215009" != row['Rip Imóvel']) {

                const tx1 = await NFTContract.safeMintMetadata(certData.custodia_addr, row['Rip Imóvel'], properties, attributes)

                await tx1.wait()

            }






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
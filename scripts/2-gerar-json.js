const { parse } = require("csv-parse");
const fs = require("fs")

const main = async () => {


    let path_dados = "../dados/"

    console.log("INICIO _____________________________________")

    const certData = require(path_dados + "config.json");
    console.log(certData)



    //let info = await certificateNFTContract.getContractInfo()
    let mapImgCerts = new Map();

    var end = new Promise(function (resolve, reject) {

        const createReadStream = fs.createReadStream(certData.csv, 'utf8')
            .pipe(
                parse({
                    delimiter: ",",
                    columns: true,
                    ltrim: true,
                })
            )
            .on("data", function (row) {
                console.log(row['Rip Imóvel']);
                //console.log(typeof row);

                let jsonFile = getJson(row['Rip Imóvel'], row)
                console.log(jsonFile)

                //console.log(parseInt(row.['Rip Imóvel']));



                mapImgCerts.set(row['Rip Imóvel'], row);


                const writableStream = fs.createWriteStream(certData.json_path +  row['Rip Imóvel'] + ".json", 'UTF-8')
 
                 writableStream.write(jsonFile)
 
                 writableStream.on('error', (error) => {
                     console.log(`An error occured while writing to the file. Error: ${error.message}`);
                 });
 
                 writableStream.end();


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
        console.log(mapImgCerts);
    }());


    console.log(certData.cid)
    console.log(mapImgCerts)
    //console.log(getJson(filesCertIPFS[f].name, dataCert, row.NOME))



    //obter as imagens do diretrio IPFS(CID)
    console.log("-----------------------------------------")

    console.log("FIM _____________________________________")
}


function writeJSON(filePath) {

    const writableStream = fs.createWriteStream(filePath);

    writableStream.on('error', (error) => {
        console.log(`An error occured while writing to the file. Error: ${error.message}`);
    });
}


function getJson(nome, row) {

    let metadata = {
        "name": "Rip Imóvel:" + row['Rip Imóvel'] + " |  Matrícula:" + row['Matrícula'],
        "image": "ipfs://" + "bafybeib66hzee67t5tlhsw3r2jqjyl2izwnhfkicny2ihv3el3q53z52ka" + "/" + "spu_imovel_nft.png",
        "description": row['Endereço'] + "-" + row['Bairro'] + " | " + row['Município'] + "-" + row['UF'] + "- CEP:" + row['CEP'],
        "attributes": []
    }

    Object.entries(row).forEach(entry => {
        const [key, value] = entry;
        //console.log(key, value);
        metadata.attributes.push({ "trait_type": key, "value": value });
    });


    metadata = JSON.stringify(metadata, null, 2)

    return metadata;
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
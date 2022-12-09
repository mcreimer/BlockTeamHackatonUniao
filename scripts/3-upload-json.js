
const Web3Storage = require('web3.storage');
const fs = require('fs')


const main = async () => {


    let path_dados = "../dados/"

    const config = require(path_dados + "config.json");

    let path_json = config.json_path 

    fs.lstat(path_json, (err, stats) => {

        if (err)
            return console.log(err); //Handle error

        console.log(`*************************************`);
        console.log(`Is file: ${stats.isFile()}`);
        console.log(`Is directory: ${stats.isDirectory()}`);
        console.log(`Is symbolic link: ${stats.isSymbolicLink()}`);
        console.log(`Is FIFO: ${stats.isFIFO()}`);
        console.log(`Is socket: ${stats.isSocket()}`);
        console.log(`Is character device: ${stats.isCharacterDevice()}`);
        console.log(`Is block device: ${stats.isBlockDevice()}`);
        console.log(`*************************************`);
    });

    let listFiles = await getFiles(path_json)

    listFiles.forEach(element => {
        console.log(element.name)
    });

    //let cid = await storeFiles(listFiles)
    //console.log(cid)

}

//web3.storage
function getAccessToken() {
    return process.env.WEB3STORAGE_TOKEN
}

function makeStorageClient() {
    return new Web3Storage.Web3Storage({ token: getAccessToken() })
}


async function getFiles(path) {
    const files = await Web3Storage.getFilesFromPath(path, { mode: true, mtime: true, pathPrefix: path })
    console.log(`read ${files.length} file(s) from ${path}`)
    return files
}

async function storeFiles(files) {
    const client = makeStorageClient()
    const onRootCidReady = cid => {
        console.log('uploading files with cid:', cid)
    }

    const cid = await client.put(files, { onRootCidReady })
    console.log('stored files with cid:', cid)
    return cid
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
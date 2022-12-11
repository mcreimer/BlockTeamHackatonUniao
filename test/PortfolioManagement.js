const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("PortfolioManagement", function () {
    async function deployContract() {
        const [owner, operator, rolea1, rolea2, rolea3] = await ethers.getSigners();

        const NFTTokenFactory = await hre.ethers.getContractFactory(
            "NFTMetadata"
        );
        let symbolNFT = "SPUTOKEN";
        let nameNFT = "SPU IMOVEIS DA UNIAO";
        const nftToken = await NFTTokenFactory.connect(owner).deploy(nameNFT, symbolNFT);

        await nftToken.deployed();


        let contractouri = getJsonContract(nameNFT, symbolNFT, nameNFT + "-" + symbolNFT)
        await nftToken.setContractURI(contractouri)


        const PortifolioFactory = await hre.ethers.getContractFactory(
            "PortfolioManagement"
        );

      

        const portifolio = await PortifolioFactory.deploy([rolea1.address, rolea2.address, rolea3.address], nftToken.address, 2);

        await portifolio.deployed();


        let owners = [rolea1, rolea2, rolea3]

      
        nftToken.transferOwnership(portifolio.address)


        return { nftToken, owner, operator, nameNFT, symbolNFT, portifolio, owners };
    }

    describe("Deployment", function () {

        it("Check name and symbol", async function () {

            const { nftToken, owner, operator, nameNFT, symbolNFT, portifolio } = await loadFixture(deployContract)
            await expect(await nftToken.name()).to.equal(nameNFT)
            await expect(await nftToken.symbol()).to.equal(symbolNFT)

        });



    });


    describe("PortfolioManagement", function () {

        it("PortfolioManagement-submitTransaction | Confi", async function () {

            const { nftToken, owner, operator, nameNFT, symbolNFT, portifolio, owners } = await loadFixture(deployContract)



            let properties = [
                ["name", "Rip Imóvel:" + '23232323213' + " |  Matrícula:" + '3344444'],
                ["image", "ipfs://" + "bafybeib66hzee67t5tlhsw3r2jqjyl2izwnhfkicny2ihv3el3q53z52ka" + "/" + "spu_imovel_nft.png"],
                ["description", "RUA TESTE - CEP: 3444444"]
            ]

            let attributes = [];
            attributes.push(["", 'INFO1', "A", "key", "value", "trait_type"]);
            attributes.push(["", "INFO2", "B", "key", "value", "trait_type"]);
            attributes.push(["", "INFO3", "C", "key", "value", "trait_type"]);

            const tx = await portifolio.connect(owners[0]).submitTransaction(
                owner.address,
                1,
                properties,
                attributes
            )

            await tx.wait();



            const tx1 = await portifolio.connect(owners[0]).confirmTransaction(0)

            const tx2 = await portifolio.connect(owners[1]).confirmTransaction(0)
            
            
            const tx3 = await portifolio.connect(owners[2]).executeTransaction(0)


            expect(await nftToken.ownerOf(1)).to.equal(owner.address)






        });


        it("xxxxxx", async function () {

            /*
            const { nftToken, owner, operator, nameNFT, symbolNFT } = await loadFixture(deployContract)
            const setMintForSaleActiveTx = await nftToken.setMintForSaleActive();
            await setMintForSaleActiveTx.wait();

            await nftToken.setMaxTotalSupply(5);
            await nftToken.setMaxPreSaleTokens(2);



            await expect(
                nftToken
                    .mintForSale(
                        operator.address,
                        10,
                        {

                            gasLimit: "250000"
                        })
            ).to.be.revertedWith("Insufficient tokens supply");
            */


        });

    });


});




function getJsonContract(nameNFT, symbolNFT, description) {

    //https://docs.opensea.io/docs/contract-level-metadata

    let metadata = {
        "name": nameNFT,
        "image": "ipfs://" + "XXXXXXXXX" + "/" + symbolNFT + ".png",
        "description": description
    }

    metadata = JSON.stringify(metadata)

    let json = btoa(metadata)
    let strBase64 = btoa(unescape(encodeURIComponent(metadata)));
    //console.log(metadata)
    return String(`data:application/json;base64,${strBase64}`);
}
# NFT REGISTRO IMOVEL SPU



[![A mushroom-head robot](/dados/BlockTeam_-_Cadastro_de_Imoveis_em_Blockchain_pg_8-1.jpg 'BlockTEam')](https://www.canva.com/design/DAFUGiN3iso/797_jg3dp6uqkq8pvHoauQ/view?utm_content=DAFUGiN3iso&utm_campaign=designshare&utm_medium=link&utm_source=publishpresent#1)



## INICIAL

Vai ser utilizado os dados dos imóveis que foram obtidos no site:

[https://www.gov.br/economia/pt-br/assuntos/patrimonio-da-uniao/transparencia/dados-abertos](https://www.gov.br/economia/pt-br/assuntos/patrimonio-da-uniao/transparencia/dados-abertos)

O objetivo é realizar uma simulação do registro de uma NFT e a confirmação do registro realizado por servidores autorizados nos órgão governamentais.

Foi utilizado _ **node.js** _ e _ **hardhat** _ e _ **solidity** _ para desenvolver e realizar os testes no contratos.

Preparar as informações para o deploy e mint

## 1 - Os dados estão localizados no diretório** _ **dados/** _ **:**

## 2 - Criar e preencher a planilha(csv) com os seguintes dados :**

obs: a planilha deve ser localizada no diretório  dados/ 

Existe uma planilha para realizar a simulação no diretório /dados: _demostrativos\_imovel\_6921000115005.csv_

## 3 - Criar o arquivo config.json com as propriedades para gerar o JSON da NFT.**

    {

    "name": "REGISTRO DE IMOVEIS DA UNIAO - BR",

    "symbol": "RIUBR",

    "description": "SPU IMOVEIS UNIAO",

    "image_contract": "icone.png",

    "csv": "/home/valter/ESTUDOS/CELO/NFT\_Metadata/dados/demostrativos\_imovel\_6921000115005.csv",

    "nft_addr": "0x3E9603a5584431CCd80c4d054707D818A563491f",

    "portifolio_addr": "0xACE3D135130cF31Ec2337c0f134696225e85D31c",

    "custodia_addr" : "0x64b4A71963ff278B586D4d998aBBC584DaDbB3BB" ,

    "ROLE_01": "galaxy toward wasp creek ice dose lend icon evil define amount engine adult response buffalo tribe amused skirt radio notable camp bid then laundry",

    "ROLE_02": "claw million actor wire salon equal time payment fiscal crop door wreck skin divert dizzy panda daring remove discover inhale swallow arrest garbage torch"

    }

# Deploy do Smart Contract

## **1 - Executar o script deploy contrato**

         npx hardhat run scripts/1-deploy.js --network alfajores

Colocar no arquivo _ **config.json** _ o contrato do endereço do contrato da _ **NFT/Registro Imovel** _ na tag _ **nft\_addr,** _ e do contrato _ **Portfólio** _ na tag _ **portifolio\_addr.** _

# "MVP" - Script vai simular uma integração com as informações dos sistemas com a blockchain da CELO.

       npx hardhat run scripts/2-mvp.js --network alfajores

#
# Hardhat 

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```


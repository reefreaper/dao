// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

async function main() {

    console.log(`Fetching accounts & network...\n`)

    const accounts = await ethers.getSigners()
    const funder = accounts[0]
    const investor1 = accounts[1]
    const investor2 = accounts[2]
    const investor3 = accounts[3]
    const recipient = accounts[4]

    let transaction

    console.log(`Fetching token and transfering to accounts...\n`)

    const token = await ethers.getContractAt('Token', '0x5FbDB2315678afecb367f032d93F642f64180aa3')
    console.log(`Token fetched: ${token.address}\n`)

    // Send tokens to investors each one gets 20%
    transaction = await token.transfer(investor1.address, tokens(200000))
    await transaction.wait()
    console.log(`Transferred tokens to ${investor1.address}\n`)

    transaction = await token.transfer(investor2.address, tokens(200000))
    await transaction.wait()
    console.log(`Transferred tokens to ${investor2.address}\n`)

    transaction = await token.transfer(investor3.address, tokens(200000))
    await transaction.wait()
    console.log(`Transferred tokens to ${investor3.address}\n`)

    console.log(`Fething DAO ...\n`)
    
    // fetch DAO contract
    const dao = await ethers.getContractAt('DAO', '0x5FbDB2315678afecb367f032d93F642f64180aa3')
    console.log(`DAO fetched: ${dao.address}\n`)


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

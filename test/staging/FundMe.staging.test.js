const { ethers, network, deployments } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Fund Me", function () {
          let fundMe
          let deployer
          const sendValue = ethers.parseEther("0.1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              const myContract = await deployments.get("FundMe")
              fundMe = await ethers.getContractAt(
                  myContract.abi,
                  myContract.address
              )
          })
          it("allows people to fund and withdraw", async function () {
              const fundTxResponse = await fundMe.fund({ value: sendValue })
              await fundTxResponse.wait(1)
              const withdrawTxResponse = await fundMe.withdraw()
              await withdrawTxResponse.wait(1)

              const endingBalance = await ethers.provider.getBalance(
                  fundMe.target
              )
              console.log(endingBalance)
              assert.equal(endingBalance.toString(), "0")
          })
      })

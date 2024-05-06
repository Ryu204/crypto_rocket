import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("CryptoRocket", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const fact = await hre.ethers.getContractFactory('CryptoRocket');
    const cr = await fact.deploy();

    await otherAccount.sendTransaction({to: cr, value: ethers.parseUnits('15', 'gwei')})
    const balance = await ethers.provider.getBalance(await cr.getAddress())

    const scores = [3, 7, 1, 5, 9, 4, 2, 10, 6, 8]
    const names = []
    for (const s of scores) {
      const name = 'name is ' + s.toString()
      names.push(name)
      await cr.addEntry(name, s)
    }

    return { cr, owner, otherAccount, balance, scores, names };
  }

  describe("Deployment", function () {
    it("Should set right data", async function () {
      const { cr, owner, scores } = await loadFixture(deploy)

      expect(await cr.currentEntryIndex()).to.equal(scores.length)
      expect(cr.rankings.length).to.equal(0)
      expect(await cr.owner()).to.equal(owner)
    });
  });

  describe("Transfer", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from another account", async function () {
        const { cr, owner, otherAccount } = await loadFixture(deploy)

        await expect(cr.connect(otherAccount).transferToOwner()).to.be.revertedWith(
          "Not owner"
        );
      });

      it("Shouldn't fail if the owner calls it", async function () {
        const { cr } = await loadFixture(deploy)

        await expect(cr.transferToOwner()).not.to.be.reverted;
      });

      it("Should transfer the funds to the owner", async function () {
        const { cr, owner, otherAccount, balance  } = await loadFixture(deploy)
      
        await expect(cr.transferToOwner()).to.changeEtherBalances(
          [owner, cr],
          [balance, -balance]
        );
      });
    })
  })

  describe("Rankings", function () {
    it("Should retain entries order", async function () {
      const { cr, names, scores } = await loadFixture(deploy)

      const entries = cr.rankings;
      for (let i = 0; i < entries.length; ++i) {
          expect((await entries(i)).score).to.equal(scores[i])
          expect((await entries(i)).name).to.equal(names[i])
      }
    });

    it("Should return the right number of entries", async function () {
      const { cr, scores } = await loadFixture(deploy)

      const first3 = await cr.getTopEntries(3)
      expect(first3.length).to.equal(3)
      const first1e4 = await cr.getTopEntries(1e4)
      expect(first1e4.length).to.equal(scores.length)
    });

    it("Should return first 3 values rightfully", async function () {
      const { cr, scores, names } = await loadFixture(deploy)

      const first3 = await cr.getTopEntries(3)
      expect(first3).to.satisfy(async (f3: typeof cr.rankings) => {
        for (let i = 1; i < f3.length; ++i) {
          if ((await f3(i)).score > (await f3(i - 1)).score)
            return false
        }
        return true
      }, 'Results must be decreasing')
      for (let i = 0; i < 3; ++i) {
        const receivedScore = ethers.getNumber(first3[i].score)
        expect(scores).to.contain(receivedScore)
        expect(names).to.contain(first3[i].name)
        expect(scores.indexOf(receivedScore)).to.equal(names.indexOf(first3[i].name))
      }
    });
  });
})

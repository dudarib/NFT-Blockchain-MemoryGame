const { assert } = require('chai')
const { Item } = require('react-bootstrap/lib/Breadcrumb')

const MemoryToken = artifacts.require('./MemoryToken.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Memory Token', (accounts) => {
  let token

  before(async () => {
    token = await MemoryToken.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = token.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await token.name()
      assert.equal(name, 'Memory Token')
    })

    it('has a symbol', async () => {
      const symbol = await token.symbol()
      assert.equal(symbol, 'MEM')
    })
  })

  describe('token distribution', async () => {
    let result

    it('mints tokens', async () => {
      await token.mint(accounts[0], 'https://www.token-721.com')

      // it should increase the total supply
      result = await token.totalSupply()
      assert.equal(result.toString(), '1', 'total supply is correct')

      // it should increment to accounts[0] balance
      result = await token.balanceOf(accounts[0])
      assert.equal(result.toString(), '1', 'BalanceOf is correct')

      // token should belong to owner
      result = await token.ownerOf('1')
      assert.equal(result.toString(), accounts[0].toString(), 'owner is correct')
      result = await token.tokenOfOwnerByIndex(accounts[0], 0)

      // owner can see all tokens
      let balanceOf = await token.balanceOf(accounts[0])
      let tokenIds = []
      for (let i = 0; i < balanceOf; i++) {
        let id = await token.tokenOfOwnerByIndex(accounts[0], i)
        tokenIds.push(id.toString())
      }
      let expected = ['1']
      assert.equal(tokenIds.toString(), expected.toString(), 'tokenIds are correct')

      // Token URI
      let tokenURI = await token.tokenURI('1')
      assert.equal(tokenURI, 'https://www.token-721.com')

    })
  })
})

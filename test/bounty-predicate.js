const Web3 = require('web3');
const EthCrypto = require('eth-crypto');
const RLP = require('rlp')

const BountyPredicate = artifacts.require('BountyPredicate')

const web3 = new Web3('http://localhost:8545')
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const CREATE_TYPE = 0
const FULFILL_TYPE = 1
const ACCEPT_TYPE = 2

const getExit = (type, account, start, end) => {
  let txData = null

  if (type === CREATE_TYPE) {
    txData = web3.eth.abi.encodeParameters(
      ['address'], // issuer address
      [account.address]
    )
  } else if (type === FULFILL_TYPE) {
    // TODO
  } else if (type === ACCEPT_TYPE) {
    // TODO
  }

  const parameters = web3.eth.abi.encodeParameters(
    ['address', 'uint8', 'bytes'], 
    [account.address, type, txData]
  )

  return {
    state: web3.eth.abi.encodeParameters(['bytes', 'address'], [parameters, ZERO_ADDRESS]),
    rangeStart: start,
    rangeEnd: end,
    exitHeight: 0,
    exitTime: 999
  }
}

const getWitness = async (account, start, end) => {
  const message = web3.eth.abi.encodeParameters(['uint256', 'uint256', 'uint256'], [start, end, 0])
  const messageHash = web3.utils.sha3(message)
  const sig = EthCrypto.sign(account.privateKey, messageHash)
  return web3.eth.abi.encodeParameters(['uint256', 'uint256', 'bytes'], [start, end, sig])
}

const createAccount = () => {
  return web3.eth.accounts.create()
}

contract('BountyPredicate', () => {
  const issuer = createAccount()
  const fulfiller = createAccount()

  let instance

  beforeEach(async () => {
    instance = await BountyPredicate.new()
  })

  describe('canStartExit', () => {
    describe('create state', () => {
      it('should allow the owner to start an exit', async () => {
        const exit = getExit(CREATE_TYPE, issuer, 0, 100)
        const canStartExit = await instance.canStartExit(exit, { from: issuer.address })
        assert.isTrue(canStartExit)
      })

      it('should not allow fulfiller start an exit', async () => {
        const exit = getExit(CREATE_TYPE, issuer, 0, 100)
        const canStartExit = await instance.canStartExit(exit, { from: fulfiller.address })
        assert.isFalse(canStartExit)
      })
    })
  })
})

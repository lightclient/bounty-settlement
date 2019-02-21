# Bounties on Plasma

The bounty settlement contract performs the exiting of funds from Plasma-based bounties and resolves disputes that occur.

## Control of Bounty Funds
A bounty is essentially a signal to the world that the issuer is seeking to have a task completed at some pre-determined cost. Up until the momement that the issuer submits a signed transaction accepting a fulfillment, the issuer has complete control of the funds. That leaves us with two situations for fund ownership:

* issuer owns funds related to the bounty
* fulfiller owns funds related to the bounty

Understanding this allows us to significantly simplify the logic required to exit the bounty funds from Plasma. Instead of exiting state, it is possible to only exit the funds depending on the state of the bounty at that moment—determining whether the funds are still owned by the issuer or if they have already been transfered to the fulfiller.

## The Life of a Bounty
In this proof-of-concept, there are only three types of actions that can occur:

* `create`
* `fulfill`
* `accept`

These actions occur in the same order as they are listed above. 

1. The issuer will first `create` a bounty, defining the coin range which they plan to pay out to a fulfiller. 
2. A fulfiller performs the task described by the bounty and `fulfill`s the bounty.
3. The issuer `accept`s the work by the fulfiller, releasing the ownership of the specified coin range to the fulfiller.

## Transaction Schema
```
action = {
  type,
  owner,
  data
}
```

```
create = {
  issuer,
  data
}
```

```
fulfill = {
  issuer,
  fulfiller,
  data,
  createTxHash
}
```

```
accept = {
  issuer,
  fulfiller,
  fulfillmentTxHash,
  createTxHash
}
```

## Settlement
The settlement contract verfies that an exit can begin and mediates any disputes that may occur. Below are the predicates that will be implemented by the contract and what is required of each.

### `canStartExit`
* transaction is not type fulfill
* action is owned by exiter


### `canCancel`
* accept fulfillment signature matches bounty owner
* action signature does not match the actor

## Exit Scenarios

### Owner Exit
An owner is able to exit their funds at anytime before a fulfillment has been accepted. If an owner attempts to exit after a fulfillment was accepted, the fulfiller who received the funds would submit a challenge with the signed `accept` transaction.

#### Fulfiller Challenge Requirements
* `create`, `fulfillment`, and `accept` transactions must included in the merkle tree
* `accept` transaction must be signed by the same `issuer` address from `createTxHash`
* `fulfillment` transaction must be signed by the same `fullfiller` address from `fulfillmentTxHash`

If a fulfiller is able to submit a challenge that meets these requirements, the bounty owner would not be able to produce a valid response since `accept` transactions are final.

### Other User Exit 
A fulfiller can exit the bounties funds only once the issuer has signed a valid `accept` transaction. If a fulfiller (or any user) attempts to exit before an `accept` transaction has been created, the bounty owner would submit a challenege with the `create` transaction submitted to initialize the bounty.

#### Bounty Owner Challenge Requirements
* `create` transaction must be signed by ???

#### Fulfiller Response Requirements
* ???


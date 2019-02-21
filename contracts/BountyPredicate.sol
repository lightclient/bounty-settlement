pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./inherited/IPredicate.sol";

contract BountyPredicate is IPredicate {
    uint8 constant CREATE_TYPE = 0;
    uint8 constant FULFILL_TYPE = 1;
    uint8 constant ACCEPT_TYPE = 2;

    struct TransactionData {
        address owner;
        uint8 action;
        bytes data;
    }

    struct Witness {
        uint256 rangeStart;
        uint256 rangeEnd;
        bytes signature;
    }

    /*
     * Public functions
     */
    
    function canStartExit(
        Exit memory _exit
    ) public view returns (bool) {
        return canStartExit1(
            _exit.state,
            _exit.rangeStart,
            _exit.rangeEnd,
            _exit.exitHeight,
            _exit.exitTime
        );
    }

    function canStartExit1(
        bytes memory _exitedTxData,
        uint256 rangeStart,
        uint256 rangeEnd,
        uint256 exitHeight,
        uint256 exitTime
    ) public view returns (bool) {
        TransactionData memory data = bytesToTransactionData(_exitedTxData);
        bool validSender = (tx.origin == data.owner);
        return validSender;
    }

    function canCancel(
        Exit memory _exit,
        bytes memory _witness
    ) public view returns (bool) {
        // TODO
        return false;
    }

    function finalizeExit(
        Exit memory _exit
    ) public payable {
      // TODO

    }

    /*
     * Internal functions
     */

    function bytesToWitness(
        bytes memory _witness
    ) internal pure returns (Witness memory) {
        (uint256 rangeStart, uint256 rangeEnd, bytes memory signature) = abi.decode(_witness, (uint256, uint256, bytes));
        return Witness(rangeStart, rangeEnd, signature);
    }

    function bytesToTransactionData(
        bytes memory _txData
    ) internal pure returns (TransactionData memory) {
        (bytes memory parameters,) = abi.decode(_txData, (bytes, address));
        (address owner, uint8 action, bytes memory data) = abi.decode(parameters, (address, uint8, bytes));
        return TransactionData(owner, action, data);
    }
}

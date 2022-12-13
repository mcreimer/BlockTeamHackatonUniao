// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./MetadataLibrary.sol";
import "./NFTMetadata.sol";

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract PortfolioManagement is IERC721Receiver, ERC165, ERC721Holder {
    NFTMetadata public nftToken;

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public numConfirmationsRequired;

    struct Transaction {
        address to;
        uint256 tokenID;
        bool executed;
        uint256 numConfirmations;
    }

    // mapping from tx index => owner => bool
    mapping(uint256 => mapping(address => bool)) public isConfirmed;

    Transaction[] public transactions;

    //modifier

    modifier onlyRole() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    modifier txExists(uint256 _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    modifier notExecuted(uint256 _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint256 _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

    //events
    event ConfirmTransaction(address indexed owner, uint256 indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint256 indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex);
    event SubmitTransaction(
        address indexed owner,
        uint256 indexed txIndex,
        uint256 indexed tokenID,
        address to
    );

    constructor(
        address[] memory _owners,
        address _tokenAddress,
        uint256 _numConfirmationsRequired
    ) {
        require(_owners.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;

        // @TODO verify interface support and contract address
        nftToken = NFTMetadata(_tokenAddress);
    }

    function submitTransaction(
        address _to,
        uint256 _tokenId,
        MetadataLibrary.Property[] memory _properties,
        MetadataLibrary.Attribute[] memory _attributes
    ) public onlyRole {
        uint256 txIndex = transactions.length;

        //Transaction  storage transaction =  );

        transactions.push(
            Transaction({
                to: _to,
                tokenID: _tokenId,
                executed: false,
                numConfirmations: 0
            })
        );

        nftToken.addProperties(_tokenId, _properties);
        nftToken.addAttributes(_tokenId, _attributes);

        emit SubmitTransaction(msg.sender, txIndex, _tokenId, _to);
    }

    function confirmTransaction(
        uint256 _txIndex
    )
        public
        onlyRole
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    function executeTransaction(
        uint256 _txIndex
    ) public txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );

        transaction.executed = true;

        nftToken.safeMint(transaction.to, transaction.tokenID, "");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    function revokeConfirmation(
        uint _txIndex
    ) public onlyRole txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

    function getTransaction(
        uint _txIndex
    )
        public
        view
        returns (
            address to,
            uint256 tokenID,
            bool executed,
            uint numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.tokenID,
            transaction.executed,
            transaction.numConfirmations
        );
    }

    //
    receive() external payable {}
}

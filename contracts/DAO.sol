//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract DAO {
    address owner;
    Token public token;
    uint256 public quorum;

    struct Proposal {
        uint256 id;
        string name;
        uint256 amount;
        address payable recipient;
        uint256 votes;
        bool finalized;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;

    mapping(uint256 => mapping(address => bool)) votes;

    event Propose(
        uint id,
        uint256 amount,
        address recipient,
        address creator
    ); 

    event Vote(
        uint256 id,
        address investor
    );

    constructor(Token _token, uint256 _quorum) {
        owner = msg.sender;
        token = _token;
        quorum = _quorum;
    }

    // Allow contract to receive ETH
    receive() external payable {}

    modifier onlyInvestor() {
        require(
            token.balanceOf(msg.sender) > 0,
            "Must be token holder"
        );
        _;
    }

    function createProposal(
        string memory _name,
        uint256 _amount,
        address payable _recipient
    ) external onlyInvestor {
        require(address(this).balance >= _amount);

        // Increment proposal count
        proposalCount++;

        // Create proposal
        proposals[proposalCount] = Proposal(
            proposalCount,
            _name,
            _amount,
            _recipient,
            0,
            false
        );


        emit Propose(
            proposalCount,
            _amount,
            _recipient,
            msg.sender
        );
    }   


    function vote(uint256 _id) external onlyInvestor {

        Proposal storage proposal = proposals[_id];

        //require(!votes[msg.sender][_id], "Already voted");
        require(!votes[_id][msg.sender], "Already voted");

        proposal.votes += token.balanceOf(msg.sender);

        //votes[msg.sender][_id] = true;
        votes[_id][msg.sender] = true;

        emit Vote(_id, msg.sender);
    }

}

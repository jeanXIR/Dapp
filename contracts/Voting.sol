// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A voting contract
/// @author Cyril C., with some modifications by Jean C.
/// @notice You can use this contract for basic voting 
contract Voting is Ownable {

    // arrays for draw, uint for single
    // uint[] winningProposalsID;
    // Proposal[] public winningProposals;
    uint public winningProposalId;

    /// @notice Retrieve the ID of the winning proposal
    /// @dev This function has been added to display the winner in the front-end of the dapp
    /// @return winningProposalId, the ID of the winning proposal
    function getWinningProposalId() public view returns (uint) {
        return winningProposalId;
    }
    
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;

    /// @notice Retrieve the current status of the workflow
    /// @dev The workflowStatus can be RegisteringVoters, ProposalsRegistrationStarted, ProposalsRegistrationEnded, VotingSessionStarted, VotingSessionEnded, VotesTallied
    /// @return workflowStatus, an int that corresponds to the WorkflowStatus
    function getWorkflowStatus() public view returns (WorkflowStatus) {
        return workflowStatus;
    }

    // Proposal[] proposalsArray; 
    Proposal[12] proposalsArray;
    uint public numberOfProposals;
    mapping (address => Voter) voters;


    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId, string proposalDescription);
    event Voted (address voter, uint proposalId);


    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }
    
    // on peut faire un modifier pour les états

    // ::::::::::::: GETTERS ::::::::::::: //

    /// @notice Retrieve the voting characteristics of an address
    /// @dev Retrieve the voting characteristics of an address
    /// @param _addr The address of the voter we want to analyse
    /// @return Voter the voter
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }
    
    /// @notice Retrieve the proposal characteristics of an entry
    /// @dev Retrieve the proposal characteristics of an entry
    /// @param _id The proposal id
    /// @return Proposal, the proposal
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

    /// @notice Retrieve the proposal characteristics of an entry
    /// @dev Retrieve the proposal characteristics of an entry
    /// @param _id The proposal id
    /// @return Proposal, the proposal
    function getOneProposalDescription(uint _id) external onlyVoters view returns (string memory) {
        return proposalsArray[_id].description;
    }
 
    // ::::::::::::: REGISTRATION ::::::::::::: // 

    /// @notice Add a voter
    /// @dev Add a voter
    /// @param _addr The address of the voter to add
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');
    
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }
 
    // ::::::::::::: PROPOSAL ::::::::::::: // 

    /// @notice Add a proposal
    /// @dev Add a proposal
    /// @param _desc The description of the proposal
    function addProposal(string memory _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer'); // facultatif
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;

        // proposalsArray.push(proposal);
        proposalsArray[numberOfProposals] = proposal;
        numberOfProposals += 1;

        // emit ProposalRegistered(proposalsArray.length-1);
        emit ProposalRegistered(numberOfProposals-1, _desc);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    /// @notice Vote for a proposal
    /// @dev Vote for a proposal
    /// @param _id The proposal id
    function setVote( uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id <= proposalsArray.length, 'Proposal not found'); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id);
    }

    /// @notice Start the registering of the proposals
    /// @dev Start the registering of the proposals
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /// @notice End the registering of the proposals
    /// @dev End the registering of the proposals
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /// @notice Start the voting session
    /// @dev Start the voting session
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /// @notice End the voting session
    /// @dev End the voting session
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /// @notice Count the votes
    /// @dev Count the votes
    function tallyVotes() external onlyOwner {
       require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
       uint _winningProposalId;
      for (uint256 p = 0; p < proposalsArray.length; p++) {
           if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
               _winningProposalId = p;
          }
       }
       winningProposalId = _winningProposalId;
       
       workflowStatus = WorkflowStatus.VotesTallied;
       emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}
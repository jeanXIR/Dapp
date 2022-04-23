import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import "./App.css";


class App extends Component {
  state = { winningProposal: null, workflowStatus: null, web3: null, accounts: null, contract: null, 
    proposal0: undefined, proposal1: undefined, proposal2: undefined, proposal3: undefined, proposal4: undefined, owned:false, showProposals: false};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
 
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      
      const owner = await instance.methods.owner().call();
      let owned= accounts[0]==owner;


      this.setState({ web3, accounts, contract: instance, owned }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };



  runExample = async () => {
    const { accounts, contract } = this.state;
    
    // const response = await contract.methods.getWinningProposalId().call();
    // this.setState({ winningProposal: response });

    const response2 = await contract.methods.getWorkflowStatus().call();
    this.setState({ workflowStatus: response2 });
  }; 

  handleInputChange = e => {
    this.setState({[e.target.name]: e.target.value,});
  };

  handleSubmit = async (e) => {
    const { accounts, contract, username } = this.state;
    await contract.methods.addVoter(username).send({ from: accounts[0] });
  }

  handleSubmitStartProposalsRegistering = async () => {
    const { accounts, contract } = this.state;
    const objet = await contract.methods.startProposalsRegistering().send({ from: accounts[0] });

    let valueEventPreviousStatus = objet.events.WorkflowStatusChange.returnValues.previousStatus;
    alert("The previous status was : " + valueEventPreviousStatus)

    let valueEventNewStatus = objet.events.WorkflowStatusChange.returnValues.newStatus;
    alert("The new status is : " + valueEventNewStatus)

    const response2 = await contract.methods.getWorkflowStatus().call();
    this.setState({ workflowStatus: response2 });
  }

  handleSubmitProposal = async (e) => {
    const { accounts, contract, proposal } = this.state;
    await contract.methods.addProposal(proposal).send({ from: accounts[0] });
  }

  handleSubmitEndProposalsRegistering = async () => {
    const { accounts, contract } = this.state;
    const objet = await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
    const response3 = await contract.methods.getWorkflowStatus().call();
    this.setState({ workflowStatus: response3 });

    let valueEventPreviousStatus = objet.events.WorkflowStatusChange.returnValues.previousStatus;
    alert("The previous status was : " + valueEventPreviousStatus)

    let valueEventNewStatus = objet.events.WorkflowStatusChange.returnValues.newStatus;
    alert("The new status is : " + valueEventNewStatus)
  }

  handleSubmitProposalId = async (e) => {
    const { accounts, contract, proposalId } = this.state;
    await contract.methods.setVote(parseInt(proposalId)).send({ from: accounts[0] });
  }

  handleSubmitStartVotingSession = async () => {
    const { accounts, contract } = this.state;
    const objet = await contract.methods.startVotingSession().send({ from: accounts[0] });
    const response4 = await contract.methods.getWorkflowStatus().call();
    this.setState({ workflowStatus: response4 });

    let valueEventPreviousStatus = objet.events.WorkflowStatusChange.returnValues.previousStatus;
    alert("The previous status was : " + valueEventPreviousStatus)

    let valueEventNewStatus = objet.events.WorkflowStatusChange.returnValues.newStatus;
    alert("The new status is : " + valueEventNewStatus)
  }

  handleSubmitEndVotingSession = async () => {
    const { accounts, contract } = this.state;
    const objet = await contract.methods.endVotingSession().send({ from: accounts[0] });
    const response5 = await contract.methods.getWorkflowStatus().call();
    this.setState({ workflowStatus: response5 });

    let valueEventPreviousStatus = objet.events.WorkflowStatusChange.returnValues.previousStatus;
    alert("The previous status was : " + valueEventPreviousStatus)

    let valueEventNewStatus = objet.events.WorkflowStatusChange.returnValues.newStatus;
    alert("The new status is : " + valueEventNewStatus)
  }
  
  
  handleSubmitTallyVotes = async () => {
    const { accounts, contract } = this.state;
    const objet = await contract.methods.tallyVotes().send({ from: accounts[0] });
    const response6 = await contract.methods.getWorkflowStatus().call();
    this.setState({ workflowStatus: response6 });
    const response = await contract.methods.getWinningProposalId().call();
    this.setState({ winningProposal: response });

    let valueEventPreviousStatus = objet.events.WorkflowStatusChange.returnValues.previousStatus;
    alert("The previous status was : " + valueEventPreviousStatus)

    let valueEventNewStatus = objet.events.WorkflowStatusChange.returnValues.newStatus;
    alert("The new status is : " + valueEventNewStatus)
}

  handleSubmitGetWinningId = async () => {
    const { contract } = this.state;
    const response = await contract.methods.getWinningProposalId().call();
    this.setState({ winningProposal: response });

  }

  handleSubmitShowproposals = async () => {
    const { accounts, contract } = this.state;
    const response = (await contract.methods.getOneProposal(0).call({ from: accounts[0] }));
    console.log(response);
    //alert(response[0])
    this.setState({ proposal0: response[0] });  

    const response2 = (await contract.methods.getOneProposal(1).call({ from: accounts[0] }));
    this.setState({ proposal1: response2[0] });  

    const response3 = (await contract.methods.getOneProposal(2).call({ from: accounts[0] }));
    this.setState({ proposal2: response3[0] });  

    const response4 = (await contract.methods.getOneProposal(3).call({ from: accounts[0] }));
    this.setState({ proposal3: response4[0] });  

    const response5 = (await contract.methods.getOneProposal(4).call({ from: accounts[0] }));
    this.setState({ proposal4: response5[0] });  

    this.setState({showProposals : true});

  }
  
  
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitBis = this.handleSubmitBis.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmitBis(event) {
    alert('this.state.winningProposal ' + this.state.winningProposal );
    event.preventDefault();
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    if (this.state.owned){
      if(this.state.showProposals){
        return (
          <div className="App">
    
            <h1>Application de vote</h1>
            <div>Adresse connectée : {this.state.accounts}</div><br></br>
            <div>Etat du vote (workflowStatus) : {this.state.workflowStatus}</div>
            <p>Owner, inscrivez les voters ici : </p>
                
            <form onSubmit={this.handleSubmit}>
                            <input type="text" id="username" name="username" onChange={this.handleInputChange} required/>             
                            <button className="btn blue darken-2" type="submit" name="action">Enregister
                            </button><br></br>
            </form><br></br>
                        
            <button  type="button" onClick={this.handleSubmitStartProposalsRegistering} name="startProposalsRegistering">Commencer l'enregistrement des propositions</button><br></br><br></br>
                            
            <form onSubmit={this.handleSubmitProposal}>
                            <label htmlFor="proposal">Quelle est votre proposition ?</label><br></br>
                            <input type="text" id="proposal" name="proposal" onChange={this.handleInputChange} required/>
                            <button className="btn blue darken-2" type="submit" name="proposal">Envoyer</button>
            </form><br></br>
    
            <button  type="button" onClick={this.handleSubmitShowproposals} name="showproposals">Afficher les propositions</button>
            <center><table>
              <tr><th>ID de la proposition</th><th>Description de la proposition</th></tr>
              <tr><td>0</td><td>{this.state.proposal0}</td></tr>
              <tr><td>1</td><td>{this.state.proposal1}</td></tr>
              <tr><td>2</td><td>{this.state.proposal2}</td></tr>
              <tr><td>3</td><td>{this.state.proposal3}</td></tr>
              <tr><td>4</td><td>{this.state.proposal4}</td></tr>
            </table></center><br></br>

            <button  type="button" onClick={this.handleSubmitEndProposalsRegistering} name="endProposalsRegistering">Cloturer l'enregistrement des propositions</button><br></br><br></br>
            <button  type="button" onClick={this.handleSubmitStartVotingSession} name="startVotingSession">Commencer la session de vote</button><br></br><br></br>
            
            <form onSubmit={this.handleSubmitProposalId}>
                            <label htmlFor="proposalId">Votez pour la proposition de votre choix</label><br></br>
                            <input type="text" id="proposalId" name="proposalId" onChange={this.handleInputChange} required/>
                            <button className="btn blue darken-2" type="submit" name="proposalId">Envoyer</button>
            </form><br></br>
                        
            <button  type="button" onClick={this.handleSubmitEndVotingSession} name="endVotingSession">Cloturer la session de vote</button><br></br><br></br>
            <button  type="button" onClick={this.handleSubmitTallyVotes} name="tallyVotes">Compter les voix</button><br></br><br></br>
            <button  type="button" onClick={this.handleSubmitGetWinningId} name="getWinningId">Afficher l'ID du vainqueur</button><br></br><br></br>
            
    
            <div>winningProposalID : {this.state.winningProposal}</div>
          </div>
        );
      }
      else{
        return (
          <div className="App">
    
            <h1>Application de vote</h1>
            <div>Adresse connectée : {this.state.accounts}</div><br></br>
            <div>Etat du vote (workflowStatus) : {this.state.workflowStatus}</div>
            <p>Owner, inscrivez les voters ici : </p>
                
            <form onSubmit={this.handleSubmit}>
                            <input type="text" id="username" name="username" onChange={this.handleInputChange} required/>             
                            <button className="btn blue darken-2" type="submit" name="action">Enregister
                            </button><br></br>
            </form><br></br>
                        
            <button  type="button" onClick={this.handleSubmitStartProposalsRegistering} name="startProposalsRegistering">Commencer l'enregistrement des propositions</button><br></br><br></br>
                            
            <form onSubmit={this.handleSubmitProposal}>
                            <label htmlFor="proposal">Quelle est votre proposition ?</label><br></br>
                            <input type="text" id="proposal" name="proposal" onChange={this.handleInputChange} required/>
                            <button className="btn blue darken-2" type="submit" name="proposal">Envoyer</button>
            </form><br></br>
    
            <button  type="button" onClick={this.handleSubmitShowproposals} name="showproposals">Afficher les propositions</button><br></br><br></br>

            <button  type="button" onClick={this.handleSubmitEndProposalsRegistering} name="endProposalsRegistering">Cloturer l'enregistrement des propositions</button><br></br><br></br>
            <button  type="button" onClick={this.handleSubmitStartVotingSession} name="startVotingSession">Commencer la session de vote</button><br></br><br></br>
            
            <form onSubmit={this.handleSubmitProposalId}>
                            <label htmlFor="proposalId">Votez pour l'ID de la proposition de votre choix</label><br></br>
                            <input type="text" id="proposalId" name="proposalId" onChange={this.handleInputChange} required/>
                            <button className="btn blue darken-2" type="submit" name="proposalId">Envoyer</button>
            </form><br></br>
                        
            <button  type="button" onClick={this.handleSubmitEndVotingSession} name="endVotingSession">Cloturer la session de vote</button><br></br><br></br>
            <button  type="button" onClick={this.handleSubmitTallyVotes} name="tallyVotes">Compter les voix</button><br></br><br></br>
            <button  type="button" onClick={this.handleSubmitGetWinningId} name="getWinningId">Afficher l'ID du vainqueur</button><br></br><br></br>
            
    
            <div>winningProposalID : {this.state.winningProposal}</div>
          </div>
        );
      }
    }

    else{

      if(this.state.showProposals){ // is this.state.show
        return (
          <div className="App">
    
            <h1>Application de vote</h1>
            <div>Adresse connectée : {this.state.accounts}</div><br></br>
            <div>Etat du vote (workflowStatus) : {this.state.workflowStatus}</div><br></br>
            
            <form onSubmit={this.handleSubmitProposal}>
                            <label htmlFor="proposal">Quelle est votre proposition ?</label><br></br><br></br>
                            <input type="text" id="proposal" name="proposal" onChange={this.handleInputChange} required/>
                            <button className="btn blue darken-2" type="submit" name="proposal">Envoyer</button>
            </form>

            <center><table>
              <tr><th>ID de la proposition</th><th>Description de la proposition</th></tr>
              <tr><td>0</td><td>{this.state.proposal0}</td></tr>
              <tr><td>1</td><td>{this.state.proposal1}</td></tr>
              <tr><td>2</td><td>{this.state.proposal2}</td></tr>
              <tr><td>3</td><td>{this.state.proposal3}</td></tr>
              <tr><td>4</td><td>{this.state.proposal4}</td></tr>
            </table></center><br></br>

            <form onSubmit={this.handleSubmitProposalId}>
                            <label htmlFor="proposalId">Votez pour l'ID de la proposition de votre choix</label><br></br>
                            <input type="text" id="proposalId" name="proposalId" onChange={this.handleInputChange} required/>
                            <button className="btn blue darken-2" type="submit" name="proposalId">Envoyer</button>
            </form><br></br>
                        
            <button  type="button" onClick={this.handleSubmitGetWinningId} name="getWinningId">Afficher l'ID du vainqueur</button><br></br><br></br>
            <button  type="button" onClick={this.handleSubmitShowproposals} name="showproposals">Afficher les propositions</button><br></br><br></br>
    
            <div>winningProposalID : {this.state.winningProposal}</div>
          </div>
        );
      }
      else{
        return (
          <div className="App">
    
            <h1>Application de vote</h1>
            <div>Adresse connectée : {this.state.accounts}</div><br></br>
            <div>Etat du vote (workflowStatus) : {this.state.workflowStatus}</div><br></br>
            
            <form onSubmit={this.handleSubmitProposal}>
                            <label htmlFor="proposal">Quelle est votre proposition ?</label><br></br>
                            <input type="text" id="proposal" name="proposal" onChange={this.handleInputChange} required/>
                            <button className="btn blue darken-2" type="submit" name="proposal">Envoyer</button>
            </form><br></br>
     
            <button  type="button" onClick={this.handleSubmitShowproposals} name="showproposals">Afficher les propositions</button><br></br><br></br>

            <form onSubmit={this.handleSubmitProposalId}>
                            <label htmlFor="proposalId">Votez pour l'ID de la proposition de votre choix</label><br></br>
                            <input type="text" id="proposalId" name="proposalId" onChange={this.handleInputChange} required/>
                            <button className="btn blue darken-2" type="submit" name="proposalId">Envoyer</button>
            </form><br></br>
                        
            <button  type="button" onClick={this.handleSubmitGetWinningId} name="getWinningId">Afficher l'ID du vainqueur</button><br></br><br></br>
            
            <div>winningProposalID : {this.state.winningProposal}</div>
          </div>
        );
      }
    }
  }
}

export default App;

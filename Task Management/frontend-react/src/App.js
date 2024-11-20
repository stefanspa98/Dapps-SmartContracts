import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';

class App extends Component {
  state = {
    taskName: '',
    description: '',
    hour: '',
    tasks: [],
    account: '',
    web3: null,
    contract: null,
  };

  async componentDidMount() {
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.requestAccounts();
        const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with your contract address
        const contractABI = [
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "taskId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "hour",
                "type": "uint256"
              }
            ],
            "name": "TaskAdded",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "taskId",
                "type": "uint256"
              }
            ],
            "name": "TaskApproved",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "taskId",
                "type": "uint256"
              }
            ],
            "name": "TaskDeclined",
            "type": "event"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "_name",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "_description",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "_hour",
                "type": "uint256"
              }
            ],
            "name": "addTask",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_taskId",
                "type": "uint256"
              }
            ],
            "name": "approveTask",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_taskId",
                "type": "uint256"
              }
            ],
            "name": "declineTask",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "taskCount",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "tasks",
            "outputs": [
              {
                "internalType": "string",
                "name": "name",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "hour",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "declined",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ];

        const contract = new web3.eth.Contract(contractABI, contractAddress);

        this.setState({ web3, contract, account: accounts[0] });
        this.loadTasks();
      } else {
        console.error('MetaMask extension not detected.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  loadTasks = async () => {
    const { contract } = this.state;
    const taskCount = await contract.methods.taskCount().call();
    console.log(taskCount);
    const tasks = [];

    for (let i = 0; i < taskCount; i++) {
      const task = await contract.methods.tasks(i).call();
      tasks.push(task);
    }

    this.setState({ tasks });
  };

  createTask = async () => {
    const { taskName, description, hour } = this.state;

    try {
      const { contract, account } = this.state;

      await contract.methods.addTask(taskName, description, hour).send({ from: account });

      //console.log(hour);

      // Clear input fields
      this.setState({ taskName: '', description: '', hour: '' });

      this.loadTasks();
    } catch (error) {
      console.error(error);
    }
  };
  approveTask = async (taskId) => {
    try {
      const { contract, account, tasks } = this.state;
  
      await contract.methods.approveTask(taskId).send({ from: account });
  
      console.log('Task approved successfully!');
  
      // Update the task object in the tasks array
      const updatedTasks = tasks.map((task, index) => {
        if (index === taskId) {
          return { ...task, approved: true, declined: false };
        }
        return task;
      });
  
      this.setState({ tasks: updatedTasks });
    } catch (error) {
      console.error(error);
    }
  };
  
  declineTask = async (taskId) => {
    try {
      const { contract, account, tasks } = this.state;
  
      await contract.methods.declineTask(taskId).send({ from: account });
  
      console.log('Task declined successfully!');
  
      // Update the task object in the tasks array
      const updatedTasks = tasks.map((task, index) => {
        if (index === taskId) {
          return { ...task, approved: false, declined: true };
        }
        return task;
      });
  
      this.setState({ tasks: updatedTasks });
    } catch (error) {
      console.error(error);
    }
  };
  
  
  renderTasks() {
    const { tasks } = this.state;
    return tasks.map((task, index) => (
      <div className={`card ${task.approved ? 'approved' : task.declined ? 'declined' : ''}`} key={index}>
        <div className="card-body">
          <h5 className="card-title">Task Name: {task.name}</h5>
          <p className="card-text">Description: {task.description}</p>
          <p className="card-text">Hours: {task.hour.toString()}</p>
          {!task.approved && !task.declined && (
            <>
              <button className="btn btn-success" onClick={() => this.approveTask(index)}>
                Approve
              </button>
              <button className="btn btn-danger" onClick={() => this.declineTask(index)}>
                Decline
              </button>
            </>
          )}
        </div>
      </div>
    ));
  } 

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { taskName, description, hour, account } = this.state;

    return (
      <div className="container">
        <h1>Task Manager</h1>
        <div className="account-info">
          <span>Connected Account: {account}</span>
        </div>
        <form className="task-form">
          <div className="form-group">
            <label htmlFor="taskName">Task Name:</label>
            <input
              type="text"
              className="form-control"
              id="taskName"
              name="taskName"
              value={taskName}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              value={description}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="hour">Hours:</label>
            <input
              type="text"
              className="form-control"
              id="hour"
              name="hour"
              value={hour}
              onChange={this.handleChange}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={this.createTask}>
            Create Task
          </button>
        </form>
        <div className="task-list">{this.renderTasks()}</div>
      </div>
    );
  }
}

export default App;

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskManager {
  struct Task {
    string name;
    string description;
    uint hour;
    bool approved;
    bool declined;
  }

  mapping(uint => Task) public tasks;
  uint public taskCount;

  event TaskAdded(uint taskId, string name, string description, uint hour);
  event TaskApproved(uint taskId);
  event TaskDeclined(uint taskId);

  function addTask(string memory _name, string memory _description, uint _hour) external {
    uint taskId = taskCount;
    Task storage newTask = tasks[taskId];
    newTask.name = _name;
    newTask.description = _description;
    newTask.hour = _hour;
    newTask.approved = false;
    newTask.declined = false;
    
    taskCount++;

    emit TaskAdded(taskId, _name, _description, _hour);
  }

  function approveTask(uint _taskId) external {
    Task storage task = tasks[_taskId];
    require(!task.approved && !task.declined, 'Task already approved or declined');

    task.approved = true;
    emit TaskApproved(_taskId);
  }

  function declineTask(uint _taskId) external {
    Task storage task = tasks[_taskId];
    require(!task.approved && !task.declined, 'Task already approved or declined');

    task.declined = true;
    emit TaskDeclined(_taskId);
  }
}


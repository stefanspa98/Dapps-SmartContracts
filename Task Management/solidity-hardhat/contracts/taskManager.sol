// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskManager {
  struct Task {
    string name;
    string description;
    uint256 hour;
    bool approved;
    bool declined;
  }

  mapping(uint256 => Task) public tasks;
  uint256 public taskCount;

  event TaskAdded(uint256 taskId, string name, string description, uint256 hour);
  event TaskApproved(uint256 taskId);
  event TaskDeclined(uint256 taskId);

  function addTask(string memory _name, string memory _description, uint256 _hour) external {
    uint256 taskId = taskCount;
    Task storage newTask = tasks[taskId];
    newTask.name = _name;
    newTask.description = _description;
    newTask.hour = _hour;
    newTask.approved = false;
    newTask.declined = false;
    
    taskCount++;

    emit TaskAdded(taskId, _name, _description, _hour);
  }

  function approveTask(uint256 _taskId) external {
    Task storage task = tasks[_taskId];
    require(!task.approved && !task.declined, 'Task already approved or declined');

    task.approved = true;
    emit TaskApproved(_taskId);
  }

  function declineTask(uint256 _taskId) external {
    Task storage task = tasks[_taskId];
    require(!task.approved && !task.declined, 'Task already approved or declined');

    task.declined = true;
    emit TaskDeclined(_taskId);
  }
}


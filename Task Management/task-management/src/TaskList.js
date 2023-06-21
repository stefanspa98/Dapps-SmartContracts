import React from 'react';

const TaskList = ({ tasks }) => {
  return (
    <div>
      <h2>Tasks:</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

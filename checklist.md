# TodoApp Checklist

## Basic React Checklist.
1. PropTypes should describe objects and arrays, which are passed in the component.
1. Use destructuring wherever possible. It makes code more readable.
1. Functions should do one thing. Don't make monsters!)
1. A variable name should describe what is stored in it.
1. Use functional components with React Hooks.
1. A function name should describe the result and starts from a verb.
   Follow [these](https://medium.com/javascript-in-plain-english/handy-naming-conventions-for-event-handler-functions-props-in-react-fc1cbb791364) naming conventions for functions.
1. Use `classnames` lib for calculated classes.
1. Use key attribute correctly (read [here](https://medium.com/blackrock-engineering/5-common-mistakes-with-keys-in-react-b86e82020052) for more details)

## Task checklist.
1. `App.js` code should be split into several components.
1. Callbacks that work with the main state should take prepared data instead of the whole child's state.
1. Code should be split into small, reusable components if it possible (`Filter`, `TodoList`, `Todo`, `NewTodo`)
1. ID for new todos should be unique, you can use an internal ID counter for this, and increment it.
1. “Toggle all” should be active only in case when all todos are completed.
1. If you manually toggle all todos to completed state, “Toggle all” should stay active.
1. "Toggle all" should stay inactive if at least one todo is not completed.
1. `NewTodo` form shouldn’t create empty todos.
1. `NewTodo` form should trim redundant spaces.
1. Do not rely on the unknown string, make constants for this.
    ```
    const FILTERS = {
      all: ‘all’,
      completed: ‘completed’,
      active: ‘active’,
    };
    ```
1. Show only `NewTodo` form if todos array is empty.

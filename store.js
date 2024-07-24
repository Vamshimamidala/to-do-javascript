const store = {
    get() {
      const todos = JSON.parse(localStorage.getItem('todos')) || [];
      return todos;
    },
    set(todos) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  };
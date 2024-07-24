class TodoModel {
    constructor(key) {
      this.key = key;
      this.todos = store.get();
    }
  
    find(query) {
      return Promise.resolve(this.todos.filter(todo => Object.keys(query).every(k => todo[k] === query[k])));
    }
  
    update(id, data) {
      return new Promise((resolve) => {
        this.todos = this.todos.map(todo => (todo.id === id ? { ...todo, ...data } : todo));
        store.set(this.todos);
        resolve();
      });
    }
  
    insert(data) {
      return new Promise((resolve) => {
        const id = Date.now().toString();
        const todo = { id, ...data };
        this.todos.push(todo);
        store.set(this.todos);
        resolve(todo);
      });
    }
  
    remove(id) {
      return new Promise((resolve) => {
        this.todos = this.todos.filter(todo => todo.id !== id);
        store.set(this.todos);
        resolve();
      });
    }
  
    getTodo(id) {
      return Promise.resolve(this.todos.find(todo => todo.id === id));
    }
  
    getTodos() {
      return Promise.resolve(this.todos);
    }
  }
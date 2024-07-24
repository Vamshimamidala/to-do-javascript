class TodoController {
    constructor(model, view) {
      this.model = model;
      this.view = view;
  
      this.view.bind('newTodo', this.addTodo.bind(this));
      this.view.bind('itemEdit', this.editTodo.bind(this));
      this.view.bind('itemEditDone', this.editTodoSave.bind(this));
      this.view.bind('itemRemove', this.removeTodo.bind(this));
      this.view.bind('itemToggle', this.toggleTodo.bind(this));
      this.view.bind('removeCompleted', this.removeCompletedTodos.bind(this));
      this.view.bind('toggleAll', this.toggleAllTodos.bind(this));
      this.view.bind('filterChange', this.updateFilter.bind(this));
  
      this.showAll();
    }
  
    showAll() {
      this.model.getTodos().then(todos => {
        this.view.render('showTodos', todos);
        this.view.render('setVisibility', todos.length > 0);
        this.view.render('setFooter', todos);
        this.view.render('setToggleAll', todos.every(todo => todo.completed));
      });
    }
  
    addTodo(title) {
      this.model.insert({ title, completed: false }).then(() => {
        this.view.render('clearNewTodo');
        this.showAll();
      });
    }
  
    editTodo({ id }) {
      const todoElement = document.querySelector(`[data-id="${id}"]`);
      todoElement.classList.add('editing');
      todoElement.querySelector('.edit').focus();
    }
  
    editTodoSave({ id, title }) {
      if (title) {
        this.model.update(id, { title }).then(() => {
          this.showAll();
        });
      }
    }
  
    removeTodo({ id }) {
      this.model.remove(id).then(() => {
        this.showAll();
      });
    }
  
    toggleTodo({ id, completed }) {
      this.model.update(id, { completed }).then(() => {
        this.showAll();
      });
    }
  
    removeCompletedTodos() {
      this.model.getTodos().then(todos => {
        const completedTodos = todos.filter(todo => todo.completed);
        Promise.all(completedTodos.map(todo => this.model.remove(todo.id))).then(() => {
          this.showAll();
        });
      });
    }
  
    toggleAllTodos({ completed }) {
      this.model.getTodos().then(todos => {
        Promise.all(todos.map(todo => this.model.update(todo.id, { completed }))).then(() => {
          this.showAll();
        });
      });
    }
  
    updateFilter(filter) {
      this.view.render('setFilter', filter);
      this.showAll();
    }
  }
class TodoView {
    constructor() {
      this.$todoList = document.querySelector('.todo-list');
      this.$newTodo = document.querySelector('.new-todo');
      this.$toggleAll = document.querySelector('.toggle-all');
      this.$footer = document.querySelector('.footer');
      this.$main = document.querySelector('.main');
    }
  
    bind(event, handler) {
      switch(event) {
        case 'newTodo':
          this.$newTodo.addEventListener('change', () => handler(this.$newTodo.value));
          break;
        case 'itemEdit':
          this.$todoList.addEventListener('dblclick', (e) => {
            if (e.target.tagName.toLowerCase() === 'label') {
              handler({ id: e.target.closest('li').dataset.id });
            }
          });
          break;
        case 'itemEditDone':
          this.$todoList.addEventListener('keypress', (e) => {
            if (e.target.classList.contains('edit') && e.key === 'Enter') {
              handler({ id: e.target.closest('li').dataset.id, title: e.target.value });
            }
          });
          break;
        case 'itemRemove':
          this.$todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('destroy')) {
              handler({ id: e.target.closest('li').dataset.id });
            }
          });
          break;
        case 'itemToggle':
          this.$todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('toggle')) {
              handler({ id: e.target.closest('li').dataset.id, completed: e.target.checked });
            }
          });
          break;
        case 'removeCompleted':
          document.querySelector('.clear-completed').addEventListener('click', () => handler());
          break;
        case 'toggleAll':
          this.$toggleAll.addEventListener('click', () => handler({ completed: this.$toggleAll.checked }));
          break;
        case 'filterChange':
          document.querySelector('.filters').addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'a') {
              handler(e.target.hash.replace('#/', ''));
            }
          });
          break;
      }
    }
  
    render(command, parameter) {
      const commands = {
        showTodos: () => {
          this.$todoList.innerHTML = parameter.map(todo => `
            <li data-id="${todo.id}" class="${todo.completed ? 'completed' : ''}">
              <div class="view">
                <input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
                <label>${todo.title}</label>
                <button class="destroy"></button>
              </div>
              <input class="edit" value="${todo.title}">
            </li>
          `).join('');
        },
        clearNewTodo: () => {
          this.$newTodo.value = '';
        },
        removeTodo: () => {
          document.querySelector(`[data-id="${parameter.id}"]`).remove();
        },
        updateTodo: () => {
          const todo = document.querySelector(`[data-id="${parameter.id}"]`);
          if (parameter.title) {
            todo.querySelector('label').textContent = parameter.title;
            todo.querySelector('.edit').value = parameter.title;
          }
          if (parameter.completed !== undefined) {
            todo.classList.toggle('completed', parameter.completed);
            todo.querySelector('.toggle').checked = parameter.completed;
          }
        },
        setFilter: () => {
          document.querySelector('.filters .selected').classList.remove('selected');
          document.querySelector(`[href="#/${parameter}"]`).classList.add('selected');
        },
        setVisibility: () => {
          this.$main.style.display = parameter ? 'block' : 'none';
          this.$footer.style.display = parameter ? 'block' : 'none';
        },
        setToggleAll: () => {
          this.$toggleAll.checked = parameter;
        },
        setClearCompletedButton: () => {
          document.querySelector('.clear-completed').style.display = parameter ? 'block' : 'none';
        },
        setTodoCount: () => {
          document.querySelector('.todo-count').textContent = parameter;
        },
        setFooter: () => {
          const todoCount = this.$todoList.children.length;
          const activeTodoCount = this.$todoList.querySelectorAll('li:not(.completed)').length;
          const completedTodoCount = todoCount - activeTodoCount;
  
          document.querySelector('.todo-count').textContent = `${activeTodoCount} ${activeTodoCount === 1 ? 'item' : 'items'} left`;
          document.querySelector('.clear-completed').style.display = completedTodoCount ? 'block' : 'none';
        }
      };
      commands[command]();
    }
  }
  
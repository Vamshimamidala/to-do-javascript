document.addEventListener('DOMContentLoaded', () => {
  const model = new TodoModel('todos');
  const view = new TodoView();
  const controller = new TodoController(model, view);

  function setView() {
    controller.updateFilter(window.location.hash.replace('#/', '') || 'all');
  }

  window.addEventListener('hashchange', setView);
  setView();
});
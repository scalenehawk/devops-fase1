export function addTask(tasks, title, id = globalThis.crypto.randomUUID()) {
  const cleanTitle = String(title).trim();
  if (!cleanTitle || cleanTitle.length > 120) throw new Error('A tarefa deve ter de 1 a 120 caracteres.');
  if (tasks.some(task => task.id === id)) throw new Error('Identificador duplicado.');
  return [...tasks, { id, title: cleanTitle, done: false }];
}

export function toggleTask(tasks, id) {
  return tasks.map(task => task.id === id ? { ...task, done: !task.done } : task);
}

export function removeTask(tasks, id) {
  return tasks.filter(task => task.id !== id);
}

export function countPending(tasks) {
  return tasks.filter(task => !task.done).length;
}

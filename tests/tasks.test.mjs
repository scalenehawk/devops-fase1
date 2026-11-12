import test from 'node:test';
import assert from 'node:assert/strict';
import { addTask, toggleTask, removeTask, countPending } from '../src/tasks.js';

test('adiciona tarefa e remove espaços externos', () => {
  assert.deepEqual(addTask([], '  Estudar CI  ', 'id-1'), [{ id: 'id-1', title: 'Estudar CI', done: false }]);
});

test('rejeita título vazio, longo e identificador repetido', () => {
  assert.throws(() => addTask([], '  ', 'id-1'));
  assert.throws(() => addTask([], 'a'.repeat(121), 'id-1'));
  assert.throws(() => addTask([{ id: 'id-1' }], 'Nova', 'id-1'));
});

test('alterna e exclui somente a tarefa selecionada', () => {
  const initial = addTask(addTask([], 'Primeira', 'a'), 'Segunda', 'b');
  const changed = toggleTask(initial, 'a');
  assert.equal(changed[0].done, true);
  assert.equal(changed[1].done, false);
  assert.equal(countPending(changed), 1);
  assert.deepEqual(removeTask(changed, 'a'), [initial[1]]);
  assert.equal(initial[0].done, false);
});

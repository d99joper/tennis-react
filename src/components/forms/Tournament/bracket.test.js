import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import TournamentBracket from './bracket';
global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => { root.unmount(); });
  document.body.removeChild(container);
  container = null;
});

test('renders message when no bracket provided', () => {
  act(() => {
    root.render(<TournamentBracket />);
  });
  expect(container.textContent).toBe('No bracket available');
});

test('renders rounds and winners', () => {
  const bracket = {
    rounds: [
      {
        matches: [
          { player1: { name: 'Alice' }, player2: { name: 'Bob' }, winner: 'player1' },
        ],
      },
    ],
  };

  act(() => {
    root.render(<TournamentBracket bracket={bracket} />);
  });

  expect(container.textContent).toContain('Round 1');
  expect(container.textContent).toContain('Alice');
  expect(container.textContent).toContain('Bob');
  expect(container.textContent).toContain('Winner: Alice');
});

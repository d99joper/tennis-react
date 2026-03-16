import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import TournamentViewPage from './tournamentView';
global.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('api/services', () => ({
  eventAPI: { getEvent: jest.fn() },
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children }) => <span>{children}</span>,
  useParams: () => ({ id: '123' }),
}));

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

test('renders event info and bracket', () => {
  const event = {
    name: 'Summer Open',
    club: { slug: 'club-a', name: 'Club A' },
    description: 'Fun tournament',
    tournament_bracket: {
      rounds: [
        {
          matches: [
            { player1: { name: 'Alice' }, player2: { name: 'Bob' }, winner: 'player1' },
          ],
        },
      ],
    },
  };

  act(() => {
    root.render(<TournamentViewPage event={event} />);
  });

  expect(container.textContent).toContain('Summer Open');
  expect(container.textContent).toContain('Hosted by Club A');
  expect(container.textContent).toContain('Fun tournament');
  expect(container.textContent).toContain('Winner: Alice');
});

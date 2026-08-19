import './Shortcuts.css';

const SHORTCUTS = [
  { keys: ['↑', '↓', '←', '→'], label: 'Move between the answers' },
  { keys: ['Enter', 'Space'], label: 'Lock in your answer, then go to the next one' },
  { keys: ['F'], label: 'Flip the card (after answering)' },
  { keys: ['H'], label: 'Add or remove from favorites' },
  { keys: ['N'], label: 'Start a new game' },
  { keys: ['?'], label: 'Show these shortcuts' },
  { keys: ['Esc'], label: 'Close this' },
];

export function Shortcuts({ onClose }) {
  return (
    <div className="shortcuts__overlay" onClick={onClose}>
      <div className="shortcuts__card" onClick={(e) => e.stopPropagation()}>
        <p className="shortcuts__title">⌨ Keyboard Shortcuts</p>
        <ul className="shortcuts__list">
          {SHORTCUTS.map(({ keys, label }) => (
            <li key={label} className="shortcuts__row">
              <span className="shortcuts__keys">
                {keys.map((k) => <kbd key={k} className="shortcuts__key">{k}</kbd>)}
              </span>
              <span className="shortcuts__label">{label}</span>
            </li>
          ))}
        </ul>
        <button className="shortcuts__close" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}

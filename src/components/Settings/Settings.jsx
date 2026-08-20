import { GENERATIONS, POKEMON } from '../../data/pokemon';
import './Settings.css';

const COUNTS = Object.fromEntries(
  GENERATIONS.map((g) => [g.id, POKEMON.filter((p) => p.gen === g.id).length])
);

export function Settings({ enabledGens, onToggleGen, pool, onClose }) {
  return (
    <div className="settings__overlay" onClick={onClose}>
      <div className="settings__card" onClick={(e) => e.stopPropagation()}>
        <p className="settings__title">⚙ Settings</p>

        <p className="settings__section">Generations in the pool</p>
        <ul className="settings__list">
          {GENERATIONS.map((gen) => {
            const on = enabledGens.has(gen.id);
            const isLastOn = on && enabledGens.size === 1;
            return (
              <li key={gen.id} className="settings__row">
                <label
                  className={`settings__gen ${on ? 'settings__gen--on' : ''}`}
                  title={isLastOn ? 'At least one generation has to stay on' : undefined}
                >
                  <input
                    type="checkbox"
                    className="settings__checkbox"
                    checked={on}
                    disabled={isLastOn}
                    onChange={() => onToggleGen(gen.id)}
                  />
                  <span className="settings__gen-label">{gen.label}</span>
                  <span className="settings__gen-region">{gen.region}</span>
                  <span className="settings__gen-count">{COUNTS[gen.id]}</span>
                </label>
              </li>
            );
          })}
        </ul>

        <p className="settings__summary">
          <strong>{pool.length}</strong> Pokémon in the pool
        </p>

        <button className="settings__close" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}

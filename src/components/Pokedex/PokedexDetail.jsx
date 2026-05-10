import { useEffect } from 'react';
import { getArtworkUrl, getSpriteUrl, getCryUrl } from '../../data/pokemon';
import { getPronunciation } from '../../data/pronunciations';
import { usePokemonDetails } from '../../hooks/usePokemonDetails';
import { useSound } from '../../hooks/useSound';
import { TYPE_COLORS, TYPE_TEXT_COLORS } from '../../data/typeColors';
import './PokedexDetail.css';

const STAT_LABELS = {
  'hp': 'HP',
  'attack': 'Atk',
  'defense': 'Def',
  'special-attack': 'Sp.Atk',
  'special-defense': 'Sp.Def',
  'speed': 'Speed',
};

function TypeBadge({ type }) {
  const bg = TYPE_COLORS[type] ?? '#888';
  const color = TYPE_TEXT_COLORS[type] ?? 'white';
  return (
    <span className="pdex-detail__type-badge" style={{ background: bg, color }}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

function StatBar({ name, value, index }) {
  const pct = Math.round((value / 255) * 100);
  const label = STAT_LABELS[name] ?? name;
  const color = value < 50 ? '#e53e3e' : value < 80 ? '#dd6b20' : '#38a169';
  return (
    <div className="pdex-detail__stat">
      <span className="pdex-detail__stat-name">{label}</span>
      <div className="pdex-detail__stat-track">
        <div
          className="pdex-detail__stat-fill"
          style={{ '--stat-w': `${pct}%`, '--stat-i': index, background: color }}
        />
      </div>
      <span className="pdex-detail__stat-val">{value}</span>
    </div>
  );
}

export function PokedexDetail({ pokemon, onClose, pokemonList, onNavigate }) {
  const { details, loading } = usePokemonDetails(pokemon.id, true);
  const { play } = useSound();

  const currentIndex = pokemonList ? pokemonList.findIndex((p) => p.id === pokemon.id) : -1;
  const prevPokemon = currentIndex > 0 ? pokemonList[currentIndex - 1] : null;
  const nextPokemon = currentIndex < pokemonList.length - 1 ? pokemonList[currentIndex + 1] : null;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft'  && prevPokemon && onNavigate) onNavigate(prevPokemon);
      if (e.key === 'ArrowRight' && nextPokemon && onNavigate) onNavigate(nextPokemon);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, prevPokemon, nextPokemon, onNavigate]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const primaryType = details?.types?.[0];
  const headerBg = TYPE_COLORS[primaryType] ?? '#4A90D9';

  return (
    <div className="pdex-detail__overlay" onClick={onClose}>
      <div className="pdex-detail__modal" onClick={(e) => e.stopPropagation()}>
        <button className="pdex-detail__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {prevPokemon && onNavigate && (
          <button
            className="pdex-detail__nav pdex-detail__nav--prev"
            onClick={() => onNavigate(prevPokemon)}
            aria-label={`Previous: ${prevPokemon.name}`}
          >
            ‹
          </button>
        )}
        {nextPokemon && onNavigate && (
          <button
            className="pdex-detail__nav pdex-detail__nav--next"
            onClick={() => onNavigate(nextPokemon)}
            aria-label={`Next: ${nextPokemon.name}`}
          >
            ›
          </button>
        )}

        <div className="pdex-detail__scroll">
          <div
            className="pdex-detail__header"
            style={{ background: `linear-gradient(160deg, ${headerBg}30 0%, ${headerBg}08 100%)` }}
          >
            <span className="pdex-detail__id">#{String(pokemon.id).padStart(3, '0')}</span>
            <img
              src={getArtworkUrl(pokemon.id)}
              alt={pokemon.name}
              className="pdex-detail__artwork"
              onError={(e) => { e.currentTarget.src = getSpriteUrl(pokemon.id); }}
            />
          </div>

          <div className="pdex-detail__body">
            <h2 className="pdex-detail__name">{pokemon.name}</h2>

            <div className="pdex-detail__actions">
              <button
                className="pdex-detail__action-btn"
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  const utt = new SpeechSynthesisUtterance(getPronunciation(pokemon.name));
                  utt.lang = 'en-US';
                  const voices = window.speechSynthesis.getVoices();
                  utt.voice = voices.find(v => v.name === 'Samantha') || voices.find(v => v.lang === 'en-US') || null;
                  window.speechSynthesis?.speak(utt);
                }}
              >
                🔤 Speak Name
              </button>
              <button
                className="pdex-detail__action-btn"
                onClick={() => play(getCryUrl(pokemon.id))}
              >
                🔊 Play Cry
              </button>
            </div>

            {loading && !details && (
              <div className="pdex-detail__loading">
                <img src="/pokeball.svg" alt="" className="pdex-detail__pokeball" />
              </div>
            )}

            {details && (
              <>
                <div className="pdex-detail__types">
                  {details.types.map((t) => <TypeBadge key={t} type={t} />)}
                </div>

                <p className="pdex-detail__flavor">{details.flavorText}</p>

                <div className="pdex-detail__chips">
                  <div className="pdex-detail__chip">
                    <span className="pdex-detail__chip-label">Height</span>
                    <span className="pdex-detail__chip-val">{(details.height / 10).toFixed(1)} m</span>
                  </div>
                  <div className="pdex-detail__chip">
                    <span className="pdex-detail__chip-label">Weight</span>
                    <span className="pdex-detail__chip-val">{(details.weight / 10).toFixed(1)} kg</span>
                  </div>
                </div>

                <div className="pdex-detail__section">
                  <p className="pdex-detail__section-title">Base Stats</p>
                  {details.stats.map((s, i) => (
                    <StatBar key={s.name} name={s.name} value={s.value} index={i} />
                  ))}
                </div>

                {details.weaknesses.length > 0 && (
                  <div className="pdex-detail__section">
                    <p className="pdex-detail__section-title">Weak to</p>
                    <div className="pdex-detail__badges">
                      {details.weaknesses.map((t) => <TypeBadge key={t} type={t} />)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

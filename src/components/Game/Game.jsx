import { useState, useEffect, useCallback, useRef } from 'react';
import { getCryUrl } from '../../data/pokemon';
import { getPronunciation } from '../../data/pronunciations';
import { useSound } from '../../hooks/useSound';
import { usePokemonDetails } from '../../hooks/usePokemonDetails';
import { useHotkeys } from '../../hooks/useHotkeys';
import { shuffle } from '../../utils/shuffle';
import { PokemonCard } from './PokemonCard';
import { AnswerButton } from './AnswerButton';
import './Game.css';

const ARROW_STEPS = { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1 };

/* Keeps a fast double-press from blowing past the reveal and the cry. */
const ADVANCE_LOCKOUT_MS = 400;

function pickChoices(correct, allPokemon) {
  const wrong = shuffle(allPokemon.filter((p) => p.id !== correct.id)).slice(0, 2);
  return shuffle([correct, ...wrong]);
}

export function Game({ favorites, onToggleFavorite, pool, currentPokemon, onAdvance, onScoreUpdate, kidsMode, difficulty, active }) {
  const { play } = useSound();

  const [choices, setChoices] = useState(() => pickChoices(currentPokemon, pool));
  const [selectedId, setSelectedId] = useState(null);
  const [answerStatus, setAnswerStatus] = useState('unanswered');
  const [pendingId, setPendingId] = useState(null);
  const [streak, setStreak] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const answerRefs = useRef([]);
  const answeredAt = useRef(0);
  const resumeFocus = useRef(false);

  useEffect(() => {
    setChoices(pickChoices(currentPokemon, pool));
    setSelectedId(null);
    setAnswerStatus('unanswered');
    setPendingId(null);
    setFlipped(false);
    window.speechSynthesis?.cancel();
  }, [currentPokemon, pool]);

  useEffect(() => {
    if (!resumeFocus.current) return;
    resumeFocus.current = false;
    answerRefs.current[0]?.focus();
  }, [choices]);

  function submitAnswer(pokemon) {
    const isCorrect = pokemon.id === currentPokemon.id;
    answeredAt.current = Date.now();
    setSelectedId(pokemon.id);
    setAnswerStatus(isCorrect ? 'correct' : 'wrong');
    setStreak((prev) => (isCorrect ? prev + 1 : 0));
    onScoreUpdate((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    if (isCorrect) {
      play(getCryUrl(currentPokemon.id), 0.5);
    }
  }

  const handleAnswer = useCallback(
    (pokemon) => {
      if (answerStatus !== 'unanswered') return;

      if (kidsMode) {
        if (pendingId === pokemon.id) {
          setPendingId(null);
          window.speechSynthesis?.cancel();
          submitAnswer(pokemon);
        } else {
          window.speechSynthesis?.cancel();
          const utt = new SpeechSynthesisUtterance(getPronunciation(pokemon.name));
          utt.lang = 'en-US';
          const voices = window.speechSynthesis.getVoices();
          utt.voice = voices.find(v => v.name === 'Samantha') || voices.find(v => v.lang === 'en-US') || null;
          window.speechSynthesis?.speak(utt);
          setPendingId(pokemon.id);
        }
        return;
      }

      submitAnswer(pokemon);
    },
    [answerStatus, currentPokemon, onScoreUpdate, play, kidsMode, pendingId]
  );

  const answered = answerStatus !== 'unanswered';

  const handleKey = useCallback(
    (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Arrows move focus between the answers — Space/Enter then clicks natively.
      if (!answered && Object.hasOwn(ARROW_STEPS, e.key)) {
        e.preventDefault();
        const btns = answerRefs.current.filter(Boolean);
        if (btns.length === 0) return;
        const current = btns.indexOf(document.activeElement);
        const next = current === -1
          ? 0
          : (current + ARROW_STEPS[e.key] + btns.length) % btns.length;
        btns[next].focus();
        return;
      }

      if (e.key === 'Enter' || e.key === ' ') {
        // A focused button handles its own Enter/Space; don't double-fire.
        if (e.target instanceof HTMLElement && e.target.closest('button')) return;
        if (e.repeat) return;
        if (!answered) return;
        if (Date.now() - answeredAt.current < ADVANCE_LOCKOUT_MS) return;
        e.preventDefault();
        // Keyboard player — put them back on an answer for the next round.
        resumeFocus.current = true;
        onAdvance();
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'f' && answered) {
        setFlipped((f) => !f);
      } else if (key === 'h') {
        onToggleFavorite(currentPokemon.id);
      }
    },
    [answered, onAdvance, onToggleFavorite, currentPokemon]
  );

  useHotkeys(handleKey, active);

  const { details, loading: detailsLoading } = usePokemonDetails(currentPokemon.id, answered);

  function getButtonStatus(pokemon) {
    if (!answered) {
      if (kidsMode && pendingId === pokemon.id) return 'pending';
      return 'idle';
    }
    if (pokemon.id === currentPokemon.id) {
      return answerStatus === 'correct' ? 'correct' : 'reveal';
    }
    if (pokemon.id === selectedId) return 'wrong';
    if (answerStatus === 'wrong') return 'dimmed';
    return 'idle';
  }

  return (
    <div className="game">
      <div className="game__content">
        <p className="game__prompt">Who's that Pokémon?</p>

        <PokemonCard
          pokemon={currentPokemon}
          isFavorite={favorites.has(currentPokemon.id)}
          onToggleFavorite={onToggleFavorite}
          answered={answered}
          details={details}
          loading={detailsLoading}
          flipped={flipped}
          silhouette={difficulty === 'silhouette'}
          onToggleFlip={() => setFlipped((f) => !f)}
        />

        {streak >= 2 && (
          <div key={streak} className="game__streak">
            🔥 {streak} in a row!
          </div>
        )}

        {answered && (
          <p className={`game__feedback game__feedback--${answerStatus}`}>
            {answerStatus === 'correct'
              ? "🎉 Yes! That's right!"
              : `😢 Nope! It was ${currentPokemon.name}!`}
          </p>
        )}

        <div className="game__buttons">
          {choices.map((pokemon, i) => (
            <AnswerButton
              key={pokemon.id}
              ref={(el) => { answerRefs.current[i] = el; }}
              pokemon={pokemon}
              status={getButtonStatus(pokemon)}
              onClick={() => handleAnswer(pokemon)}
              disabled={answered}
            />
          ))}
        </div>

        {answered && (
          <button className="game__next-btn" onClick={onAdvance}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

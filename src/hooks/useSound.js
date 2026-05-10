export function useSound() {
  const play = (url, volume = 1) => {
    const audio = new Audio(url);
    audio.volume = volume;
    audio.play().catch(() => {});
  };
  return { play };
}

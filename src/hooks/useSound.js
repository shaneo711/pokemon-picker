export function useSound() {
  const play = (url) => {
    new Audio(url).play().catch(() => {});
  };
  return { play };
}

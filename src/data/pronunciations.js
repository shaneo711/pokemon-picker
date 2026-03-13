// Phonetic overrides for Pokémon names that TTS engines mispronounce.
// Values are plain strings the browser will naturally say correctly.
const PRONUNCIATIONS = {
  "Nidoran♀": "Nidoran female",
  "Nidoran♂": "Nidoran male",
  Pidgeot: "Pid jee oh",
  Pidgeotto: "Pijee oh toe",
  "Farfetch'd": "Far fetched",
  Dewgong: "Doo gong",
  Onix: "Oh nix",
  Exeggcute: "Ex egg cute",
  Exeggutor: "Ex egg uh tor",
  Cubone: "Cue bone",
  Rhyhorn: "Rye horn",
  Rhydon: "Rye don",
  Kangaskhan: "Kang gas con",
  Gyarados: "Jeer uh dose",
  Mewtwo: "Mew two",
  Moltres: "Mol trez",
  Zapdos: "Zap dose",
  Venonat: "Ven no nat",
  Seadra: "See dra",
  Grimer: "Grime er",
  Victreebel: "Vic tree bell",
  Tentacool: "Ten ta cool",
  Tentacruel: "Ten ta cruel",
  "Mr. Mime": "Mister mime",
  Magikarp: "Maji carp",
  Rattata: "Rat uh tuh",
  Marowak: "Mar oh wak",
};

export function getPronunciation(name) {
  return PRONUNCIATIONS[name] ?? name;
}

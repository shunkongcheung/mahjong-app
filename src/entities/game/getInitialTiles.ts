import {
  Character,
  Bamboo,
  Dot,
  Dragon,
  Wind,
  Flower,
  TileType,
} from "../../constants";

function shuffle<T>(array: Array<T>) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const getInitialTiles = (isRandom = true): Array<TileType> => {
  const gameSet = [
    Character.One,
    Character.Two,
    Character.Three,
    Character.Four,
    Character.Five,
    Character.Six,
    Character.Seven,
    Character.Eight,
    Character.Nine,
    Bamboo.One,
    Bamboo.Two,
    Bamboo.Three,
    Bamboo.Four,
    Bamboo.Five,
    Bamboo.Six,
    Bamboo.Seven,
    Bamboo.Eight,
    Bamboo.Nine,
    Dot.One,
    Dot.Two,
    Dot.Three,
    Dot.Four,
    Dot.Five,
    Dot.Six,
    Dot.Seven,
    Dot.Eight,
    Dot.Nine,
    Wind.East,
    Wind.South,
    Wind.West,
    Wind.North,
    Dragon.Red,
    Dragon.Green,
    Dragon.White,
  ];

  const set: Array<TileType> = [];
  gameSet.map((itm) => {
    for (let idx = 0; idx < 4; idx++) set.push(itm);
  });

  [
    Flower.Spring,
    Flower.Summer,
    Flower.Autumn,
    Flower.Winter,
    Flower.Plum,
    Flower.Orchid,
    Flower.Chrysanthemum,
    Flower.Bamboo,
  ].map((itm) => set.push(itm));

  return isRandom ? shuffle(set) : set;
};

export default getInitialTiles;

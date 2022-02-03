interface Feasibility {
  [x: string]: number;
}

const getBestBet = (feasibility: Feasibility): [string, number] => {
  const bestBet = Object.entries(feasibility).reduce(
    (acc, [key, value]) => {
      if (acc[1] < value) return [key, value];
      return acc;
    },
    ["", -1]
  );

  return bestBet;
};

export default getBestBet;

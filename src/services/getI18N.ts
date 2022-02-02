import * as constants from "../constants";

const getI18N = (value: constants.TileType) => {
  const mapping: { [x: string]: string } = {
    [constants.Wind.East]: "東",
    [constants.Wind.South]: "南",
    [constants.Wind.West]: "西",
    [constants.Wind.North]: "北",
    [constants.Dragon.Red]: "紅中",
    [constants.Dragon.Green]: "發財",
    [constants.Dragon.White]: "白板",
    [constants.Bamboo.One]: "一索",
    [constants.Bamboo.Two]: "二索",
    [constants.Bamboo.Three]: "三索",
    [constants.Bamboo.Four]: "四索",
    [constants.Bamboo.Five]: "五索",
    [constants.Bamboo.Six]: "六索",
    [constants.Bamboo.Seven]: "七索",
    [constants.Bamboo.Eight]: "八索",
    [constants.Bamboo.Nine]: "九索",
    [constants.Character.One]: "一筒",
    [constants.Character.Two]: "二筒",
    [constants.Character.Three]: "三筒",
    [constants.Character.Four]: "四筒",
    [constants.Character.Five]: "五筒",
    [constants.Character.Six]: "六筒",
    [constants.Character.Seven]: "七筒",
    [constants.Character.Eight]: "八筒",
    [constants.Character.Nine]: "九筒",
    [constants.Dot.One]: "一筒",
    [constants.Dot.Two]: "二筒",
    [constants.Dot.Three]: "三筒",
    [constants.Dot.Four]: "四筒",
    [constants.Dot.Five]: "五筒",
    [constants.Dot.Six]: "六筒",
    [constants.Dot.Seven]: "七筒",
    [constants.Dot.Eight]: "八筒",
    [constants.Dot.Nine]: "九筒",
  };

  return mapping[value] || "不明句子";
};

export default getI18N;

const randomIntFromInterval = (min: number, max: number) =>  { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}


export const assets = {
  finished: () => "assets/so_good.png",
  anotherOne: () => "assets/another_one.gif",
  moreClues: () => `assets/more${randomIntFromInterval(1,4)}.gif`,
  lessClues: () => `assets/less${randomIntFromInterval(1,4)}.gif`
}
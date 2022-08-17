import { trigger, style, animate, transition, keyframes, query, animateChild } from '@angular/animations';


const getRandomNumberBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) +min);

const x = getRandomNumberBetween(20, 80);
const y = getRandomNumberBetween(20, 40);

const bottom = getRandomNumberBetween(10, 20);
const left = getRandomNumberBetween(40, 60);

export const animation = trigger("animateBackground", [

  transition("no => yes", animate("3000ms ease-in", keyframes([
    style({
      bottom: `${bottom}%`,
      left: `${left}%`, 
      opacity: 0,
      zIndex: 1,
      offset: 0
    }),
    style({
      transform: `translate(-${x * 0.25}%, -${y * 0.25}%)`, 
      opacity: 0.4, 
      offset: 0.25
    }),
    style({
      transform: `translate(-${x * 0.5}%, -${y * 0.5}%)`, 
      opacity: 0.6, 
      offset: 0.5
    }),
    style({
      transform: `translate(-${x}%, -${y}%)`, 
      opacity: 0,
      zIndex: -1, 
      offset: 1
    }),
  ]))),

]);

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AnimationType } from '../types';
import { assets } from './animation-assets';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  
  public isAnimated = new BehaviorSubject<boolean>(false)

  constructor() { }

  public getImage = () => this.img.asObservable();
  
  public getState = () => this.isAnimated.asObservable();

  public animate (type: AnimationType) {
    const img = assets[type]();
    this.setImage(img);
    this.isAnimated.next(true);
    setTimeout(()=> this.isAnimated.next(false), 3000);
  }

  private img = new BehaviorSubject<{src:string, alt:string}>({src:"", alt:""})
  
  private setImage (str: string) {
    this.img.next({src: str, alt: str})
  }


}

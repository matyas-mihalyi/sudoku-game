import { Component, OnInit } from '@angular/core';
import { AnimationService } from '../services/animation.service';

import { animation } from './animations';

@Component({
  selector: 'app-animated-background-meme',
  templateUrl: './animated-background-meme.component.html',
  styleUrls: ['./animated-background-meme.component.sass'],
  animations: [animation]
})
export class AnimatedBackgroundMemeComponent implements OnInit {

  public imgSrc = "";

  public imgAlt = ""

  public isAnimated = false

  constructor(
    private animationService: AnimationService
  ) { }

  ngOnInit(): void {
    this.animationService.getImage().subscribe(img => {
      this.imgSrc = img.src;
      this.imgAlt = img.alt;
    });

    this.animationService.getState().subscribe(state => this.isAnimated = state);
  }

}

import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  public animate (img: string) {
    this.setImage(img);
    this.isAnimated = !this.isAnimated
    setTimeout(()=> this.isAnimated = !this.isAnimated, 3000)
  }

  private setImage (str: string) {
    this.imgSrc = str;
    this.imgAlt = str;
  }

}

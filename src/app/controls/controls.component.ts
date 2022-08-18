import { Component, OnInit } from '@angular/core';
import { AnimationService } from '../services/animation.service';
import { SudokuService } from '../services/sudoku.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.sass']
})
export class ControlsComponent implements OnInit {

  public sudokuIsSolved = false;

  public maxCluesReached = false;
  
  public minCluesReached = false;
  
  public moreClues = () => {
    this.sudokuIsSolved = false;
    this.gameService.createSudokuWithMoreClues();
  }

  public lessClues = () => {
    this.sudokuIsSolved = false;
    this.gameService.createSudokuWithLessClues();
  }

  public handleNewSudokuRequest():void {
    if (this.sudokuIsSolved) {
      this.generateNewSudoku();
    } else {
      this.confirmNewSudoku();
    }
  }

  constructor(
    private gameService: SudokuService,
    private animationService: AnimationService
  ) { }

  ngOnInit(): void {
    this.gameService.isValid.subscribe(validity => {
      this.sudokuIsSolved = validity;
    });

    
    this.gameService.lowerClueLimitReached.asObservable().subscribe(val => this.minCluesReached = val);
    this.gameService.upperClueLimitReached.asObservable().subscribe(val => this.maxCluesReached = val);
  }

  private confirmNewSudoku (): void {
    if(confirm("Are you sure? You haven't finished this one yet.")) {
      this.generateNewSudoku();
    }
  }
  
  private generateNewSudoku(): void {
    this.gameService.createNewSudoku();
    this.animationService.animate("anotherOne");
  }

}

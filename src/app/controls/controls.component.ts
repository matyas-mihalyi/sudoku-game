import { Component, OnInit } from '@angular/core';
import { AnimationService } from '../services/animation/animation.service';
import { ClueService } from '../services/clue/clue.service';
import { SudokuService } from '../services/sudoku/sudoku.service';

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
    private animationService: AnimationService,
    private clueService: ClueService
  ) { }

  ngOnInit(): void {
    this.gameService.validityObservable().subscribe(validity => {
      this.sudokuIsSolved = validity;
    });

    this.clueService.lowerLimitReachedObservable.subscribe(val => this.minCluesReached = val);
    this.clueService.upperLimitReachedObservable.subscribe(val => this.maxCluesReached = val);
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

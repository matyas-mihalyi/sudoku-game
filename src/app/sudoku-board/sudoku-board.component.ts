import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { AnimationService } from '../services/animation.service';
import { NavigationService } from '../services/navigation.service';
import { SudokuService } from '../services/sudoku.service';
import { CellIndices, Sudoku } from '../types';


@Component({
  selector: 'app-sudoku-board',
  templateUrl: './sudoku-board.component.html',
  styleUrls: ['./sudoku-board.component.sass']
})
export class SudokuBoardComponent implements OnInit {

  public sudoku: Sudoku = this.gameService.startingSudoku;

  public sudokuIsSolved = false;

  public maxCluesReached = false;
  
  public minCluesReached = false;

  @ViewChildren("cell")
  set cells(value: QueryList<any>) {
    setTimeout(()=> this.navigationService.cells = value)
  }
  
  public handleNavigation = (e: KeyboardEvent) => this.navigationService.handleNavigation(e); 

  public updateFocusedCell = (newIndices: CellIndices) => this.navigationService.updateFocusedCell(newIndices);
  
  public moreClues = () => {
    this.sudokuIsSolved = false;
    this.gameService.createSudokuWithMoreClues();
    this.sudoku = this.gameService.startingSudoku;
  }

  public lessClues = () => {
    this.sudokuIsSolved = false;
    this.gameService.createSudokuWithLessClues();
    this.sudoku = this.gameService.startingSudoku;
  }

  public handleNewSudokuRequest():void {
    if (this.sudokuIsSolved) {
      this.generateNewSudoku();
    } else {
      this.confirmNewSudoku();
    }
  }

  constructor(
    private gameService : SudokuService,
    private animationService: AnimationService,
    private navigationService: NavigationService
  ) { 
  }
  
  ngOnInit(): void {
    this.gameService.startingSudokuObservable().subscribe(startingSudoku => {
      this.sudoku = startingSudoku;
    })

    this.gameService.isValid.subscribe(validity => {
      this.sudokuIsSolved = validity;
      if (validity) {
        this.handleSudokuCompletion();
      }
    });
    
    this.gameService.lowerClueLimitReached.asObservable().subscribe(val => this.minCluesReached = val);
    this.gameService.upperClueLimitReached.asObservable().subscribe(val => this.maxCluesReached = val);
  }
  
  
  private handleSudokuCompletion () {
    this.disableInput();
    this.animationService.animate("finished");
  }

  private disableInput(): void {
    this.navigationService.cells.toArray().forEach(cell => cell.disableCell());
  }

  private confirmNewSudoku (): void {
    if(confirm("Are you sure? You haven't finished this one yet.")) {
      this.generateNewSudoku();
    }
  }

  private generateNewSudoku(): void {
    this.sudokuIsSolved = false;
    this.gameService.createNewSudoku();
    this.sudoku = this.gameService.startingSudoku;
    this.animationService.animate("anotherOne");
  }

  
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { generateSudoku, validateSudoku } from 'sudoku-logic';
import { AnimationService } from './animation.service';
import { AnimationType, Sudoku } from './types';

@Injectable({
  providedIn: 'root'
})

export class SudokuService {

  private numberOfCellsToRemove = 2;

  private maxNumberOfCellsToRemove = 64;

  private minNumberOfCellsToRemove = 1;

  public upperClueLimitReached = new BehaviorSubject<boolean>(false);
  
  public lowerClueLimitReached = new BehaviorSubject<boolean>(false);;

  public startingSudoku = generateSudoku(this.numberOfCellsToRemove);

  public sudoku = new BehaviorSubject<Sudoku>(JSON.parse(JSON.stringify(this.startingSudoku)));

  public isValid = new BehaviorSubject<boolean>(false);

  constructor(
    private animationService: AnimationService
  ) {
    this.sudoku.asObservable().subscribe(this.observer)
  }

  public updateCell = (row: number, col: number, inputValue: string) => {
    const updatedSudoku = this.sudoku.value;
    const value = this.convertInputValue(inputValue)
    updatedSudoku[row][col] = value;    

    this.sudoku.next(updatedSudoku);
  }

  private convertInputValue = (input: string): (number | undefined) => {
    return input === "" ?
      undefined
      :
      Number(input)
  }

  private observer = {
    next: ( sudoku: Sudoku ) => {
      if (this.sudokuIsFilled(sudoku) && this.checkSudokuValidity(sudoku)) {
        this.isValid.next(true)
      }
    }
  }

  private sudokuIsFilled = (sudoku: Sudoku) => sudoku.flat().filter(cell => cell == (undefined || null)).length === 0;

  private checkSudokuValidity = (sudoku: Sudoku) => validateSudoku(sudoku);

  public createNewSudoku () {
    this.startingSudoku = generateSudoku(this.numberOfCellsToRemove);
    this.sudoku.next(JSON.parse(JSON.stringify(this.startingSudoku)))
  }
  
  private removeLessCells () {
    if (this.numberOfCellsToRemove > this.minNumberOfCellsToRemove) {
      this.numberOfCellsToRemove = this.numberOfCellsToRemove - 1;
      this.lowerClueLimitReached.next(false);
    } 
    if (this.numberOfCellsToRemove === this.minNumberOfCellsToRemove) {
      this.upperClueLimitReached.next(true);
    }
  }
  
  private removeMoreCells () {
    if (this.numberOfCellsToRemove < this.maxNumberOfCellsToRemove) {
      this.numberOfCellsToRemove = this.numberOfCellsToRemove + 1;
      this.upperClueLimitReached.next(false);
    } 
    if (this.numberOfCellsToRemove === this.maxNumberOfCellsToRemove) {
      this.lowerClueLimitReached.next(true);
    }
  }

  private animate = (str: AnimationType) => {
    if (this.numberOfCellsToRemove % 5 === 0) {
      this.animationService.animate(str);
    }
  }

  public createSudokuWithMoreClues () {
    this.removeLessCells();
    this.animate("moreClues");
    this.createNewSudoku();
  }
  
  public createSudokuWithLessClues () {
    this.removeMoreCells();
    this.animate("lessClues");
    this.createNewSudoku();
  }

}

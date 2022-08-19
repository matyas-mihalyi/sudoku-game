import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { generateSudoku, validateSudoku } from 'sudoku-logic';
import { AnimationService } from './animation.service';
import { LocalStorageService } from './local-storage/local-storage.service';
import { AnimationType, Sudoku } from '../types';

@Injectable({
  providedIn: 'root'
})

export class SudokuService {

  public numberOfCellsToRemove = 31;
  
  public upperClueLimitReached = new BehaviorSubject<boolean>(false);
  
  public lowerClueLimitReached = new BehaviorSubject<boolean>(false);
  
  public isValid = new BehaviorSubject<boolean>(false);
  
  public startingSudokuObservable = () => this.startinSudokuSubject.asObservable();
  
  public sudokuObservable = () => this.sudoku.asObservable();
  
  public updateCell = (row: number, col: number, inputValue: string) => {
    const updatedSudoku = this.sudoku.value;
    const value = this.convertInputValue(inputValue)
    updatedSudoku[row][col] = value;    
    
    this.sudoku.next(updatedSudoku);
    this.localStorageService.setData("currentSudoku", updatedSudoku);
  }

  public initSudoku = () => {
    if (this.localStorageService.sudokuDataAvailable()) {
      console.log("Data found")
      this.startingSudoku = this.localStorageService.startingSudoku$.value;
      this.startinSudokuSubject.next(this.localStorageService.startingSudoku$.value);
      this.sudoku.next(this.localStorageService.currentSudoku$.value);
    } else {
      console.log("Some data is missing")
      this.createNewSudoku();
    }
    this.numberOfCellsToRemove = this.localStorageService.numberOfCellsToRemove$.value || this.numberOfCellsToRemove;
  }
  
  constructor(
    private animationService: AnimationService,
    private localStorageService: LocalStorageService
    ) {
      this.sudoku.asObservable().subscribe(this.validityObserver);
  }
  
  private startingSudoku = generateSudoku(this.numberOfCellsToRemove);

  private sudoku = new BehaviorSubject<Sudoku>(JSON.parse(JSON.stringify(this.startingSudoku)));

  private startinSudokuSubject = new BehaviorSubject<Sudoku>(this.startingSudoku);
  
  private maxNumberOfCellsToRemove = 64;
  
  private minNumberOfCellsToRemove = 1;
  
  private validityObserver = {
    next: ( sudoku: Sudoku ) => {
      if (this.sudokuIsFilled(sudoku) && this.checkSudokuValidity(sudoku)) {
        this.handleValidSudoku();
      }
    }
  }
  
  private convertInputValue = (input: string): (number | undefined) => {
    return input === "" ?
    undefined
    :
    Number(input)
  }
  
  private sudokuIsFilled = (sudoku: Sudoku) => sudoku.flat().filter(cell => cell == (undefined || null)).length === 0;
  
  private checkSudokuValidity = (sudoku: Sudoku) => validateSudoku(sudoku);
  
  private handleValidSudoku = () => {
    this.localStorageService.clearData("currentSudoku");
    this.localStorageService.clearData("startingSudoku");
    this.isValid.next(true);
  }

  public createNewSudoku () {
    this.startingSudoku = generateSudoku(this.numberOfCellsToRemove);
    this.startinSudokuSubject.next(this.startingSudoku);
    this.sudoku.next(JSON.parse(JSON.stringify(this.startingSudoku)));
    this.localStorageService.setData("startingSudoku", this.startingSudoku);
    this.localStorageService.setData("currentSudoku", this.startingSudoku);
    this.localStorageService.setData("numberOfCellsToRemove", this.numberOfCellsToRemove);
    this.isValid.next(false)
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

import { Injectable, QueryList } from '@angular/core';
import { SudokuService } from './sudoku.service';
import { ArrayOf9Elements, CellIndices, Direction } from '../types';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private sudoku = this.gameService.sudoku.value;

  public cells!: QueryList<any>

  private focusedCellIndices: CellIndices = { row: -1, column: -1 };

  constructor(
    private gameService: SudokuService
  ) { }

  public handleNavigation = (e: KeyboardEvent) => {
    if (this.isArrowKey(e)) {
      this.focusNextCell(e, this.focusedCellIndices.row, this.focusedCellIndices.column)
    }
  }

  isArrowKey (e: KeyboardEvent) {
    const arrowKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"]
    return arrowKeys.some(key => e.key === key);  
  }

  updateFocusedCell (newIndices: CellIndices) {
    this.focusedCellIndices = newIndices;
  }

  blurCurrentCell () {
    const index = this.focusedCellIndices.row * this.focusedCellIndices.column;
    this.cells.toArray()[index].removeFocus();
  }

  focusNextCell (event: KeyboardEvent , currentRow:number, currentCol:number) {
    const nextCellIndex = this.findNextCellIndex[event.key as Direction](currentRow, currentCol);
    const nextCell = this.cells.toArray()[nextCellIndex];
    nextCell.applyFocus();
  }

  findNextCellIndex = {
    "ArrowUp": (currentRow:number, currentCol:number) => this.findCellIndexUp(currentRow, currentCol),
    "ArrowRight": (currentRow:number, currentCol:number) => this.findCellIndexRight(currentRow, currentCol),
    "ArrowDown": (currentRow:number, currentCol:number) => this.findCellIndexDown(currentRow, currentCol),
    "ArrowLeft": (currentRow:number, currentCol:number) => this.findCellIndexLeft(currentRow, currentCol),
  }

  findCellIndexRight (currentRow: number, currentCol: number): number {
    const nextIndexInRow = this.getNextAvailableIndex(this.sudoku[currentRow], currentCol);
    const nextIndexInSudoku = nextIndexInRow + (currentRow * 9);
    return nextIndexInSudoku; 
  }
  
  findCellIndexLeft (currentRow: number, currentCol: number): number {
    const previousIndexInRow = this.getPreviousAvailableIndex(this.sudoku[currentRow], currentCol);
    const previousIndexInSudoku = previousIndexInRow + (currentRow * 9);
    return previousIndexInSudoku; 
  }
  
  findCellIndexDown (currentRow: number, currentCol: number): number {
    const column = this.getColumnFromSudoku(currentCol);
    const nextIndexInColumn = this.getNextAvailableIndex(column, currentRow);
    const nextIndexInSudoku = nextIndexInColumn * 9 + currentCol;
    return nextIndexInSudoku; 
  } 

  findCellIndexUp (currentRow: number, currentCol: number): number {
    const column = this.getColumnFromSudoku(currentCol);
    const previousIndexInColumn = this.getPreviousAvailableIndex(column, currentRow);
    const previousIndexInSudoku = previousIndexInColumn * 9 + currentCol;
    return previousIndexInSudoku; 
  } 

  getNextAvailableIndex = (arr: ArrayOf9Elements<number|undefined>, currentIndex: number): number => {
    return currentIndex + 1 < arr.length ?
    currentIndex + 1
    :
    0
  }
    
  getPreviousAvailableIndex = (arr: ArrayOf9Elements<number|undefined>, currentIndex: number): number => {
    return currentIndex - 1 >= 0 ?
    currentIndex - 1
    :
    arr.length - 1
  }
  
  getColumnFromSudoku = (columnIndex: number) => {
    return this.sudoku.map(row => row[columnIndex]) as ArrayOf9Elements<number|undefined>;
  }

}

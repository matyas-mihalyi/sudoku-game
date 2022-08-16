import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SudokuService } from '../sudoku.service';
import { ArrayOf9Elements, CellIndices, Direction, Sudoku } from '../types';

@Component({
  selector: 'app-sudoku-board',
  templateUrl: './sudoku-board.component.html',
  styleUrls: ['./sudoku-board.component.sass']
})
export class SudokuBoardComponent implements OnInit {

  public sudoku = this.gameService.startingSudoku;

  private focusedCellIndices: CellIndices = { row: -1, column: -1 }

  @ViewChildren("cell") cells!: QueryList<any>

  constructor(
    private gameService : SudokuService
  ) { 
  }
  
  ngOnInit(): void {
  }

  handleNavigation = (e: KeyboardEvent) => {
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
    const availableIndicesInRow = this.getAvailableIndices(this.sudoku[currentRow]);
    const nextIndexInRow = this.getNextAvailableIndex(availableIndicesInRow, currentCol);
    const nextIndexInSudoku = nextIndexInRow + (currentRow * 9);
    return nextIndexInSudoku; 
  }
  
  findCellIndexLeft (currentRow: number, currentCol: number): number {
    const availableIndicesInRow = this.getAvailableIndices(this.sudoku[currentRow]);
    const previousIndexInRow = this.getPreviousAvailableIndex(availableIndicesInRow, currentCol);
    const previousIndexInSudoku = previousIndexInRow + (currentRow * 9);
    return previousIndexInSudoku; 
  }
  
  findCellIndexDown (currentRow: number, currentCol: number): number {
    const column = this.getColumnFromSudoku(currentCol);
    const availableIndicesInColumn = this.getAvailableIndices(column);
    const nextIndexInColumn = this.getNextAvailableIndex(availableIndicesInColumn, currentRow);
    const nextIndexInSudoku = nextIndexInColumn * 9 + currentCol;
    return nextIndexInSudoku; 
  } 

  findCellIndexUp (currentRow: number, currentCol: number): number {
    const column = this.getColumnFromSudoku(currentCol);
    const availableIndicesInColumn = this.getAvailableIndices(column);
    const previousIndexInColumn = this.getPreviousAvailableIndex(availableIndicesInColumn, currentRow);
    const previousIndexInSudoku = previousIndexInColumn * 9 + currentCol;
    return previousIndexInSudoku; 
  } 
  
  getAvailableIndices(arr: ArrayOf9Elements<number|undefined>): number[] {
    return arr.reduce((acc: number[], current, i) => {
      if (current === undefined) {
        acc.push(i);
      }
      return acc
    }, []);
  }

  getNextAvailableIndex = (arr: number[], currentIndex: number): number => {
    const nextElementInArray = arr.find(index => index > currentIndex) || arr[0];
    return nextElementInArray;
  }
    
  getPreviousAvailableIndex = (arr: number[], currentIndex: number): number => {
    const previousIndexInArray = arr.indexOf(currentIndex) - 1 >= 0 ? arr.indexOf(currentIndex) - 1 : arr.length -1;
    const previousElementInArray = arr[previousIndexInArray]; 
    return previousElementInArray;
  }
  
  getColumnFromSudoku = (columnIndex: number) => {
    return this.sudoku.map(row => row[columnIndex]) as ArrayOf9Elements<number|undefined>;
  }

}

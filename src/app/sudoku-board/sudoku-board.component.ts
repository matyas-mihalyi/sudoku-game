import { Component, OnInit } from '@angular/core';
import { SudokuService } from '../sudoku.service';
import { Sudoku } from '../types';

@Component({
  selector: 'app-sudoku-board',
  templateUrl: './sudoku-board.component.html',
  styleUrls: ['./sudoku-board.component.sass']
})
export class SudokuBoardComponent implements OnInit {

  public sudoku: any;

  constructor(
    private sudokuService : SudokuService
  ) { }

  ngOnInit(): void {
    this.sudokuService.getSudoku().subscribe(sudoku => this.sudoku = sudoku)
    console.log(this.sudoku)
  }

}

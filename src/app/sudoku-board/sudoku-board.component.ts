import { Component, OnInit } from '@angular/core';
import { SudokuService } from '../sudoku.service';

@Component({
  selector: 'app-sudoku-board',
  templateUrl: './sudoku-board.component.html',
  styleUrls: ['./sudoku-board.component.sass']
})
export class SudokuBoardComponent implements OnInit {

  public sudoku = this.gameService.startingSudoku;

  constructor(
    private gameService : SudokuService
  ) { 
  }
  
  ngOnInit(): void {
  }

}

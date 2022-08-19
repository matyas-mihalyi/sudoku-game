import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { AnimationService } from '../services/animation/animation.service';
import { NavigationService } from '../services/navigation/navigation.service';
import { SudokuService } from '../services/sudoku/sudoku.service';
import { CellIndices, Sudoku } from '../types';


@Component({
  selector: 'app-sudoku-board',
  templateUrl: './sudoku-board.component.html',
  styleUrls: ['./sudoku-board.component.sass']
})
export class SudokuBoardComponent implements OnInit {

  public sudoku!: Sudoku;

  @ViewChildren("cell")
  set cells(value: QueryList<any>) {
    setTimeout(()=> this.navigationService.cells = value)
  }
  
  public handleNavigation = (e: KeyboardEvent) => this.navigationService.handleNavigation(e); 

  public updateFocusedCell = (newIndices: CellIndices) => this.navigationService.updateFocusedCell(newIndices);

  constructor(
    private gameService : SudokuService,
    private animationService: AnimationService,
    private navigationService: NavigationService,
    ) { 
  }
  
  ngOnInit(): void {
    this.gameService.initSudoku();

    this.gameService.startingSudokuObservable().subscribe(startingSudoku => {
      this.sudoku = startingSudoku;
    });

    this.gameService.isValid.subscribe(validity => {
      if (validity) {
       this.handleSudokuCompletion();
      }
    });

  }
  
  private handleSudokuCompletion () {
    this.disableInput();
    this.animationService.animate("finished");
  }

  private disableInput(): void {
    this.navigationService.cells.toArray().forEach(cell => cell.disableCell());
  }
  
}

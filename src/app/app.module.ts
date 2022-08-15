import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SudokuBoardComponent } from './sudoku-board/sudoku-board.component';
import { SudokuCellComponent } from './sudoku-cell/sudoku-cell.component';

@NgModule({
  declarations: [
    AppComponent,
    SudokuBoardComponent,
    SudokuCellComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

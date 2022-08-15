import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

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
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

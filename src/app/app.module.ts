import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SudokuBoardComponent } from './sudoku-board/sudoku-board.component';
import { SudokuCellComponent } from './sudoku-cell/sudoku-cell.component';
import { AnimatedBackgroundMemeComponent } from './animated-background-meme/animated-background-meme.component';
import { ControlsComponent } from './controls/controls.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    SudokuBoardComponent,
    SudokuCellComponent,
    AnimatedBackgroundMemeComponent,
    ControlsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('./ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

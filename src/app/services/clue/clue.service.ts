import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ClueService {
  
  private numberOfCellsToRemove = new BehaviorSubject<number>(31);
  
  private upperLimitReached = new BehaviorSubject<boolean>(false);
  
  private lowerLimitReached = new BehaviorSubject<boolean>(false);
  
  public upperLimitReachedObservable = this.upperLimitReached.asObservable();
  
  public lowerLimitReachedObservable = this.lowerLimitReached.asObservable();

  public cellsToRemoveObservable = this.numberOfCellsToRemove.asObservable();
  
  constructor(
    private localStorageService: LocalStorageService
    ) {
      this.setCellsToRemoveFromLocalStorage();
      this.cellsToRemoveObservable.subscribe(this.limitObserver)
  }
  
  public removeLessCells () {
    this.decrementCellsToRemove();
    this.setDataInLocalStorage();
  }
  
  public removeMoreCells () {
    this.incrementCellsToRemove();
    this.setDataInLocalStorage();
  }
    
  private maxNumberOfCellsToRemove = 64;
  
  private minNumberOfCellsToRemove = 1;

  private limitObserver = {
    next: (newClueNumber: number) => {
      this.checkUpperLimit(newClueNumber);
      this.checkLowerLimit(newClueNumber);
    },
    error: (e: Error) => console.error(e)
  }

  private setCellsToRemoveFromLocalStorage () {
    this.localStorageService.loadData("numberOfCellsToRemove");
    const cellsToRemove = this.localStorageService.getNumberOfCellsToRemove()
    if (cellsToRemove) {
      this.numberOfCellsToRemove.next(cellsToRemove);
    }
  }

  private decrementCellsToRemove () {
    if (this.upperLimitReached.value === false) {
      this.numberOfCellsToRemove.next(this.numberOfCellsToRemove.value - 1);
      this.lowerLimitReached.next(false);
    } 
  }

  private incrementCellsToRemove () {
    if (this.lowerLimitReached.value === false) {
      this.numberOfCellsToRemove.next(this.numberOfCellsToRemove.value + 1);
      this.upperLimitReached.next(false);
    } 
  }

  private checkUpperLimit (newClueNumber: number) {
    if (newClueNumber === this.minNumberOfCellsToRemove) {
      this.upperLimitReached.next(true);
    }
  }

  private checkLowerLimit (newClueNumber: number) {
    if (newClueNumber === this.maxNumberOfCellsToRemove) {
      this.lowerLimitReached.next(true);
    }
  }

  private setDataInLocalStorage () {
    this.localStorageService.setData('numberOfCellsToRemove', this.numberOfCellsToRemove.value);
  }

}

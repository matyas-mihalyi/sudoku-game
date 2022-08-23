import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { LocalStorageRefService } from './local-storage-ref.service';
import { Sudoku, StorageKey } from '../../types';


@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  
  private _localStorage: Storage;

  public numberOfCellsToRemove$ = new BehaviorSubject<any>(null);
  public startingSudoku$ = new BehaviorSubject<any>(null);
  public currentSudoku$ = new BehaviorSubject<any>(null);

  private storageKeys: Array<StorageKey> = ["numberOfCellsToRemove", "startingSudoku", "currentSudoku"];

  public numberOfCellsToRemove = this.numberOfCellsToRemove$.asObservable();
  public startingSudoku = this.startingSudoku$.asObservable();
  public currentSudoku = this.currentSudoku$.asObservable();

  constructor(
      private _localStorageRefService: LocalStorageRefService
    ) {
    this._localStorage = this._localStorageRefService.localStorage
  }

  setData(key: StorageKey, data: Sudoku|number) {
    const jsonData = JSON.stringify(data);
    this._localStorage.setItem(key, jsonData);
    this[`${key}$`].next(data);
    // console.log(`set data for ${key}`, this[`${key}$`].value)
  }
  
  loadData(key: StorageKey) {
    const jsonData = this._localStorage.getItem(key)
    const data = jsonData ? JSON.parse(jsonData) : null;
    this[`${key}$`].next(data);
  }
  
  clearData(key: StorageKey) {
    this._localStorage.setItem(key, "");
    this[`${key}$`].next(null);
    // console.log(`cleared ${key}`, this[`${key}$`].value)
  }

 sudokuDataAvailable = ():boolean => {
    this.loadAllData();
    if (this.currentSudoku$.value === null || this.startingSudoku$.value === null) {
      // console.log("No saved sudoku is available from localStorage")
      return false
    } else {
      // console.log("Sudoku data is available from localStorage", this.currentSudoku$.value, this.startingSudoku$.value)
      return true
    }
  }
  
  private loadAllData () {
    // console.log("Loaded all data")
    for (let key of this.storageKeys) {
      this.loadData(key as StorageKey);
    }
  }

}
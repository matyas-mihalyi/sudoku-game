import { Injectable } from '@angular/core';

import { LocalStorageRefService } from './local-storage-ref.service';
import { Sudoku, StorageKey } from '../../types';


@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  
  private _localStorage: Storage;

  private numberOfCellsToRemove: null | number = null;
  private startingSudoku: null | Sudoku = null;
  private currentSudoku: null | Sudoku = null;
  
  public getNumberOfCellsToRemove = () =>  this.numberOfCellsToRemove;
  public getStartingSudoku = () =>  this.startingSudoku;
  public getCurrentSudoku = () =>  this.currentSudoku;
  
  public setData(key: StorageKey, data: Sudoku|number) {
    const jsonData = JSON.stringify(data);
    this._localStorage.setItem(key, jsonData);
    this[key] = data as Sudoku & number;
  }
  
  public loadData(key: StorageKey) {
    const jsonData = this._localStorage.getItem(key)
    const data = jsonData ? JSON.parse(jsonData) : null;
    this[key] = data;
  }
  
  public clearData(key: StorageKey) {
    this._localStorage.setItem(key, "");
    this[key] = null;
  }
  
  public sudokuDataIsAvailable = ():boolean => {
    this.loadAllData();
    if (this.currentSudoku === null || this.startingSudoku === null) {
      return false
    } else {
      return true
    }
  }
  
  constructor(
    private _localStorageRefService: LocalStorageRefService
    ) {
      this._localStorage = this._localStorageRefService.localStorage
  }
    

  private storageKeys: Array<StorageKey> = ["numberOfCellsToRemove", "startingSudoku", "currentSudoku"];
    
  private loadAllData () {
    for (let key of this.storageKeys) {
      this.loadData(key as StorageKey);
    }
  }

}
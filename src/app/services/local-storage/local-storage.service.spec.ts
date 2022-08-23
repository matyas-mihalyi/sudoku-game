import { LocalStorageService } from './local-storage.service';

import { StorageKey, ArrayOf9Elements, Sudoku } from '../../types';
import { incompleteSudoku } from '../../global-mocks';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  let _localStorageRefService: any;

  beforeEach(() => {
    _localStorageRefService = {
      localStorage: localStorage,
    }

    service = new LocalStorageService(_localStorageRefService);
  });

  describe('Service methods', () => {

    describe('setData', () => {
      let key: StorageKey;
      let data: Sudoku;

      beforeEach(() => {
        localStorage.clear();

        data = incompleteSudoku;
        key = "currentSudoku";
  
        service.setData(key, data);
      })
      
      it('should set the given data under the provided key in localStorage', () => {
        const dataInLocalStorage = JSON.parse(localStorage.getItem(key)!);
        
        expect(dataInLocalStorage).toStrictEqual(data)
      });
      
      it('should set the given data to its BehaviourSubject', () => {
        expect(service[`${key}$`].value).toStrictEqual(data);
      });
      
    });

    describe('loadData', () => {
      
      it('should load the data with the given key to its BehaviourSubject', () => {
        const data = incompleteSudoku;
        const key = "startingSudoku";
        
        localStorage.setItem(key, JSON.stringify(data));
        service.loadData(key);
        
        expect(service[`${key}$`].value).toStrictEqual(data);
      });

    });
    
    describe('clearData', () => {
      let data: number;
      let key: StorageKey;
      
      beforeEach(() => {
        localStorage.clear();

        data = 12;
        key = "numberOfCellsToRemove";

        localStorage.setItem(key, JSON.stringify(data));
      });

      it('should clear the data with the given key from localStorage', () => {
        service.clearData(key);
        
        const dataInLocalStorage = localStorage.getItem(key);

        expect(dataInLocalStorage).toBe("");
      });

      it('should clear the data with the given key from its BehaviourSubject', () => {
        service.clearData(key);
        
        expect(service[`${key}$`].value).toBe(null);
      });

    });

    describe('sudokuDataAvailable', () => {
      let data: any;
      let storageKeys: StorageKey[];

      beforeEach(() => {
        localStorage.clear();

        data = {
          currentSudoku: incompleteSudoku,
          startingSudoku: incompleteSudoku,
          numberOfCellsToRemove: 31
        };
        storageKeys = ["currentSudoku", "startingSudoku", "numberOfCellsToRemove"];
      });
      
      it('should load all data from localStorage', () => {
        
        for (let key of storageKeys) {
          localStorage.setItem(key, JSON.stringify(data[key]));
        }
        
        service.sudokuDataAvailable();
        
        for (let key of storageKeys) {
          expect(service[`${key}$`].value).toStrictEqual(data[key]);
        }
      });
      
      it('should return "true" if "currentSudoku" and "startingSudoku" are available in localStorage', () => {
        
        for (let key of storageKeys) {
          localStorage.setItem(key, JSON.stringify(data[key]));
        }
        
        expect(service.sudokuDataAvailable()).toBeTruthy();
      });

      it('should return "false" if "currentSudoku" is missing from localStorage', () => {
        localStorage.setItem("startingSudoku", JSON.stringify(data.startingSudoku));
        console.log(localStorage.getItem("currentSudoku"))

        expect(service.sudokuDataAvailable()).toBeFalsy();
      });

      it('should return "false" if "startingSudoku" is missing from localStorage', () => {
        localStorage.setItem("currentSudoku", JSON.stringify(data.currentSudoku));
      
        expect(service.sudokuDataAvailable()).toBeFalsy();
      });
    
    });

  });

});

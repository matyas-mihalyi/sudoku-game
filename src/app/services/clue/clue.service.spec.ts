import { ClueService } from './clue.service';

describe('ClueService', () => {
  let service: ClueService;

  let localStorageServiceMock: any;

  let numberOfCellsToRemoveMock: any;
  beforeEach(() => {
    numberOfCellsToRemoveMock = 40;

    localStorageServiceMock = {
      loadData: jest.fn(),
      setData: jest.fn(),
      getNumberOfCellsToRemove: jest.fn().mockReturnValue(numberOfCellsToRemoveMock)
    }

    service = new ClueService(localStorageServiceMock);
  });

  describe('Service setup', () => {
    
    describe('constructor', () => {
    
      it('should load data from localStorage via "localStorageService.loadData"', () => {
        const loadData = jest.spyOn(localStorageServiceMock, "loadData");

        expect(loadData).toBeCalledWith("numberOfCellsToRemove");
      });
      
      it('should assign value to "numberOfCellsToRemove" from localStorage if data is found', ()=> {
        const valueInLocalStorage = localStorageServiceMock.getNumberOfCellsToRemove();
        let valueInService: any;

        service = new ClueService(localStorageServiceMock);
        service.cellsToRemoveObservable.subscribe(num => valueInService = num);
        
        expect(valueInService).toBe(valueInLocalStorage);
        
      });

      it('should not assign value to "numberOfCellsToRemove" from localStorage if data is "null" in it', ()=> {
        localStorageServiceMock.getNumberOfCellsToRemove = jest.fn().mockReturnValue(null);
        const valueInLocalStorage = localStorageServiceMock.getNumberOfCellsToRemove();
        let valueInService: any;

        service = new ClueService(localStorageServiceMock);
        service.cellsToRemoveObservable.subscribe(num => valueInService = num);
        
        expect(valueInService).not.toBe(valueInLocalStorage);
        
      });
    
    });
 
  });

  describe('Service methods', () => {
    
    describe('removeLessCells', () => {

      it('should decrement the current number of cells to remove by 1', ()=> {
        let value: any;
        service.cellsToRemoveObservable.subscribe(val => value = val);
        const oldValue = value;
        const expected = oldValue -1;
        service.removeLessCells();
        
        expect(value).toBe(expected);
      });
      
      it('should set "upperClueLimitReached" to "true" if "numberOfCellsToRemove" equals the minimum clues to remove', () => {
        let limitReached = false;
        service.upperLimitReachedObservable.subscribe(val => limitReached = val);

        for (let i = 0; i < 50; i++) {
          service.removeLessCells();
        }
        
        expect(limitReached).toBeTruthy();
      });
      
      it('should not set "numberOfCellsToRemove" lower than the limit', () => {
        let value: any;
        service.cellsToRemoveObservable.subscribe(val => value = val);
  
        for (let i = 0; i < 50; i++) {
          service.removeLessCells();
        }
        
        expect(value).toBe(1);
      });
      
      it('should set the value of "numberOfCellsToRemove" in localStorage via "localStorageService.setData()"', () => {
        const setData = jest.spyOn(localStorageServiceMock, "setData");
        
        service.removeLessCells();

        expect(setData).toBeCalled();
      });

    });

    describe('removeMoreCells', () => {

      it('should decrement the current number of cells to remove by 1', ()=> {
        let value: any;
        service.cellsToRemoveObservable.subscribe(val => value = val);
        const oldValue = value;
        const expected = oldValue +1;
        service.removeMoreCells();
        
        expect(value).toBe(expected);
      });
      
      it('should set "lowerLimitReached" to "true" if "numberOfCellsToRemove" equals the minimum clues to remove', () => {
        let limitReached = false;
        service.lowerLimitReachedObservable.subscribe(val => limitReached = val);

        for (let i = 0; i < 50; i++) {
          service.removeMoreCells();
        }
        
        expect(limitReached).toBeTruthy();
      });
      
      it('should not set "numberOfCellsToRemove" lower than the limit', () => {
        let value: any;
        service.cellsToRemoveObservable.subscribe(val => value = val);
  
        for (let i = 0; i < 50; i++) {
          service.removeMoreCells();
        }
        
        expect(value).toBe(64);
      });
      
      it('should set the value of "numberOfCellsToRemove" in localStorage via "localStorageService.setData()"', () => {
        const setData = jest.spyOn(localStorageServiceMock, "setData");
        
        service.removeMoreCells();

        expect(setData).toBeCalled();
      });

    });

  });
});

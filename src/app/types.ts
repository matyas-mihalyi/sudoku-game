export type Cell = number | null;

export type ArrayOf9Elements<T> = [T, T, T, T, T, T, T, T, T];

export type Sudoku = ArrayOf9Elements<ArrayOf9Elements<Cell>>;

export type Direction = "ArrowUp" | "ArrowRight" | "ArrowDown" | "ArrowLeft";

export interface CellIndices {
  row: number,
  column: number
}

export type AnimationType = "finished" | "anotherOne" | "moreClues" | "lessClues";

export type StorageKey = "numberOfCellsToRemove" | "startingSudoku" | "currentSudoku";

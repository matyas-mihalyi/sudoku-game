type Cell = number | undefined;

type ArrayOf9Elements<T> = [T, T, T, T, T, T, T, T, T];

export type Sudoku = ArrayOf9Elements<ArrayOf9Elements<Cell>>;
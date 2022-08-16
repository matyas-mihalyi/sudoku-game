type Cell = number | undefined;

export type ArrayOf9Elements<T> = [T, T, T, T, T, T, T, T, T];

export type Sudoku = ArrayOf9Elements<ArrayOf9Elements<Cell>>;

export type direction = "ArrowUp" | "ArrowRight" | "ArrowDown" | "ArrowLeft";
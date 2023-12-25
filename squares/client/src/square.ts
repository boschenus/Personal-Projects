import { List, nil } from './list';


export type Color = "white" | "red" | "orange" | "yellow" | "green" | "blue" | "purple";

/** Converts a string to a color (or throws an exception if not a color). */
export const toColor = (s: string): Color => {
  switch (s) {
    case "white": case "red": case "orange": case "yellow":
    case "green": case "blue": case "purple":
      return s;

    default:
      throw new Error(`unknown color "${s}"`);
  }
};

export type Square =
    | {readonly kind: "solid", readonly color: Color}
    | {readonly kind: "split", readonly nw: Square, readonly ne: Square,
       readonly sw: Square, readonly se: Square};

/** Returns a solid square of the given color. */
export const solid = (color: Color): Square => {
  return {kind: "solid", color: color};
};

/** Returns a square that splits into the four given parts. */
export const split =
    (nw: Square, ne: Square, sw: Square, se: Square): Square => {
  return {kind: "split", nw: nw, ne: ne, sw: sw, se: se};
};


export type Dir = "NW" | "NE" | "SE" | "SW";

/** Describes how to get to a square from the root of the tree. */
export type Path = List<Dir>;


/** Returns JSON describing the given Square. */
export const toJson = (sq: Square): unknown => {
  if (sq.kind === "solid") {
    return sq.color;
  } else {
    return [toJson(sq.nw), toJson(sq.ne), toJson(sq.sw), toJson(sq.se)];
  }
};

/** Converts a JSON description to the Square it describes. */
export const fromJson = (data: unknown): Square => {
  if (typeof data === 'string') {
    return solid(toColor(data))
  } else if (Array.isArray(data)) {
    if (data.length === 4) {
      return split(fromJson(data[0]), fromJson(data[1]),
                   fromJson(data[2]), fromJson(data[3]));
    } else {
      throw new Error('split must have 4 parts');
    }
  } else {
    throw new Error(`type ${typeof data} is not a valid square`);
  }
}

/** Given a square and a path, retrieve the root of the subtree at that location
 * formal definition:
 * find(nil, T)                                       := T   for any T: Square
 * find(cons(a, P), Square("solid", Color))           := undefined    for any a: Dir and P: Path 
 * find_square(cons('NW', P), Square("split", NW, NE, SW, SE)) := find_square(P, NW)  for any P: Path and NW, NE, SW, SE: Square
 * find_square(cons('NE', P), Square("split", NW, NE, SW, SE)) := find_square(P, NE)  for any P: Path and NW, NE, SW, SE: Square
 * find_square(cons('SW', P), Square("split", NW, NE, SW, SE)) := find_square(P, SW)  for any P: Path and NW, NE, SW, SE: Square
 * find_square(cons('SE', P), Square("split", NW, NE, SW, SE)) := find_square(P, SE)  for any P: Path and NW, NE, SW, SE: Square
 * @param path the path of subtree in tree
 * @param square the main tree
 * @returns the subtree of the main tree under the path 
*/
export const find_square = (path: Path, square: Square ): Square => {
  if (path === nil ) {
    return square;
  } else if (square.kind === "solid"){
    throw new Error('Can not find a square in this path')
  } else {
    if (path.hd === "NW") {
      return find_square(path.tl, square.nw);
    } else if (path.hd === "NE") {
      return find_square(path.tl, square.ne);
    } else if (path.hd === "SE") {
      return find_square(path.tl, square.se);
    } else {
      return find_square(path.tl, square.sw);
    } 
  }
};

/**Given a square square1, a path, and a second square square2, return a new square that is the same as the first one except
 * that the subtree whose root is at the given path is replaced by the second square. 
 * formal defination:
 * replace(nil, T1, T2) := T2 for any T1, T2: Square
 * replace((cons(a, P), Square("solid", Color), T2) := undefined    for any a: Dir and P: Path
 * replace(cons('NW', P), Square("split", NW, NE, SW, SE), T2) := Square("split", replace(P, NW, T2), NE, SW, SE)  for any P: Path and T2, NW, NE, SW, SE: Square
 * replace(cons('NE', P), Square("split", NW, NE, SW, SE), T2) := Square("split", NW, replace(P, NE, T2), SW, SE)  for any P: Path and T2, NW, NE, SW, SE: Square
 * replace(cons('SW', P), Square("split", NW, NE, SW, SE), T2) := Square("split", NW, NE, replace(P, SW, T2), SE)  for any P: Path and T2, NW, NE, SW, SE: Square
 * replace(cons('SE', P), Square("split", NW, NE, SW, SE), T2) := Square("split", NW, NE, SW, replace(P, SE, T2))  for any P: Path and T2, NW, NE, SW, SE: Square
 * @param path the path of subtree we want to raplace in square2 in main tree
 * @param square1 the main tree we want to replace square2 in it
 * @param square2 the tree is used to repalce the subtree of main tree under the path
 * @returns the new tree with replace the subtree under the path of the main tree
*/
export const replace = (path: Path, square1: Square, square2: Square): Square => {
  if (path === nil) {
    return square2;
  } else if (square1.kind === "solid") {
    throw new Error('Can not find a square in this path');
  } else {
    if (path.hd === "NW") {
      return split(replace(path.tl, square1.nw, square2), square1.ne, square1.sw, square1.se);
    } else if (path.hd === "NE") {
      return split(square1.nw, replace(path.tl, square1.ne, square2), square1.sw, square1.se);
    } else if (path.hd === "SW") {
      return split(square1.nw, square1.ne, replace(path.tl, square1.sw, square2), square1.se);
    } else {
      return split(square1.nw, square1.ne, square1.sw, replace(path.tl, square1.se, square2));
    }
  }
};
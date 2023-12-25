import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

const data: Map<string, unknown> = new Map<string, unknown>();

/** Returns a list of all the named save files. */
export const listNames = (_: SafeRequest, res: SafeResponse): void => {
  let names: string[] = [];
    for (let key of data.keys()){
      names.push(key)
    }
    res.send({list: names});
};

/** Handles request for /save by storing the given file. */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const value = req.body.value;
  if (value === undefined) {
    res.status(400).send('required argument "value" was missing');
    return;
  }
  data.set(name, value);
};
/** Handles request for /delete by delete the given file. */
export const delete_square = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }
  data.delete(name)
  res.status(200);
};
/** Handles request for /load by returning the file requested. */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  // TODO(6b): implement this function
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('required argument "name" was missing');
    return;
  } 
  if (data.get(name) === undefined) {
    res.status(400).send('no previously saved with the name');
  } else {
    res.send({value: data.get(name)});
  }
};
// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};

/** Used in tests to set the data map back to empty. */
export const resetDataForTesting = (): void => {
  data.clear();
};

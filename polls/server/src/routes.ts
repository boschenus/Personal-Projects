import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

export type Vote = {voter: string, option: string};
type Poll = {
   name: string,
   votes: Vote[],
   endTime: number, 
   options: string[]
   results: string[]
};

// Map from name to poll details.
const polls: Map<string, Poll> = new Map();

// TODO: remove the dummy route

/**
 * Create a new poll with the given list of options and closing in the given
 * number of minutes. Returns a unique ID for the poll.
 * @param req The request object
 * @param res The response object
 */
export const dummy = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.query.name;
  if (typeof name !== 'string' || name.length === 0) {
    res.status(400).send('missing or invalid "name" parameter');
    return;
  }

  res.send({msg: `Hi, ${name}!`});
};

/**
 * Retrieves the current state of a given auction.
 * @param req the request
 * @param req the response
 */
export const getPoll = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (typeof name !== "string") {
    res.status(400).send("missing or invalid 'name' parameter");
    return;
  }

  const poll = polls.get(name);
  if (poll === undefined) {
    res.status(400).send(`no poll with name '${name}'`);
    return;
  }
  res.send({poll: poll})
};

/**
 * Add the item to the list.
 * @param req the request
 * @param res the response
 */
export const addPoll = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if ( typeof name !== "string") {
    res.status(400).send("missing or invalid 'name' parameter");
    return;
  }

  const minutes = req.body.minutes;
  if (typeof minutes !== "number") {
    res.status(400).send(`'minutes' is not a number: ${minutes}`);
    return;
  } else if (isNaN(minutes) || minutes < 1 || Math.round(minutes) !== minutes) {
    res.status(400).send(`'minutes' is not a positive integer: ${minutes}`);
    return;
  }
  
  const options = req.body.options;
  if (!Array.isArray(options)) {
    res.status(400).send("missing or invalid 'options' parameter");
    return;
  } else {
    for ( const option of options ) {
      if ( typeof option !== "string") {
        res.status(400).send("missing or invalid 'options' parameter");
        return;;
      }
    }
  }
  
  if (polls.has(name)) {
    res.status(400).send(`poll for '${name}' already exists`);
    return;
  }

  const poll: Poll = {name: name,
                      votes: [],
                      endTime: Date.now() + minutes * 60 * 1000, 
                      options: options,
                      results: []
                    };
  polls.set(name, poll);
  
  res.send({poll: poll});
};

// Help renew the last option from the same voter
const subVote = (oldVote: Vote[], voter: string, option: string): Vote[] => {
  const newVote: Vote[] = [];
  let replaced: Boolean = false;
  for ( const vote of oldVote ) {
    if (vote.voter === voter) {
      const vo: Vote = { voter: voter, option: option};
      newVote.push(vo);
      replaced = true;
    } else {
      newVote.push(vote);
    }
  }
  if (!replaced) {
    const vo: Vote = { voter: voter, option: option};
    newVote.push(vo);
  } 
  return newVote;
};
// Help to compute the result of votes
const computeResult = ( votes: Vote[], options: string[] ): string[] => {
  
  const results: string[] = [];
  const total: number = votes.length;
  for ( const option of options ) {
    let i = 0;
    for ( const vote of votes) {
      if (vote.option === option) {
        i += 1;
      } 
    }
    results.push(`${((i/total) * 10000)/100.00 + '%'} -- ${option}`)
  }
  return results;
};

/**
 * Bids in an auction, increasing the maximum bid if the bid is higher.
 * @param req the request
 * @param req the response
 */
export const votePoll = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (typeof name !== "string") {
    res.status(400).send("missing or invalid 'name' parameter");
    return;
  }

  const option = req.body.option;
  if ( typeof option !== "string") {
    res.status(400).send("missing or invalid 'option' parameter ");
    return;
  }

  const voter = req.body.voter;
  if ( typeof voter !== "string") {
    res.status(400).send("missing or invalid 'voter' parameter ");
    return;
  }

  const oldPoll = polls.get(name);

  if ( oldPoll === undefined) {
    res.status(400).send(" Impossible! data was lost! ");
    return;
  } else {
    if ( oldPoll.endTime <= Date.now() ) {
      res.status(400).send(" this poll is over! ");
      return;
    } else {
       const votes: Vote[] = subVote(oldPoll.votes, voter, option);
       const results: string[] =  computeResult( votes, oldPoll.options);
       const poll: Poll = {name: name,
                           votes: votes,
                           endTime: oldPoll.endTime, 
                           options: oldPoll.options,
                           results: results
                          };
       polls.set(name, poll);
       res.send({poll: poll});
    }
  }
};

// Sort auctions with the ones finishing soonest first, but with all those that
// are completed after those that are not and in reverse order by end time.
const comparePools = (a: Poll, b: Poll): number => {
  const now: number = Date.now();
  const endA = now <= a.endTime ? a.endTime : 1e15 - a.endTime;
  const endB = now <= b.endTime ? b.endTime : 1e15 - b.endTime;
  return endA - endB;
};
/**
 * Returns two list of ongoing and completed polls, each poll is listed with the amount of time remaining or the amount of time that has passed since
 * it has completed. The ongoing polls should be listed in order of increasing time remaining and the completed
 * polls should be listed in order of increasing time since completed
 * @param _req the request
 * @param res the response
 */
export const listPolls = (_req: SafeRequest, res: SafeResponse): void => {
  const vals = Array.from(polls.values());
  const openPolls: Poll[] = [];
  const closedPolls: Poll[] = [];
  for ( const val of vals ) {
    if (val.endTime <= Date.now()) {
      closedPolls.push(val);
    } else {
      openPolls.push(val);
    }
  }
  openPolls.sort(comparePools);
  closedPolls.sort(comparePools);
  res.send({openPolls: openPolls, closedPolls: closedPolls});
};

/** Handles request for /delete by delete the given file. */
export const delete_poll = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing or invaild');
    return;
  }
  polls.delete(name)
  res.send({delete: true});
};
/** Testing function to remove all the added auctions. */
export const resetForTesting = (): void => {
  polls.clear();
};

/** Testing function to move all end times forward the given amount (of ms). */
export const advanceTimeForTesting = (ms: number): void => {
  for (const poll of polls.values()) {
    poll.endTime -= ms;
  }
};







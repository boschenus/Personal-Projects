import { isRecord } from "./record";




type Vote = {voter: string, option: string};
export type Poll = {
    readonly name: string,
    readonly votes: Vote[],
    readonly endTime: number, 
    readonly options: string[]
    readonly results: string[]
  };



/**
 * Parses unknown data into an Auction. Will log an error and return undefined
 * if it is not a valid Auction.
 * @param val unknown data to parse into an Auction
 * @return Auction if val is a valid Auction and undefined otherwise
 */
export const parsePoll = (val: unknown): undefined | Poll => {
    if (!isRecord(val)) {
      console.error("not an poll", val)
      return undefined;
    }
  
    if (typeof val.name !== "string") {
      console.error("not an poll: missing 'name'", val)
      return undefined;
    }
    if (!Array.isArray(val.votes)){
      console.error("not an poll: votes is not an array", val)
      return undefined;
    }
    const votes: Vote[] = []
    for (const vote of val.votes) {
        const vo = parseVote(vote);
        if (vo === undefined) {
            console.error("not an poll: missing or invalid 'votes' ", val)
        } else {
            votes.push(vo);
        }
    }
  
    if (typeof val.endTime !== "number" || val.endTime < 0 || isNaN(val.endTime)) {
      console.error("not an poll: missing or invalid 'endTime'", val)
      return undefined;
    }
    
    if (!Array.isArray(val.options)){
        console.error("not an poll: options is not an array", val)
        return undefined;
    }
    
    const options: string[] = []
    for (const option of val.options) {
        if (typeof option !== 'string') {
            console.error("not an poll: options element is not a string", val)
            return undefined
        } else {
            options.push(option)
        }
    }

    if (!Array.isArray(val.results)){
      console.error("not an poll: options is not an array", val)
      return undefined;
    }

    const results: string[] = []
    for (const result of val.results) {
        if (typeof result !== 'string') {
            console.error("not an poll: results element is not a string", val)
            return undefined
        } else {
            results.push(result)
        }
    }

    return {
      name: val.name, votes: votes, endTime: val.endTime, 
      options: options, results: results
    };
  };

const parseVote = (val: unknown): undefined | Vote => {
    if (!isRecord(val)) {
        console.error("not an Vote", val)
        return undefined;
      }
    if (typeof val.voter !== 'string') {
        console.error("not an poll: voters element is not a string", val)
        return undefined;
    }
    if (typeof val.option !== 'string') {
        console.error("not an poll: voters element is not a string", val)
        return undefined;
    }

    return {voter: val.voter, option: val.option}
};
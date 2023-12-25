import React, { Component, MouseEvent } from "react";
import { isRecord } from './record';
import{ Poll, parsePoll } from './poll'
import { PollsVote } from "./PollsVote";


type ResultProps = {
    name: string,
    onBackClick: () => void,
};
  
type ResultState = {
    now: number,
    poll: Poll | undefined,
    error: string
};

export class PollsResult extends Component<ResultProps, ResultState> {

    constructor(props: ResultProps) {
      super(props);
  
      this.state = {now: Date.now(), poll: undefined,
                     error: ""};
    }
  
    componentDidMount = (): void => {
      this.doRefreshClick(); 
    };
  
    render = (): JSX.Element => {
      if (this.state.poll === undefined) {
        return <p>Loading poll "{this.props.name}"...</p>
    } else {
        if (this.state.poll.endTime > this.state.now) {
          return <PollsVote name={this.props.name}
                              onBackClick={this.doSuperBackClick}/>;
        } else {
           return (
             <div>
               <h2>{this.props.name}</h2>
               <p>Closed {Math.round((this.state.now - this.state.poll.endTime)/(1000*60))} minutes ago</p>
               {this.renderResult()}
               <button type="button" onClick={this.doRefreshClick}>Refresh</button>
               <button type="button" onClick={this.doBackClick}>Back</button>
             </div>
        )
        }
      }
    };

    renderResult = (): JSX.Element => {
      if (this.state.poll === undefined) {
        throw new Error("Impossible");
      } else {
        const results: JSX.Element[] = [];
        for (const result of this.state.poll.results) {
                results.push(
                    <li key={result}>
                        {result}
                    </li>);
            }
        return <ul>{results}</ul>
      }
    };

    doRefreshClick = (): void => {
        const args = {name: this.props.name};
        fetch("/api/get", {
            method: "POST", body: JSON.stringify(args),
            headers: {"Content-Type": "application/json"} })
          .then(this.doGetResp)
          .catch(() => this.doGetError("failed to connect to server"));
    };
    
    doGetResp = (res: Response): void => {
        if (res.status === 200) {
          res.json().then(this.doGetJson)
              .catch(() => this.doGetError("200 res is not JSON"));
        } else if (res.status === 400) {
          res.text().then(this.doGetError)
              .catch(() => this.doGetError("400 response is not text"));
        } else {
          this.doGetError(`bad status code from /api/get: ${res.status}`);
        }
    };
    
    doGetJson = (data: unknown): void => {
        if (!isRecord(data)) {
          console.error("bad data from /api/get: not a record", data);
          return;
        }
    
        this.doPollChange(data);
        
    };
    
      // Shared helper to update the state with the new auction.
    doPollChange = (data: {poll?: unknown}): void => {
        const poll = parsePoll(data.poll);
        if (poll !== undefined) {
            this.setState({poll, now: Date.now(), error: ""});
        } else {
          console.error("auction from /api/get did not parse", data.poll)
        }
    };
    
    doGetError = (msg: string): void => {
        console.error(`Error fetching /api/get: ${msg}`);
    };

    doSuperBackClick = (): void => {
        this.props.onBackClick(); 
    };

    doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBackClick(); 
    };
}
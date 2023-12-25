import React, { Component, ChangeEvent, MouseEvent } from "react";
import { isRecord } from './record';
import{ Poll, parsePoll } from './poll'
import { PollsResult } from "./PollsResult";

type VoteProps = {
    name: string,
    onBackClick: () => void,
};
  
type VoteState = {
    now: number,
    poll: Poll | undefined,
    error: string
    option: string
    voter: string
    finish: boolean
};

// Shows an individual auction and allows bidding (if ongoing).
export class PollsVote extends Component<VoteProps, VoteState> {

  constructor(props: VoteProps) {
    super(props);

    this.state = {now: Date.now(), poll: undefined,
                  option: "", error: "", voter: "", finish: false};
  }

  componentDidMount = (): void => {
    this.doRefreshClick(); 
  };

  render = (): JSX.Element => {
    if (this.state.poll === undefined) {
      return <p>Loading poll "{this.props.name}"...</p>
    } else {
      if (this.state.poll.endTime <= this.state.now) {
        return <PollsResult name={this.props.name}
                            onBackClick={this.doSuperBackClick}/>;
      } else {
        return this.renderOngoing(this.state.poll);
      }
    }
  };

  renderOngoing = (poll: Poll): JSX.Element => {
    const min = Math.round((poll.endTime - this.state.now) / 60 / 100) / 10;
    return (
      <div>
        <h2>{poll.name}</h2>
        <p><i>Closes in {min} minutes...</i></p>
        {this.renderOptions()}
        <div>
            <label htmlFor="voterName">Voter Name:</label>
            <input id="voterName" type="text" value={this.state.voter}
                onChange={this.doVoterNameChange}></input>
          </div>
        <button type="button" onClick={this.doBackClick}>Back</button>
        <button type="button" onClick={this.doRefreshClick}>Refresh</button>
        <button type="button" onClick={this.doVoteClick}>Vote</button>
        {this.renderError()}
        {this.renderFinish()}
      </div>);
  };
  
  renderOptions = (): JSX.Element => {
    if (this.state.poll === undefined){
      throw new Error("Impossible")
    } else {
      const options: JSX.Element[] = [];
      for (const option of this.state.poll.options) {
        options.push(
          <div key={option}>
            <input type="radio" id={option} name={option} value={option}
            checked={option === this.state.option} onChange={this.doRadioClick}/>
            <label htmlFor={option}>{option}</label>
          </div>
        )
      }
      return <ul>{options}</ul>;
    }
  };
  renderError = (): JSX.Element => {
    if (this.state.error.length === 0) {
      return <div></div>;
    } else {
      const style = {width: '300px', backgroundColor: 'rgb(246,194,192)',
          border: '1px solid rgb(137,66,61)', borderRadius: '5px', padding: '5px' };
      return (<div style={{marginTop: '15px'}}>
          <span style={style}><b>Error</b>: {this.state.error}</span>
        </div>);
    }
  };

  renderFinish = (): JSX.Element => {
    if (!this.state.finish) {
      return <div></div>;
    } else {
      const style = {width: '300px', 
          border: '1px solid rgb(137,66,61)', borderRadius: '5px', padding: '5px' };
      return (<div style={{marginTop: '15px'}}>
          <span style={style}> Record vote of "{this.state.option}" as "{this.state.voter}"</span>
        </div>);
    }
  };

  doRadioClick = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({option: evt.target.value, finish: false});  
  };

  doVoterNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({voter: evt.target.value, finish: false});  
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
    this.setState({finish: false, voter: ''});
  }

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
  }

  doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
    this.props.onBackClick(); 
  }
  doVoteClick = (_: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.poll === undefined)
      throw new Error("impossible");

    // Verify that the user entered all required information.
    if (this.state.voter.trim().length === 0 ||
        this.state.option.trim().length === 0) {
      this.setState({error: "a required field is missing."});
      return;
    }

    const args = {name: this.props.name, voter: this.state.voter, option: this.state.option};
    fetch("/api/vote", {
        method: "POST", body: JSON.stringify(args),
        headers: {"Content-Type": "application/json"} })
      .then(this.doVoteResp)
      .catch(() => this.doVoteError("failed to connect to server"));
  };

  doVoteResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doVoteJson)
          .catch(() => this.doVoteError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doVoteError)
          .catch(() => this.doVoteError("400 response is not text"));
    } else {
      this.doVoteError(`bad status code from /api/vote: ${res.status}`);
    }
  };

  doVoteJson = (data: unknown): void => {
    if (this.state.poll === undefined)
      throw new Error("impossible");

    if (!isRecord(data)) {
      console.error("bad data from /api/vote: not a record", data);
      return;
    }

    this.doPollChange(data);
    this.setState({finish: true});
  };

  doVoteError = (msg: string): void => {
    console.error(`Error fetching /api/vote: ${msg}`);
  };
}


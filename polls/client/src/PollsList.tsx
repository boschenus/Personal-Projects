import React, { Component, MouseEvent } from 'react';
import { isRecord } from './record';
import{ Poll, parsePoll } from './poll'


type ListProps = {
    onNewClick: () => void,
    onOpenPollClick: (name: string) => void
    onClosedPollClick: (name: string) => void
  };

type ListState = {
now: number,  // current time when rendering
closedPolls: Poll[] | undefined,
openPolls: Poll[] | undefined,

};

export class PollsList extends Component<ListProps, ListState> {

    constructor(props: ListProps) {
      super(props);
      this.state = {now: Date.now(), openPolls: undefined, closedPolls: undefined};
    }
  
    componentDidMount = (): void => {
      this.doRefreshClick();
    }
  
    componentDidUpdate = (prevProps: ListProps): void => {
      if (prevProps !== this.props) {
        this.setState({now: Date.now()});  // Force a refresh
      }
    };
  
    render = (): JSX.Element => {
      return (
        <div>
          <h2>Current Auctions</h2>
          <h3>Still Open</h3>
          {this.renderOpenPolls()}
          <h3>Closed</h3>
          {this.renderClosedPolls()}
          <button type="button" onClick={this.doRefreshClick}>Refresh</button>
          <button type="button" onClick={this.doNewClick}>New Poll</button>
        </div>);
    };

    renderOpenPolls = (): JSX.Element => {
        if (this.state.openPolls === undefined) {
            return <p>Loading auction list...</p>;
        } else {
            const polls: JSX.Element[] = [];
            for (const poll of this.state.openPolls) {
                const min = Math.round((poll.endTime - this.state.now) / 60 / 100) / 10
                const desc = (min < 0) ? "" :
                    <span> – {Math.round(min)} minutes remaining</span>;
                polls.push(
                    <li key={poll.name}>
                        <a href="#" onClick={(evt) => this.doOpenPollClick(evt, poll.name)}>{poll.name}</a>
                        {desc}
                        <span>&emsp;&emsp;&emsp;</span>
                        <a href="#1" onClick={(evt) => this.doDeleteClick(evt, poll.name)}>delete</a>
                    </li>);
            }
            return <ul>{polls}</ul>
        }
    };

    renderClosedPolls = (): JSX.Element => {
        if (this.state.closedPolls === undefined) {
            return <p>Loading auction list...</p>;
        } else {
            const polls: JSX.Element[] = [];
            for (const poll of this.state.closedPolls) {
                const min = Math.round((this.state.now - poll.endTime) / 60 / 100) / 10
                const desc = (min < 0) ? "" :
                    <span> – {Math.round(min)} minutes ago</span>;
                polls.push(
                    <li key={poll.name}>
                        <a href="#" onClick={(evt) => this.doClosedPollClick(evt, poll.name)}>{poll.name}</a>
                        {desc}
                        <span>&emsp;&emsp;&emsp;</span>
                        <a href="#1" onClick={(evt) => this.doDeleteClick(evt, poll.name)}>delete</a>
                    </li>);
            }
            return <ul>{polls}</ul>
        }
    };

    doListResp = (resp: Response): void => {
        if (resp.status === 200) {
          resp.json().then(this.doListJson)
              .catch(() => this.doListError("200 response is not JSON"));
        } else if (resp.status === 400) {
          resp.text().then(this.doListError)
              .catch(() => this.doListError("400 response is not text"));
        } else {
          this.doListError(`bad status code from /api/list: ${resp.status}`);
        }
    };
    
    doListJson = (data: unknown): void => {
        if (!isRecord(data)) {
          console.error("bad data from /api/list: not a record", data);
          return;
        }
    
        if (!Array.isArray(data.closedPolls) || !Array.isArray(data.openPolls)) {
          console.error("bad data from /api/list: polls are not array", data);
          return;
        }
        
        const openPolls: Poll[] = [];
        const closedPolls: Poll[] = [];
        for (const val of data.openPolls) {
          const openPoll = parsePoll(val);
          if (openPoll === undefined) {
            return;
          } else {
            openPolls.push(openPoll);
          }
        }
        for (const val of data.closedPolls) {
          const closedPoll = parsePoll(val);
          if (closedPoll === undefined) {
            return;
          } else {
            closedPolls.push(closedPoll);
          }
        }
        this.setState({openPolls: openPolls, closedPolls: closedPolls, now: Date.now()});  // fix time also
    };
    
    doListError = (msg: string): void => {
        console.error(`Error fetching /api/list: ${msg}`);
    };
    
    doRefreshClick = (): void => {
        fetch("/api/list").then(this.doListResp)
            .catch(() => this.doListError("failed to connect to server"));
    };
    
    doNewClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onNewClick();  
    };

    doOpenPollClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
        evt.preventDefault();
        this.props.onOpenPollClick(name);
    };

    doDeleteClick = (_evt: MouseEvent<HTMLAnchorElement>, name: string): void =>{
      const arg = {name: name};
      fetch('/api/delete', {method: "POST", 
          body: JSON.stringify(arg), 
          headers: {"Content-Type": "application/json"}})
        .then(this.doDeleteResp)
        .catch(() => this.doDeleteError("failed to connect to server"));
    };
  
      // Called when the server confirms that the saqure was deleted.
    doDeleteResp = (res: Response): void => {
      if (res.status === 200) {
        res.json().then(this.doDeleteJson)
        .catch(() => this.doDeleteError("200 response is not JSON"))
      } else if (res.status === 400) {
        res.text().then(this.doDeleteError)
            .catch(() => this.doDeleteError("400 response is not text"));
      } else {
        this.doDeleteError(`bad status code ${res.status}`);
      }
    };
  
    // Called with the JSON response from /api/delete
    doDeleteJson = (data: unknown): void => {
      if (!isRecord(data)) {
        console.error("bad data from /api/delete: not a record", data);
        return;
      }
      if (data.delete !== true) {
        console.log(data);
        console.error("bad data from /api/delete: delete may not finish", data);
        return;
      }

      this.doRefreshClick();
    };
    
    // Called when we fail trying to delete an square
    doDeleteError = (msg: string): void => {
      console.error(`Error fetching /api/delete: ${msg}`);
    };
  

    doClosedPollClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
        evt.preventDefault();
        this.props.onClosedPollClick(name);
    };

    
}
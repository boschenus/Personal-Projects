import React, { Component } from "react";
import { PollsList } from './PollsList'
import { PollsVote } from './PollsVote'
import { NewPoll } from './NewPoll'
import { PollsResult } from "./PollsResult";


// Indicates which page to show. If it is the details page, the argument
type Page = "list" | "new" | {kind: "vote", name: string} | {kind: "result", name: string}

type PollsAppState = {
  page: Page

}
// Whether to show debugging information in the console.
const DEBUG: boolean = true;

/** Displays the UI of the Polls application. */
export class PollsApp extends Component<{}, PollsAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {page: "list"};
  }
  
  render = (): JSX.Element => {
    if (this.state.page === "list") {
      if (DEBUG) console.debug("rendering list page");
      return <PollsList onNewClick={this.doNewClick}
                        onOpenPollClick={this.doOpenPollClick}
                        onClosedPollClick={this.doClosedPollClick}/>;
    } else if (this.state.page === "new") {
      if (DEBUG) console.debug("rendering add page");
      return <NewPoll onBackClick={this.doBackClick}
                      onOpenPollClick={this.doOpenPollClick}/>;
    } else {
      if (this.state.page.kind === "result"){
        if (DEBUG) console.debug(`rendering result page for "${this.state.page.name}"`);
        return <PollsResult name={this.state.page.name}
                            onBackClick={this.doBackClick}/>;
      } else {
        if (DEBUG) console.debug(`rendering vote page for "${this.state.page.name}"`);
        return <PollsVote name={this.state.page.name}
                            onBackClick={this.doBackClick}/>;
      }
    }
  };

  doNewClick = (): void => {
    if (DEBUG) console.debug("set state to new");
    this.setState({page: "new"});
  };

  doClosedPollClick = (name: string): void => {
    if (DEBUG) console.debug(`set state to result for poll ${name}`);
    this.setState({page: {kind: "result", name}});
  };

  doOpenPollClick = (name: string): void => {
    if (DEBUG) console.debug(`set state to vote for poll ${name}`);
    this.setState({page: {kind: "vote", name}});
  };

  doBackClick = (): void => {
    if (DEBUG) console.debug("set state to list");
    this.setState({page: "list"});
  };
}


// type PollsAppState = {
//   // name: string;  // mirror state of name input box
//   // msg: string;   // essage sent from server

// }


// /** Displays the UI of the Polls application. */
// export class PollsApp extends Component<{}, PollsAppState> {

//   constructor(props: {}) {
//     super(props);

//     this.state = {name: "", msg: ""};
//   }
  
//   render = (): JSX.Element => {


    // return (<div>
    //     <div>
    //       <label htmlFor="name">Name:</label>
    //       <input type="text" id="name" value={this.state.name}
    //              onChange={this.doNameChange}></input>
    //       <button onClick={this.doDummyClick}>Dummy</button>
    //     </div>
    //     {this.renderMessage()}
    //   </div>);
  // };

  // renderMessage = (): JSX.Element => {
  //   if (this.state.msg === "") {
  //     return <div></div>;
  //   } else {
  //     return <p>Server says: {this.state.msg}</p>;
  //   }
  // };

  // doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
  //   this.setState({name: evt.target.value, msg: ""});
  // };

  // doDummyClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
  //   const name = this.state.name.trim();
  //   if (name.length > 0) {
  //     const url = "/api/dummy?name=" + encodeURIComponent(name);
  //     fetch(url).then(this.doDummyResp)
  //         .catch(() => this.doDummyError("failed to connect to server"));
  //   }
  // };

  // doDummyResp = (res: Response): void => {
  //   if (res.status === 200) {
  //     res.json().then(this.doDummyJson)
  //         .catch(() => this.doDummyError("200 response is not JSON"));
  //   } else if (res.status === 400) {
  //     res.text().then(this.doDummyError)
  //         .catch(() => this.doDummyError("400 response is not text"));
  //   } else {
  //     this.doDummyError(`bad stauts code ${res.status}`);
  //   }
  // };

  // doDummyJson = (data: unknown): void => {
  //   if (!isRecord(data)) {
  //     console.error("200 response is not a record", data);
  //     return;
  //   }

  //   if (typeof data.msg !== "string") {
  //     console.error("'msg' field of 200 response is not a string", data.msg);
  //     return;
  //   }

  //   this.setState({msg: data.msg});
  // }

  // doDummyError = (msg: string): void => {
  //   console.error(`Error fetching /api/dummy: ${msg}`);
  // };

// }
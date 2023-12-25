import React, { Component, ChangeEvent, MouseEvent } from "react";
import { solid, split, Path, Square, fromJson } from './square';
// import { SquareElem } from './square_draw';
import { Editor } from './Editor'
import { toJson } from "./square";


/**
 * Determines whether the given value is a record.
 * @param val the value to check
 */
export const isRecord = (val: unknown): val is Record<string, unknown> => {
  return val !== null && typeof val === "object";
};

const DEBUG: boolean = true;

type Page = "list" | "editor"


type AppState  = {
  // will probably need something here
  page: Page

  files: string[]

  newName: string

  create: boolean
  
  nowName: string

  savesq: Square
}


export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    const sq = split(solid("blue"), solid("orange"), solid("purple"), solid("red"));
    this.state = {page: "list", nowName:"", newName:"", files: [], create: true, savesq: sq};
  }
  componentDidMount = (): void => {
    this.doBackClick();
  };

  render = (): JSX.Element => {
    // If they wanted this square, then we're done!
    const sq = split(solid("blue"), solid("orange"), solid("purple"), solid("red"));

    // TODO: replace this code with the commented out code below to use Editor
    // return <SquareElem width={600} height={600} square={sq}
    //           onClick={this.doSquareClick}/>;
    if (this.state.page === "list") {
      if (DEBUG) console.debug("rendering list page");
      return <div>{this.renderStartPage()}</div>
    } else {
      if (DEBUG) console.debug("rendering editor page");
      if (this.state.create) {
        return <Editor initialState={sq} onSave={this.doSaveClick} onBack={this.doBackClick}/>
      } else {
        return <Editor initialState={this.state.savesq} onSave={this.doSaveClick} onBack={this.doBackClick}/>
      }
    }
  };
  renderStartPage = (): JSX.Element => {
    return ( 
    <div>
      <h2>Files</h2>
      {this.renderList()}
      <p className="more-instructions">Name:
      <input type="text" className="new-square"
          value={this.state.newName}
          onChange={this.doNewNameChange} />
      <button type="button" className="btn btn-link"
          onClick={this.doCreateClick}>Create</button>
    </p>
    </div>);
  };

  renderList = (): JSX.Element[] => {
    const names: JSX.Element[] = [];
    for (const name of this.state.files) {
      names.push(
        <li key={name}>
          <a href="#" onClick={(evt) => this.doNameClick(evt, name)}>{name}</a>
          <span>&emsp;&emsp;&emsp;</span>
          <a href="#1" onClick={(evt) => this.doDeleteClick(evt, name)}>delete</a>
        </li>);
    }
    return names;
  };

  doDeleteClick = (_evt: MouseEvent<HTMLAnchorElement>, name: string): void =>{
    const arg = {name: name};
    fetch('/api/delete', {method: "POST", 
        body: JSON.stringify(arg), 
        headers: {"Content-Type": "application/json"}})
      .then(this.doDeleteResp)
      .catch(() => this.doDeleteError("failed to connect to server"));

    const index = this.state.files.indexOf(name);
    const files = this.state.files.slice(0, index)
        .concat(this.state.files.slice(index+1));
    this.setState({files: files, newName: ""});
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
    if (typeof data.name !== 'string') {
      console.log(data);
      console.error("bad data from /api/delete: name is not a string", data);
      return;
    }
    if (DEBUG) console.log(`deleting square ${data.name}`);
    // Already know what was deleted, but now we know delete was made.
    
  };
  
  // Called when we fail trying to delete an square
  doDeleteError = (msg: string): void => {
    console.error(`Error fetching /api/delete: ${msg}`);
  };

  doNameClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
    evt.preventDefault()
    const url = "/api/load?" + "name=" + encodeURIComponent(name)
    fetch(url)
      .then(this.doLoadResp)
      .catch(() => this.doLoadError("failed to connect to server"))
    this.setState({nowName: name})
  };

  doLoadResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doLoadJson)
      .catch(() => this.doLoadError("200 response is not valid JSON"))
    } else if (res.status === 400) {
      res.text().then(this.doLoadError)
          .catch(() => this.doLoadError("400 response is not text"));
    } else {
      this.doLoadError(`bad status code ${res.status}`);
    }
  };

  doLoadJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/load: not a record", data);
      return;
    }

    if (!Array.isArray(data.value) && typeof data.value !== "string") {
      console.log(data);
      console.error("bad data from /api/load: value is not a array or string", data);
      return;
    }
    
    if (DEBUG) console.log(`loading the square of ${data.value}`);
    const sq: Square = fromJson(data.value)
    this.setState({page: 'editor', savesq: sq, create: false, newName: ""});
  };

  doLoadError = (msg: string): void => {
    console.error(`Error fetching /api/load: ${msg}`);
  };



  doNewNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    if (DEBUG) console.log(`changeing new name to ${evt.target.value}`);
    this.setState({newName: String(evt.target.value)});
  };

  doSquareClick = (path: Path): void => {
    console.log(path);
    alert("Stop that!");
  };
  doCreateClick = (): void => {
    if (DEBUG) console.debug("set state to new")
    if (this.state.files.indexOf(this.state.newName) !== -1)  {
      this.setState({page:"editor", create: false, nowName: this.state.newName});
    } else {
      this.setState({page: "editor", create: true});
    }
  };

  // Called when the user clicks on the button to save the new square.
  doSaveClick = (sq: Square): void => {
    
    if (this.state.create) {
      const args = {name: this.state.newName, value: toJson(sq)};

      fetch("/api/save", {method: "POST", 
        body: JSON.stringify(args), 
        headers: {"Content-Type": "application/json"}})
      .then(this.doSaveResp)
      .catch(() => this.doSaveError("failed to connect to server"));
    } else {
      const args = {name: this.state.nowName, value: toJson(sq)};

      fetch("/api/save", {method: "POST", 
        body: JSON.stringify(args), 
        headers: {"Content-Type": "application/json"}})
      .then(this.doSaveResp)
      .catch(() => this.doSaveError("failed to connect to server"));
    }
    
  };

  // Called when the server confirms that the saqure was saved.
  doSaveResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doSaveJson)
      .catch(() => this.doSaveError("200 response is not JSON"))
    } else if (res.status === 400) {
      res.text().then(this.doSaveError)
          .catch(() => this.doSaveError("400 response is not text"));
    } else {
      this.doSaveError(`bad status code ${res.status}`);
    }
  };

  // Called with the JSON response from /api/save
  doSaveJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/save: not a record", data);
      return;
    }

    if (typeof data.name !== 'string') {
      console.log(data);
      console.error("bad data from /api/save: name is not a string", data);
      return;
    }
    if (DEBUG) console.log(`adding new item ${data.name}`);

    if (this.state.newName === undefined)
      throw new Error('impossible: items is undefined');

    // Already know what was saved, but now we know save was made.
    const files = this.state.files.concat(
      [ data.name ]);
    this.setState({files: files, newName: ""});
  };
  
  // Called when we fail trying to save an square
  doSaveError = (msg: string): void => {
    console.error(`Error fetching /api/save: ${msg}`);
  };
  // TODO: add some functions to access routes and handle state changes probably
  doBackClick = (): void =>{
    if (DEBUG) console.log("set state to list");
    fetch("/api/list")
      .then(this.doBackResp)
      .catch(() => this.doBackError("failed to connect to server"))
    
  };

  doBackResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doBackJson)
      .catch(() => this.doBackError("200 response is not valid JSON"))
    } else if (res.status === 400) {
      res.text().then(this.doBackError)
          .catch(() => this.doBackError("400 response is not text"));
    } else {
      this.doBackError(`bad status code ${res.status}`);
    }
  };

  doBackJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/list: not a record", data);
      return;
    }

    // if (typeof data.name !== 'string') {
    //   console.log(data);
    //   console.error("bad data from /api/list: name is not a string", data);
    //   return;
    // }
    if (DEBUG) console.log(`getting store names ${data.list}`);
    const files = parsefiles(data.list) 
    if (files !== undefined) {
      this.setState({page: 'list', files: files, newName: ""});
    } else {
      this.doBackError("Impossible! files is undefined");
    }
  };

  doBackError = (msg: string): void => {
    console.error(`Error fetching /api/list: ${msg}`);
  };

}
/** */
export const parsefiles = (val: unknown): undefined | string[] => {
  if (!Array.isArray(val)) {
    console.error("not an array", val);
    return undefined;
  }

  const files: string[] = [];
  for (const file of val) {
    if (typeof file !== 'string') {
      console.error("file is missing or invalid", file);
      return undefined;
    } else {
      files.push(file);
    }
  }
  return files;
};
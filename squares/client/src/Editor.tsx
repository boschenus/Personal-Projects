import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Square, Path, replace, find_square, solid, split } from './square';
import { SquareElem } from "./square_draw";
import { nil, rev } from"./list"






type EditorProps = {
  /** Initial state of the file. */
  initialState: Square;

  onBack: () => void
  onSave: (square: Square) => void


};


type EditorState = {
  /** The root square of all squares in the design */
  root: Square;
  /** Path to the square that is currently clicked on, if any */
  selected?: Path;

  selectOption?: string

};


/** UI for editing the image. */
export class Editor extends Component<EditorProps, EditorState> {

  constructor(props: EditorProps) {
    super(props);

    this.state = { root: props.initialState};
  }

  render = (): JSX.Element => {
    // TODO: add some editing tools here
    return <div>
            <SquareElem width={600} height={600}
                      square={this.state.root} selected={this.state.selected}
                      onClick={this.doSquareClick}></SquareElem>
            <h2>Editor Tools</h2>
            <p>
            <button type="button" className="btn split" onClick={this.doSplitClick}>Split</button>
            <button type="button" className="btn merge" onClick={this.doMergeClick}>Merge</button>
            <select value={this.state.selectOption} onChange={this.doColorChange}>
              <option value={'white'}>white</option>
              <option value={'red'}>red</option>
              <option value={'orange'}>orange</option>
              <option value={'yellow'}>yellow</option>
              <option value={'green'}>green</option>
              <option value={'blue'}>blue</option>
              <option value={'purple'}>purple</option>
            </select>
            </p>
            <button type="button" className="btn save" onClick={this.doSaveClick}>Save</button>
            <button type="button" className="btn back" onClick={this.doBackClick}>Back</button>
           </div>;
  };

  doSquareClick = (path: Path): void => {
    // TODO: remove this code, do something with the path to the selected square
    // console.log(path);
    // alert("Stop that!");
    const cur_square: Square = find_square(path, this.state.root);
    if (cur_square.kind === 'split') {
        throw new Error('Impossible! you select a split kind square!');
    } else {
      const cur_color = cur_square.color;
      this.setState({root: this.state.root, selected: path, selectOption: cur_color})
    }
  };

  doSplitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
    const sq = split(solid("blue"), solid("orange"), solid("purple"), solid("red"));
    if (this.state.selected === undefined) {
      alert("Select a square!")
    } else {
      const new_square: Square = replace(this.state.selected, this.state.root, sq);
      this.setState({root: new_square});
    }
  };


  doMergeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
    if (this.state.selected === undefined) {
      alert("Select a square!")
    } else {
      const rev_path = rev(this.state.selected)
      if (rev_path !== nil) {
        const new_square: Square = replace(rev(rev_path.tl), this.state.root, find_square(this.state.selected, this.state.root));
        this.setState({root: new_square});
      } else {
        throw new Error("Impossible! Selected path is nil!")
      }
    }
  };

  doColorChange = (_evt: ChangeEvent<HTMLSelectElement>): void => {
    // TODO: implement
    if (this.state.selected === undefined) {
      alert("Select a square!")
    } else if (_evt.target.value !== 'white' && _evt.target.value !== 'red' 
          && _evt.target.value !== 'orange' && _evt.target.value !== 'yellow' 
          && _evt.target.value !== 'green' && _evt.target.value !== 'blue' 
          && _evt.target.value !== 'purple') {
            throw new Error("Impossible! select value are not a color!")
    } else {
        const color: Square = {kind: "solid", color: _evt.target.value};
        const new_square: Square = replace(this.state.selected, this.state.root, color);
        this.setState({root: new_square});
      }
  };

  doSaveClick = (_: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.root === undefined)
      throw new Error('should be impossible');
    return this.props.onSave(this.state.root);
  };

  doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
    return this.props.onBack()
  };
  
    
  
}

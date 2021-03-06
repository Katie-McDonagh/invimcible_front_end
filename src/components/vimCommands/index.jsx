import React from 'react';
import "./vimCommands.css"
import store from '../../config/store';

export default class VimCommand extends React.Component {
  constructor () {
    super();
    this.state = {
        prefix: ':',
    }
  }

  getVimCommand() {
    return this.state.value
  }

  handleChange(e) {
    const inputs = { type: "ADD_LETTER", letters: e.target.value }
    return store.dispatch(inputs);
    };

    render () {
      return <div className= "vimBox">
          <input
            type="text"
            defaultValue={this.state.prefix}
            onChange = {this.handleChange.bind(this)}
         />
      </div>
  }
}

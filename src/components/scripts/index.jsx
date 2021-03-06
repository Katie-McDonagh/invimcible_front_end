import React from 'react';
import { connect } from 'react-redux';

export class Script extends React.Component {

    render() {
        return (
            <div className="Script">
            {this.props.script}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        script: state.scripts.scripts
    };
}

export default connect(mapStateToProps)(Script);

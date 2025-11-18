import React from 'react';

export class Boundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
        };
    }

    componentDidCatch(error, info) {
        this.setState({ error: true });
        if (this.props.onCatch) this.props.onCatch(error, info);
    }

    render() {
        return this.state.error ? this.props.fallback : this.props.children;
    }
}

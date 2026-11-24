import { Component, type ErrorInfo, type ReactNode } from 'react';

type BoundaryProps = {
    children: ReactNode;
    fallback: ReactNode;
    onCatch?: (error: Error, info: ErrorInfo) => void;
};

type BoundaryState = { error: boolean };

export class Boundary extends Component<BoundaryProps, BoundaryState> {
    state: BoundaryState = { error: false };

    componentDidCatch(error: Error, info: ErrorInfo) {
        this.setState({ error: true });
        console.error(error);
        this.props.onCatch?.(error, info);
    }

    render() {
        return this.state.error ? this.props.fallback : this.props.children;
    }
}

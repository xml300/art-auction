"use client";
import React from "react";

interface ErrorBoundaryProps {
    children?: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error & { digest?: string }; reset: () => void }> | React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: (Error & { digest?: string }) | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps){
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error("Uncaught Error:", error, errorInfo);
    }

    reset = () => {
        this.setState({ hasError: false, error: null });
    }

    render() {
        if(this.state.hasError && this.state.error){
            const Fallback = this.props.fallback;
            if (typeof Fallback === 'function') {
                return <Fallback error={this.state.error} reset={this.reset} />
            }
            return Fallback || <div>Something went wrong.</div>
        }
        return this.props.children;
    }
}
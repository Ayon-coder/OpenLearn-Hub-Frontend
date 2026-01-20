import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-xl border border-red-100 my-4">
                    <div className="bg-red-100 p-3 rounded-full mb-4">
                        <AlertTriangle className="text-red-600" size={32} />
                    </div>
                    <h2 className="text-lg font-bold text-red-900 mb-2">Something went wrong</h2>
                    <p className="text-sm text-red-700 max-w-md mb-4">
                        We couldn't load this content properly. It might be due to a temporary data issue.
                    </p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            window.location.reload();
                        }}
                        className="px-4 py-2 bg-white border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                    >
                        Reload Page
                    </button>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <pre className="mt-4 p-4 bg-gray-900 text-red-300 rounded text-xs text-left overflow-auto max-w-full w-full">
                            {this.state.error.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

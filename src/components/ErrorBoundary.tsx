import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production, wire this to your logging pipeline (Sentry/Datadog/etc).
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary] Unhandled error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-10 text-center">
        <div className="glass-strong w-full rounded-2xl p-6">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm opacity-80">
            The app hit an unexpected state. You can reload safely — your data is still stored remotely.
          </p>

          <button
            type="button"
            className="glass mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>

          {import.meta.env.DEV && this.state.error ? (
            <pre className="mt-4 overflow-auto rounded-xl bg-black/30 p-3 text-left text-xs">
              {String(this.state.error.stack || this.state.error.message)}
            </pre>
          ) : null}
        </div>
      </div>
    );
  }
}

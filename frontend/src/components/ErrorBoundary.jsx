import React from "react";

// Catches render-time errors so the app never shows a blank white screen.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("Prebunk error:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          background: "#faf9f6", fontFamily: "Inter, sans-serif", color: "#16151a", padding: 40, textAlign: "center"
        }}>
          <div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, marginBottom: 12 }}>
              Something went wrong.
            </div>
            <p style={{ color: "#6f6b75", maxWidth: 440, margin: "0 auto 20px", lineHeight: 1.6 }}>
              The interface hit an unexpected error. Reload the page to try again.
            </p>
            <button onClick={() => location.reload()} style={{
              border: "1px solid #16151a", background: "#16151a", color: "#faf9f6",
              borderRadius: 999, padding: "11px 22px", cursor: "pointer", fontFamily: "inherit"
            }}>
              Reload
            </button>
            <pre style={{ marginTop: 24, fontSize: 11, color: "#9c97a1", maxWidth: 560, whiteSpace: "pre-wrap", textAlign: "left" }}>
              {String(this.state.error && this.state.error.message)}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

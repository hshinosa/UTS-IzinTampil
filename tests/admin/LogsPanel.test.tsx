import { render, screen } from "@testing-library/react";
import {LogsPanel} from "../../app/components/LogsPanel";

describe("LogsPanel", () => {
  it("renders error logs", () => {
    const dummyLogs = [
      { time: "2025-11-09T08:00:00Z", message: "Dummy log 1" },
      { time: "2025-11-09T09:00:00Z", message: "Dummy log 2" },
    ];

    render(<LogsPanel logs={dummyLogs} />);

    expect(screen.getByText(/Dummy log 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Dummy log 2/i)).toBeInTheDocument();
  });
});

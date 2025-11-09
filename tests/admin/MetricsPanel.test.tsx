import { render, screen } from "@testing-library/react";
import MetricsPanel from "@/app/components/MetricsPanel";

const mockData = {
  uptime: "99.9%",
  clusterStatus: "Healthy",
  activeAlerts: 2,
  errorLogs: [
    { time: "2025-11-09T10:00:00Z", message: "Error connecting to DB" },
  ],
};

describe("MetricsPanel", () => {
  it("renders metrics correctly", () => {
    render(<MetricsPanel data={mockData} />);

    expect(screen.getByText(/Uptime: 99.9%/i)).toBeInTheDocument();
    expect(screen.getByText(/Cluster Status: Healthy/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Alerts: 2/i)).toBeInTheDocument();
  });
});

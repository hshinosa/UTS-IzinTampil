import { render, screen } from "@testing-library/react";
import MetricsPanel from "../../app/components/MetricsPanel";

describe("MetricsPanel", () => {
  it("renders metrics data correctly", () => {
    const dummyData = {
      uptime: "99.9%",
      clusterStatus: "Healthy",
      activeAlerts: 1,
    };

    render(<MetricsPanel data={dummyData} />);

    expect(screen.getByText(/Uptime: 99.9%/i)).toBeInTheDocument();
    expect(screen.getByText(/Cluster Status: Healthy/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Alerts: 1/i)).toBeInTheDocument();
  });
});

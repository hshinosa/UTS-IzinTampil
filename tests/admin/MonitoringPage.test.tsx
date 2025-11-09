import { render, screen, waitFor } from "@testing-library/react";
import MonitoringPage from "../../app/admin/monitoring/page";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      uptime: "99.9%",
      clusterStatus: "Healthy",
      activeAlerts: 0,
      errorLogs: [{ time: "08:00", message: "Dummy log" }],
    }),
  })
) as jest.Mock;

describe("MonitoringPage", () => {
  it("renders monitoring dashboard with metrics and logs", async () => {
    render(<MonitoringPage />);

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => screen.getByText(/Cluster Status: Healthy/i));
    expect(screen.getByText(/Uptime: 99.9%/i)).toBeInTheDocument();
    expect(screen.getByText(/Dummy log/i)).toBeInTheDocument();
  });
});

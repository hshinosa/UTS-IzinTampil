import { render, screen, waitFor } from "@testing-library/react";
import MonitoringPage from "@/app/admin/monitoring/page";

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        uptime: "99.9%",
        clusterStatus: "Healthy",
        activeAlerts: 2,
        errorLogs: [
          { time: "2025-11-09T10:00:00Z", message: "Error connecting to DB" },
        ],
      }),
  })
) as jest.Mock;

describe("MonitoringPage", () => {
  test("renders metrics and logs", async () => {
    render(<MonitoringPage />);

    await waitFor(() => {
      expect(screen.getByText(/Uptime: 99.9%/i)).toBeInTheDocument();
      expect(screen.getByText(/Cluster Status: Healthy/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Alerts: 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Error connecting to DB/i)).toBeInTheDocument();
    });
  });
});

import { render, screen } from "@testing-library/react";
import { MetricsData } from "@/app/api/metrics/route";
import MetricsPanel from "@/app/components/MetricsPanel";

const mockData: MetricsData = {
  appHealth: "ok",
  uptime: 123456,
  requests: 789,
  errorLogs: [
    { time: "2025-11-09T10:00:00Z", message: "Sample error log" }
  ]
};

describe("MetricsPanel", () => {
  it("renders metrics correctly", () => {
    render(<MetricsPanel data={mockData} />);
    
    // cek label
    expect(screen.getByText("Uptime")).toBeInTheDocument();
    expect(screen.getByText("Requests")).toBeInTheDocument();
    expect(screen.getByText("App Health")).toBeInTheDocument();
    
    // cek value
    expect(screen.getByText(mockData.uptime.toString())).toBeInTheDocument();
    expect(screen.getByText(mockData.requests.toString())).toBeInTheDocument();
    expect(screen.getByText(mockData.appHealth)).toBeInTheDocument();
  });
});

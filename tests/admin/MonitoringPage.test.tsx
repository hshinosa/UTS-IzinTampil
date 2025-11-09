import { render, screen, waitFor } from "@testing-library/react";
import MonitoringPage from "@/app/admin/monitoring/page";

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
            appHealth: "ok",
            uptime: 123456,
            requests: 789,
            errorLogs: [
                { time: "2025-11-09T10:00:00Z", message: "Sample error log" },
            ],
        }),
        statusText: "OK",
        headers: new Headers(),
        redirected: false,
        type: "basic",
        url: "",
        clone: () => this as any,
        body: null,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob(),
        formData: async () => new FormData(),
        text: async () => JSON.stringify({}),
    } as Response)
);


test("renders metrics and logs", async () => {
    render(<MonitoringPage />);
    await waitFor(() => {
        expect(screen.getByText(/App Health/i)).toBeInTheDocument();
        expect(screen.getByText(/Error Logs/i)).toBeInTheDocument();
    });
});

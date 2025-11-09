import { LogEntry } from "@/app/api/metrics/route";

interface LogsPanelProps {
  logs: LogEntry[];
}

export default function LogsPanel({ logs }: LogsPanelProps) {
  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-2">Error Logs</h2>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>
            {log.time} - {log.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

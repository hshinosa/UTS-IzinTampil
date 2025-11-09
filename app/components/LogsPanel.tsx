import { LogEntry } from "@/app/api/metrics/route";

interface LogsPanelProps {
  logs: LogEntry[];
}

export default function LogsPanel({ logs }: LogsPanelProps) {
  return (
    
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Error Logs
      </h1>
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
        {logs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No logs available.</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="py-2">
              <p className="text-sm text-gray-400">{log.time}</p>
              <p className="text-gray-900 dark:text-white">{log.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

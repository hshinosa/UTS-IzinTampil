type LogEntry = {
  time: string;
  message: string;
};

interface LogsPanelProps {
  logs: LogEntry[];
}

export function LogsPanel({ logs }: LogsPanelProps) {
  return (
    <ul>
      {logs.map((log, idx) => (
        <li key={idx}>{log.time} - {log.message}</li>
      ))}
    </ul>
  );
}

export default function LogsPanel({ logs }: { logs: any[] }) {
  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-800">
      <h2 className="font-semibold mb-2">Error Logs</h2>
      <ul className="list-disc pl-5">
        {logs.map((log, idx) => (
          <li key={idx}>{log.time} - {log.message}</li>
        ))}
      </ul>
    </div>
  );
}

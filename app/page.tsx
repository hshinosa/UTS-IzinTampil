import { Navbar } from "./components/Navbar";
import { StatisticsWithData } from "./components/StatisticsWithData";
import { TodoListWithData } from "./components/TodoListWithData";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      <main className="py-6">
        <StatisticsWithData />
        <TodoListWithData />
      </main>
    </div>
  );
}

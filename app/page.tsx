import { Navbar } from "./components/Navbar";
import { Statistics } from "./components/Statistics";
import { TodoList } from "./components/TodoList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      <main className="py-6">
        <Statistics />
        <TodoList />
      </main>
    </div>
  );
}

import { DiscoverChat } from "./DiscoverChat";

export const metadata = {
  title: "Discover | Daily Fictions",
  description: "Find films by chatting. Get a suggested room, pitch, and trailer—then add to a room in one step.",
};

export default function DiscoverPage() {
  return (
    <main className="px-4 py-12">
      <DiscoverChat />
    </main>
  );
}

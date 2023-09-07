import LeafletMap from "./components/LeafletMap";
import ListStates from "./components/ListStates";


export default function Home() {
  
  return (
    <main className="flex min-h-screen bg-astronaut-950">
      <ListStates />
      <LeafletMap />
    </main>
  )
}

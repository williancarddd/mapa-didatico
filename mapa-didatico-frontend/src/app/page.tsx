import ListStates from "./components/ListStates";
import MainMap from "./components/MainMap";


export default function Home() {
  
  return (
    <main className="flex min-h-screen bg-astronaut-950">
      <ListStates />
      <MainMap />
    </main>
  )
}

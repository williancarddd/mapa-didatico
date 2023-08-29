import LeafletMap from "./components/LeafletMap";
import SideBar from "./components/SideBar";


export default function Home() {
  
  return (
    <main className="flex min-h-screen bg-astronaut-950">
      <SideBar />
      <LeafletMap /> 
    </main>
  )
}

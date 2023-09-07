import { useAtom } from "jotai";
import atomStationSelected from "../atom/atomSationSelected";

export default function useStationSelected() {
    const [stationSelected, setStationSelected] = useAtom(atomStationSelected);

    return {
        setStationSelected, stationSelected
    }
}
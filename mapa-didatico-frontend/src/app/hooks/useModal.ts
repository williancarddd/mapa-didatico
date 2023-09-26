import { useAtom } from "jotai";
import atomModal from "../atom/atomModal";

export function useModal() {
    const [modal, setModal] = useAtom(atomModal);

    return {
        modal, setModal
    }
}
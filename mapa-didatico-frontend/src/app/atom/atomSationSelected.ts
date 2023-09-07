import { atom } from 'jotai'
import { IStation } from '../interfaces/IStation'

const atomStationSelected = atom<IStation | null>(null);
export default atomStationSelected;
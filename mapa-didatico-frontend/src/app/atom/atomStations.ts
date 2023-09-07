import { atom } from 'jotai'
import { IStation } from '../interfaces/IStation'

const atomStations = atom<IStation[]>([]);
export default atomStations;
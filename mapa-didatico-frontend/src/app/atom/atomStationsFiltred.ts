import { atom } from 'jotai'
import { IStation } from '../interfaces/IStation'

const atomStationsFiltred = atom<IStation[]>([]);
export default atomStationsFiltred;
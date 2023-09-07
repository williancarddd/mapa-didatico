import { atom } from 'jotai'
import { IStation } from '../interfaces/IStation'

const atomModal = atom<boolean>(false);
export default atomModal;
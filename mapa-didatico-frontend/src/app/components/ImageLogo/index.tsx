import Image from "next/image";
import logo from '../../../assets/android-chrome-512x512.png'


export default function ImageLogo() {return <Image src={logo} alt="logo" width={100} height={100} />}
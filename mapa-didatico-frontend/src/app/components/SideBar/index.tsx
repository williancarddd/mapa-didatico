import React from "react";
import logo from '../../../assets/android-chrome-512x512.png'
import Image from "next/image";

export default function SideBar() {

    return (

        <div className="flex flex-col w-2/12  bg-astronaut-900 rounded-xl m-4 g-4">
            <div className="flex flex-col items-center justify-center  w-full h-1/4 bg-astronaut-950">
                <Image src={logo} alt="logo" width={100} height={100} />
            </div>
            <div className="flex flex-col justify-center items-center m-4" >
                <p className="text-bold h-16  w-5/6 p-4 text-center bg-astronaut-700 text-white text-2xl rounded-xl justify-center items-center" >item</p>
            </div>
        </div>
      );
  
}
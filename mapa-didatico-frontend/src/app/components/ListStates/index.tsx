'use client';
import React, { useEffect, useState } from "react";
import logo from '../../../assets/android-chrome-512x512.png'
import Image from "next/image";
import ItemState from "./ItemState";
import useStation from "@/app/hooks/useStations";
import { IRegiaoAndState } from "@/app/interfaces/IRegiaoAndState";

export default function ListStates() {
    const [states, setStates] = useState<IRegiaoAndState[]>([]);
    const { getRegioesAndUfStorage } = useStation();

    function handleAddState() {
        const regioesAndUf = getRegioesAndUfStorage();
        setStates(regioesAndUf);
    }

    useEffect(() => {
        handleAddState();
    }, []);

    return (

        <div className="flex flex-col w-2/12  bg-astronaut-900 rounded-xl m-4 g-4 " >
            <div className="flex flex-col items-center justify-center  w-full h-1/4 bg-astronaut-950 ">
                <Image src={logo} alt="logo" width={100} height={100} />
            </div>
            <div className="h-96 overflow-y-auto">
                {
                    states.map((regiaoAndState, index) => (
                        <ItemState key={index} regiaoAndState={regiaoAndState} />
                    ))
                }
            </div>
        </div>
    );

}
import { IRegiaoAndState } from "@/app/interfaces/IRegiaoAndState"

interface PropsItemState {
    regiaoAndState: IRegiaoAndState;
}
export default function ItemState({ regiaoAndState }: PropsItemState) {
    return (
        <div className="flex flex-col justify-center items-center m-4 cursor-pointer" >
            <p className="text-bold h-16  w-5/6 p-4 text-center bg-astronaut-700 text-white text-2xl rounded-xl justify-center items-center" >{regiaoAndState.regiao}</p>
        </div>
    )
}
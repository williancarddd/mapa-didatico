import { IStation } from "@/app/interfaces/IStation"

interface PropStationInfo {
    station:IStation | null
}

export default function StationInfo({station}: PropStationInfo) {
    return (
        <>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left ">
                    <thead className="text-xs text-gray-700 uppercase bg-astronaut-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nome da Estacao
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Regiao
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Uf
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b ">
                            <th scope="row" className="px-4 py-4 font-medium whitespace-nowrap ">
                                {station?.estacao}
                            </th>
                            <td className="px-4 py-4">
                                {station?.regiao}
                            </td>
                            <td className="px-4 py-4">
                                {station?.uf}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}
import { IEstate, IRegionAndState } from "../interfaces/IRegionAndState";


export const estados: IEstate[] = [
    { regiao: 'CO', uf: 'DF' },
    { regiao: 'CO', uf: 'GO' },
    { regiao: 'CO', uf: 'MS' },
    { regiao: 'CO', uf: 'MT' },
    { regiao: 'NE', uf: 'AL' },
    { regiao: 'NE', uf: 'BA' },
    { regiao: 'NE', uf: 'CE' },
    { regiao: 'NE', uf: 'MA' },
    { regiao: 'NE', uf: 'PB' },
    { regiao: 'NE', uf: 'PE' },
    { regiao: 'NE', uf: 'PI' },
    { regiao: 'NE', uf: 'RN' },
    { regiao: 'NE', uf: 'SE' },
    { regiao: 'N', uf: 'AC' },
    { regiao: 'N', uf: 'AM' },
    { regiao: 'N', uf: 'AP' },
    { regiao: 'N', uf: 'PA' },
    { regiao: 'N', uf: 'RO' },
    { regiao: 'N', uf: 'RR' },
    { regiao: 'N', uf: 'TO' },
    { regiao: 'SE', uf: 'ES' },
    { regiao: 'SE', uf: 'MG' },
    { regiao: 'SE', uf: 'RJ' },
    { regiao: 'SE', uf: 'SP' },
    { regiao: 'S', uf: 'PR' },
    { regiao: 'S', uf: 'RS' },
    { regiao: 'S', uf: 'SC' },
];

export function getStatesbyRegion(regiao: string): IRegionAndState | undefined {
    const estadosPorRegiao = estados.filter((estado) => estado.regiao === regiao);
    if (estadosPorRegiao.length === 0) {
        return undefined;
    }

    return {
        regiao: regiao,
        estados: estadosPorRegiao.map((estado) => estado.uf),
    };
}


export function getRegion(estados:IEstate[]): IRegionAndState[] {
    const regioesUnicas = new Set<string>();
  
    estados.forEach((estado) => {
      regioesUnicas.add(estado.regiao);
    });
  
    const regioes = Array.from(regioesUnicas);

    const regioesComEstados = regioes.map((regiao) => ({
      regiao: regiao,
      estados: estados.filter((estado) => estado.regiao === regiao).map((estado) => estado.uf),
    }));
  
    return regioesComEstados;
  }
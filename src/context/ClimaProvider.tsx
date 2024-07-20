import axios from "axios";
import { ChangeEvent, useState } from "react";
import { createContext, PropsWithChildren } from "react";

interface BusquedaPayLoad {
    ciudad: string,
    pais: string
}

interface ResultadoAPI {
    name: string,
    main : {
        temp: number,
        tempmax: number,
        tempmin: number
    }
}

export interface ClimaContextProps {
    busqueda: BusquedaPayLoad,
    resultado : ResultadoAPI,
    actualizarDatosBusqueda: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ClimaContext = createContext<ClimaContextProps>({} as ClimaContextProps);

const ClimaProvider = ({children}: PropsWithChildren) => {

    const [busqueda, setBusqueda] = useState<BusquedaPayLoad>({
        ciudad: '',
        pais: ''    
    })

    const [resultado, setResultado] = useState<ResultadoAPI>({} as ResultadoAPI)

    const actualizarDatosBusqueda = (e : ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setBusqueda({
            ...busqueda,
            [e.target.name] : e.target.value
        })
    }


    const consultarClima = async (datos : BusquedaPayLoad) => {
        try {

            const { ciudad } = datos;
            const apiid = import.meta.env.VITE_API_KEY

            const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiid}`

            await axios.get(url)

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <ClimaContext.Provider
        value={{
            busqueda,
            resultado,
            actualizarDatosBusqueda,
            
        }}
        >
            {children}
        </ClimaContext.Provider>
    )
}

export { 
    ClimaProvider
};

export default ClimaContext;

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
        temp_max: number,
        temp_min: number
    }
}

export interface ClimaContextProps {
    busqueda: BusquedaPayLoad,
    resultado : ResultadoAPI,
    actualizarDatosBusqueda: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    consultarClima: (datos: BusquedaPayLoad) => void;
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


    const consultarClima = async (datos: BusquedaPayLoad) => {
        try {
            const { ciudad, pais } = datos;
            const appid = import.meta.env.VITE_API_KEY;
    
            const urlGeoLocalizacion = `https://api.openweathermap.org/geo/1.0/direct?appid=${appid}&q=${ciudad},${pais}`;
    
            const { data } = await axios.get(urlGeoLocalizacion);
    
            const { lat, lon } = data[0];
    
            const urlRequestClima = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appid}`;
            const { data: datosClima } = await axios.get(urlRequestClima);
    
            setResultado(datosClima)


        } catch (err) {
            console.log(err);
        }
    };
    

    

    return (
        <ClimaContext.Provider
        value={{
            busqueda,
            resultado,
            actualizarDatosBusqueda,
            consultarClima
            
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

"use client"
import { useState } from "react";
import {CustomMap} from "./map-component"
import { DirectionsService } from "@react-google-maps/api";

export default function TripCalculator() {
  let [map_center_lat, setMapCenterLat] = useState(-22.42556);
  let [map_center_lng, setMapCenterLng] = useState(-45.45278);
  let [directions, setDirections] = useState<google.maps.DirectionsResult>();

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // get the values of the form
    const city_one = (document.getElementById("cidade-saida") as HTMLInputElement).value;
    const city_two = (document.getElementById("cidade-chegada") as HTMLInputElement).value;
    
    // console.log(`directions: ${directions}`);
    // let city_one_latlng;  
    // let city_two_latlng;
      
    // const geocoder = new google.maps.Geocoder();
    // await geocoder.geocode({
    //   "address": "Itajubá, MG",
    //   "region": "BR"
    // }).then((response) => {
    //   try {
    //     if(response.results[0]){
    //       city_one_latlng = response.results[0].geometry.location;
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     return;
    //   }
    // });
    // console.log(city_one_latlng);

    // await geocoder.geocode({
    //   "address": "Maria da Fé, MG",
    //   "region": "BR"
    // }).then((response) => {
    //   try {
    //     if(response.results[0]){
    //       city_two_latlng = response.results[0].geometry.location;
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     return;
    //   }
    // });
    // console.log(city_two_latlng);

    // const directionsService = new google.maps.DirectionsService();
    // await directionsService.route(
    //   {
    //     origin: city_one_latlng!,
    //     destination: city_two_latlng!,
    //     travelMode: google.maps.TravelMode.DRIVING
    //   },
    //   (result, status) => {
    //     if (status === google.maps.DirectionsStatus.OK) {
    //       console.log(result);
    //       setDirections(result??undefined);
    //     } else {
    //       console.error(`error fetching directions ${result}`);
    //     }
    //   }
    // );
    // console.log(`directions: ${directions}`);
  }

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 border-t border-gray-800">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4">Pode comparar</h2>
            <p className="text-xl text-gray-400">Calcule o preço da viagem que você está planejando aqui mesmo! Veja o quão barata é a viagem com o nosso aplicativo e não se esqueça de todos os diferenciais que nosso app oferece!</p>
          </div>

          {/* Conteúdo da seção */}
          <div className="flex justify-center flex-col md:flex-row items-center h-screen md:h-96">

            {/* Mapa */}
            <div className="w-3/4 md:w-1/2 h-1/1 mb-5" id="map-renderer">
              <CustomMap
                center_lat={map_center_lat}
                center_lng={map_center_lng}
                directions={directions}
              />
            </div>

            {/* Formulário para cálculo */}
            <div className="w-3/4 md:w-1/2">
              <form onSubmit= {submitForm} className="max-w-md mx-auto bg-white shadow-md p-8 rounded">
              
                {/* Cidade origem */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cidade-saida">
                      Saída
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-green-500"
                      id="cidade-saida"
                      type="text"
                      placeholder = "Cidade de saída"
                    />
                </div>

                {/* Cidade chegada */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cidade-chegada">
                      Chegada
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:border-green-500"
                      id = "cidade-chegada"
                      type = "text"
                      placeholder = "Cidade de chegada"
                    />
                </div>

                {/* Botão para calcular */}
                <div className="flex items-center justify-center">
                    <button
                      className="text-white bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="submit"
                    >
                      Calcular
                    </button>
                </div>
              </form>

              {/* Exibição do preço */}
              <div className=" items-center my-5" hidden id="trip-cost-notice">
                <h3 className="h3 text-center">Preço da viagem:</h3>
                <p className="text-center">Apenas R$ <span id="trip-cost-value">0.00</span></p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
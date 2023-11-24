"use client"
import React, { useState, useRef, useMemo } from "react";
import { useLoadScript, GoogleMap, DirectionsRenderer, StandaloneSearchBox } from '@react-google-maps/api';

export default function TripCalculator() {
  let [map_center_lat, setMapCenterLat] = useState(-22.42556);
  let [map_center_lng, setMapCenterLng] = useState(-45.45278);
  let [directions, setDirections] = useState<google.maps.DirectionsResult>();

  const libraries = useMemo(() => ['places'], []);
  const mapCenter = { lat: map_center_lat, lng: map_center_lng };
  const inputRef = useRef<google.maps.places.SearchBox>();

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: false,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Pega os valores do formulário
    const city_one = (document.getElementById("cidade-saida") as HTMLInputElement).value;
    const city_two = (document.getElementById("cidade-chegada") as HTMLInputElement).value;
    
    // console.log(`directions: ${directions}`);
    let city_one_latlng;  
    let city_two_latlng;
    
    // Obtém as coordenadas da primeira cidade
    const geocoder = new google.maps.Geocoder();
    await geocoder.geocode({
      "address": city_one,
      "region": "BR"
    }).then((response) => {
      try {
        if(response.results[0]){
          city_one_latlng = response.results[0].geometry.location;
        }
      } catch (error) {
        console.log(error);
        return;
      }
    });
    // console.log(`city_one_latlng: ${city_one_latlng}`);

    // Obtém as coordenadas da segunda cidade
    await geocoder.geocode({
      "address": city_two,
      "region": "BR"
    }).then((response) => {
      try {
        if(response.results[0]){
          city_two_latlng = response.results[0].geometry.location;
        }
      } catch (error) {
        console.log(error);
        return;
      }
    });
    // console.log(`city_two_latlng: ${city_two_latlng}`);

    let distance:number;
    // obtém a rota entre as duas coordenadas
    const directionsService = new google.maps.DirectionsService();
    await directionsService.route(
      {
        origin: city_one_latlng!,
        destination: city_two_latlng!,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log(`result: ${result}`);
          if(result !== null){
            setDirections(result);
            distance = result.routes[0].legs[0].distance!.value;
          }
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
    // console.log(`directions: ${directions}`);

    // Função para calcular o preço
    // distance é retornada em metros
    // cálculo é feito com: distância (km) / eficiência média (km/L) * preço médio da gasolina (R$/L) * taxa
    const tripTotalCost = (distance! / 1000) / 12 * 5.5 * 1.1;

    // Exibe o custo da rota
    const tripCostNotice = document.querySelector("#trip-cost-notice");
    tripCostNotice?.removeAttribute("hidden");
    const tripCostValue = document.querySelector("#trip-cost-value");
    if(distance! !== undefined && tripCostValue !== null){
      tripCostValue.innerHTML = tripTotalCost.toFixed(2).toString();
    }

  }

  const handlePlaceChanged = () => {
    const [ place ] = inputRef.current!.getPlaces()??[];
    // if(place) { 
    //     console.log(place.formatted_address)
    //     console.log(place.geometry?.location?.lat())
    //     console.log(place.geometry?.location?.lng())
    // } 
  }
  /////////////////////////////////////////// 

  if (!isLoaded) {
    return <p>Loading...</p>;
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
              <GoogleMap
                options={mapOptions}
                zoom={10}
                center={mapCenter}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{ width: '100%', height: '100%', borderRadius: "5px" }}
                onLoad={() => console.log('Map Component Loaded.')}>
              {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </div>

            {/* Formulário para cálculo */}
            <div className="w-3/4 md:w-1/2">
              <form onSubmit= {submitForm} className="max-w-md mx-auto bg-white shadow-md p-8 rounded">
              
                {/* Cidade origem */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cidade-saida">
                      Saída
                    </label>
                    
                    {/* Caixa com sugestões de lugares. A bbox é um guia de onde as sugestões vêm, mas elas não são contidas nesse guia. A bbox passada aqui é um centro do Brasil */}
                    <StandaloneSearchBox
                      onLoad={ref => inputRef.current = ref}
                      onPlacesChanged={handlePlaceChanged}
                      bounds={{
                        north: 0,
                        south: -23.293940,
                        east: -37.951173,
                        west: -65.021486,
                      }}
                    >
                      <input
                          type="text"
                          placeholder="Cidade de saída"
                          id="cidade-saida"
                          className="form-control shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-green-500"
                      />
                    </StandaloneSearchBox>
                </div>

                {/* Cidade chegada */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cidade-chegada">
                      Chegada
                    </label>
                    
                    <StandaloneSearchBox
                      onLoad={ref => inputRef.current = ref}
                      onPlacesChanged={handlePlaceChanged}
                      bounds={{
                        north: 0,
                        south: -23.293940,
                        east: -37.951173,
                        west: -65.021486,
                      }}
                    >
                      <input
                          type="text"
                          placeholder="Cidade de chegada"
                          id="cidade-chegada"
                          className="form-control shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-green-500"
                      />
                    </StandaloneSearchBox>
                   
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
                <h3 className="text-2xl font-semibold text-center">Preço da viagem:</h3>
                <p className="text-center text-xl">
                  Apenas <span className="font-bold underline">R$ </span>
                  <span id="trip-cost-value" className="font-bold underline">0.00</span></p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
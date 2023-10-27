"use client"
import { useLoadScript, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import React, { useEffect, useMemo, useState } from 'react';
import { isContext } from 'vm';

type MapProps = {
  center_lat: number;
  center_lng: number;
  directions?: google.maps.DirectionsResult;
}

const CustomMap:React.FC<MapProps> = ({
  center_lat,
  center_lng,
  directions
}) => {
  const libraries = useMemo(() => ['places'], []);
  const mapCenter = { lat: center_lat, lng: center_lng };

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAMoPT67Uyxt_06O-RpTXWojVO2wuXoMQI" as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <GoogleMap
      options={mapOptions}
      zoom={10}
      center={mapCenter}
      mapTypeId={google.maps.MapTypeId.ROADMAP}
      mapContainerStyle={{ width: '100%', height: '100%', borderRadius: "5px" }}
      onLoad={() => console.log('Map Component Loaded.')}>
    <DirectionsRenderer directions={directions} />
    </GoogleMap>

  );
}

export {
  CustomMap
};
import React from 'react';
import {MapContainer, Marker, TileLayer} from "react-leaflet";
import {icon} from 'leaflet'
import "leaflet/dist/leaflet.css"
import {NextPage} from "next";

type Props = {
    latitude: number
    longitude: number
}

const DisplayMap: NextPage<Props> = ({latitude, longitude}) => {
    const ICON = icon({
        iconUrl: "/media/photos/marker-icon-2x.png",
        iconSize: [25, 41],
        iconAnchor: [12.5, 41]
    })

    return (
        <>
            <MapContainer style={{height: "300px"}} className="z-0 w-full rounded-lg shadow-lg border-neutral-500 border-[1px] border-dashed" center={[latitude, longitude]} zoom={18} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    subdomains={["mt1", "mt2", "mt3"]}
                />
                <Marker position={[latitude, longitude]} icon={ICON}/>
                </MapContainer>
        </>
    );
};

export default DisplayMap;
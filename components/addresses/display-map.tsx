import React, {useEffect, useState} from 'react';
import {MapContainer, Marker, TileLayer} from "react-leaflet";
import {icon} from 'leaflet'
import "leaflet/dist/leaflet.css"
import {NextPage} from "next";

type Props = {
    coordinates: string | null
}

const DisplayMap: NextPage<Props> = ({coordinates}) => {
    const [latitude, setLatitude] = useState(51.509865)
    const [longitude, setLongitude] = useState(-0.118092)
    const [notFound, setNotFound] = useState<boolean | null>(null)

    useEffect(() => {
        if(coordinates !== null){
            const [lat, lon] = coordinates.split(", ")
            if(lat !== undefined && lon !== undefined){
                setLatitude(Number(lat))
                setLongitude(Number(lon))
                setNotFound(false)
                return
            }
        }
        setNotFound(true)
    }, [coordinates])

    const ICON = icon({
        iconUrl: "/media/photos/marker-icon-2x.png",
        iconSize: [25, 41],
        iconAnchor: [12.5, 41]
    })

    return (
        <>
            {
                notFound !== null &&
                <div className="relative w-full">
                    {
                        notFound &&
                        <div className="p-8 bg-black rounded-lg absolute top-1/2 left-1/2 z-10 -translate-y-1/2 -translate-x-1/2 w-3/4 h-max flex flex-col items-center justify-center text-4xl">
                            <span className="text-neutral-100 text-center">Address Not Found on the Map</span>
                        </div>
                    }
                    <MapContainer style={{height: "300px"}} className="z-0 w-full rounded-lg shadow-lg border-neutral-500 border-[1px] border-dashed" center={[latitude, longitude]} zoom={18} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                            subdomains={["mt1", "mt2", "mt3"]}
                        />
                        <Marker position={[latitude, longitude]} icon={ICON}/>
                    </MapContainer>
                </div>
            }
        </>
    );
};

export default DisplayMap;
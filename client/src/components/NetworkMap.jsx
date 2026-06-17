import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { getSegments } from "../api/api";

const stations = {
    "Centrale": {x: 780, y: 380},
    "Porta Velaria": {x: 230, y: 210},
    "Crocevia del Falco": {x: 470, y: 180},
    "Piazza delle Lanterne": {x: 970, y: 580},
    "Borgo Sereno": {x: 30, y: 30},
    "Viale dei Mosaici": {x: 970, y: 180},
    "Fontana Oscura": {x: 720, y: 210},
    "Torre Cinerea": {x: 530, y: 410},
    "Campo dell'Eco": {x: 30, y: 410},
    "Arco Romano": {x: 470, y: 580},
    "Piazza del Popolo": {x: 280, y: 380},
    "Borgo Medioevale": {x: 530, y: 30}
}

function NetworkMap(props){
    const stationNames = Object.keys(stations);

    const navigate = useNavigate();

    const segments = props.segments;

    return(
        <div style={{ border: '2px solid black', width: '1150px', height: '600px', backgroundColor: '#e9ecef'}}>
            <svg width="100%" height="100%">
                <DrawSegments segments={segments} />
                <DrawStations stationNames={stationNames} />
            </svg>
        </div>
    )
}

function DrawStations(props){
    const stationNames = props.stationNames;

    return (
        <>
            {stationNames.map((name) => {
                const coords = stations[name];

                return (
                    <g key={name}>
                        <circle cx={coords.x} cy={coords.y} r="10" fill="white" stroke="black" strokeWidth="3" />
                        <text x={coords.x + 15} y={coords.y + 5} fontFamily="Arial" fontWeight="bold">{name}</text>
                    </g>
                );
            })}
        </>
    )
}

function DrawSegments(props){
    const segments = props.segments;

    return (
        <>
            {segments.map((segment) => {
                if (segment.active == 1){
                    const p1 = stations[segment.station1];
                    const p2 = stations[segment.station2];

                    const key = `${segment.station1} - ${segment.station2}`;

                    return (
                        <line key={key} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={segment.color} strokeWidth="6" />
                    );
                }
                return null;
            })}
        </>
    )
}

export {NetworkMap}
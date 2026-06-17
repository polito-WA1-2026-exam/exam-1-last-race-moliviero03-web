import { Segment } from "../models/Models.js";

async function getSegments() {
    try{
        const resp = await fetch('http://localhost:3001/api/segments');

        if (resp.ok){
            const segments_list = await resp.json();
            return segments_list;
        }
        else{
            throw new Error("HTTP error in getSegments, code=" + resp.status);
        }
    }
    catch (ex){
        throw new Error("Network error", { cause: ex })
    }
}

async function getPlayers() {
    try{
        const resp = await fetch('http://localhost:3001/api/players');

        if (resp.ok){
            const players_list = await resp.json();
            return players_list;
        }
        else{
            throw new Error("HTTP error in getPlayers, code=" + resp.status);
        }
    }
    catch (ex){
        throw new Error("Network error", { cause: ex })
    }
}

export {getSegments, getPlayers}
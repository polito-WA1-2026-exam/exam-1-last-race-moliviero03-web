async function getLines() {
    try{
        const resp = await fetch('http://localhost:3001/api/lines', {
            credentials: 'include'
        });

        if (resp.ok){
            const lines_list = await resp.json();
            return lines_list;
        }
        else{
            throw new Error("HTTP error in getLines, code=" + resp.status);
        }
    }
    catch (ex){
        throw new Error("Network error", { cause: ex });
    }
}

async function getSegments() {
    try{
        const resp = await fetch('http://localhost:3001/api/segments', {
            credentials: 'include'
        });

        if (resp.ok){
            const segments_list = await resp.json();
            return segments_list;
        }
        else{
            throw new Error("HTTP error in getSegments, code=" + resp.status);
        }
    }
    catch (ex){
        throw new Error("Network error", { cause: ex });
    }
}

async function getStations() {
    try{
        const resp = await fetch('http://localhost:3001/api/stations', {
            credentials: 'include'
        });

        if (resp.ok){
            const stations_list = await resp.json();
            return stations_list;
        }
        else{
            throw new Error("HTTP error in getStations, code=" + resp.status);
        }
    }
    catch (ex){
        throw new Error("Network error", { cause: ex });
    }
}

async function getEvents() {
    try{
        const resp = await fetch('http://localhost:3001/api/events', {
            credentials: 'include'
        });

        if (resp.ok){
            const event_list = await resp.json();
            return event_list;
        }
        else{
            throw new Error("HTTP error in getEvents, code=" + resp.status);
        }
    }
    catch (ex){
        throw new Error("Network error", { cause: ex });
    }
}

async function getPlayers() {
    try{
        const resp = await fetch('http://localhost:3001/api/players', {
            credentials: 'include'
        });

        if (resp.ok){
            const players_list = await resp.json();
            return players_list;
        }
        else{
            throw new Error("HTTP error in getPlayers, code=" + resp.status);
        }
    }
    catch (ex){
        throw new Error("Network error", { cause: ex });
    }
}

async function updateScore(score) {
    try{
        const resp = await fetch('http://localhost:3001/api/score', {
            method: 'PATCH',
            body: JSON.stringify({ score: score }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (resp.ok){
            return true;
        }
        else{
            throw new Error("HTTP error in updateScore, code=" + resp.status);
        }
    }
    catch (ex){
        throw new Error("Network error", { cause: ex });
    }
}

export {getLines, getSegments, getStations, getEvents, getPlayers, updateScore}
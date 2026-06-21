const terminate = (route, startAndFinish, setRoute, navigate) => {
  const valid = validate(route, startAndFinish);
  if (valid === false){
    navigate('/result');
  }
  else{
    setRoute(route);
    navigate('/execution');
  }
}

const getRandomStation = (station_list, segment_list) => {
  const graph = createGraph(station_list, segment_list)

  while(true){
    const idx1 = Math.floor(Math.random() * station_list.length);
    const begin_station = station_list[idx1];

    const remaining_stations = station_list.filter((station, index) => index != idx1);

    const idx2 = Math.floor(Math.random() * remaining_stations.length);
    const end_station = remaining_stations[idx2];

    if (check(graph, [begin_station, end_station])){
      return [begin_station, end_station];
    }
  }
}

const shuffle = (list) => {
  const newList = [...list];
  for (let i = newList.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [newList[i], newList[j]] = [newList[j], newList[i]];
  }
  return newList;
}

const createGraph = (stations, segments) => {
  const graph = {};

  for (const stat of stations){
    graph[stat] = [];
  }

  for (const seg of segments){
    graph[seg.station1].push(seg.station2);
    graph[seg.station2].push(seg.station1);
  }

  return graph;
}

const check = (graph, startAndFinish) => {
  const start = startAndFinish[0];
  const finish = startAndFinish[1];

  const visited = [start];
  const to_visit = [start];

  const dist = {};
  dist[start] = 0;

  while(to_visit.length > 0) {
    const curr = to_visit.shift();
    
    if (curr === finish){
      break;
    }

    for (let e of graph[curr]){
      if (!visited.includes(e)){
        visited.push(e);
        to_visit.push(e);
        dist[e] = dist[curr] + 1;
      }
    }
  }

  return dist[finish] !== undefined && dist[finish] > 2;
}

/*
const validate = (route, startAndFinish) => {
  let r = [...route];

  const start = startAndFinish[0];
  const finish = startAndFinish[1];

  const count = {}
  for (let seg of route){
    count[seg.station1] = (count[seg.station1] || 0) + 1;
    count[seg.station2] = (count[seg.station2] || 0) + 1;
  }
  if (!Object.keys(count).includes(start) || !Object.keys(count).includes(finish)) return false;
  for (let [stat, freq] of Object.entries(count)){
    if ((freq%2 == 1) && stat !== start && stat !== finish) return false;
    if ((freq%2 == 0) && (stat === start || stat === finish)) return false;
  }

  let fr = [];
  let visited = [];

  let curr = start;

  while (r.length > 0){
    let flag = false;
    for (let seg of r){
      if (seg.station1 === curr || seg.station2 === curr){
        curr = seg.station1 === curr ? seg.station2 : seg.station1;
        r = r.filter(s => !(s.station1 === seg.station1 && s.station2 === seg.station2));
        fr.push(seg);
        flag = true;
        r = r.concat(visited);
        visited = []
        break;
      }
    }

    if (flag === false){
      let lastSeg = fr.pop();
      curr = lastSeg.station1 === curr ? lastSeg.station2 : lastSeg.station1;
      visited.push(lastSeg);
    }
  }

  return fr;
}
*/

const validate = (route, startAndFinish) => {
  if (!route || route.length === 0) return false;

  const start = startAndFinish[0];
  const finish = startAndFinish[1];

  let currStat = start;

  for (let seg of route){
    if (seg.station1 === currStat || seg.station2 === currStat){
      currStat = seg.station1 === currStat ? seg.station2 : seg.station1;
    }
    else{
      return false;
    }
  }

  if (currStat !== finish) return false;

  return true;
}

const getStartAndFinish = (route) => {
    const firstSeg = route[0];
    const secondSeg = route[1];

    const almostLastSeg = route[route.length-2];
    const lastSeg = route[route.length -1];

    const start = (firstSeg.station1 !== secondSeg.station1 && firstSeg.station1 !== secondSeg.station2) ? firstSeg.station1 : firstSeg.station2;
    const finish = (lastSeg.station1 !== almostLastSeg.station1 && lastSeg.station1 !== almostLastSeg.station2) ? lastSeg.station1 : lastSeg.station2;

    return [start, finish];
}

const getRandomEvent = (events) => {
    return events[Math.floor(Math.random() * events.length)];
}

export { terminate, getRandomStation, shuffle, getStartAndFinish, getRandomEvent}
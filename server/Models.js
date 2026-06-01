function Player(username, bestScore){
    this.username = username;
    this.best_score = bestScore === null ? 0 : bestScore;
}

function Segment(station1, station2){
    this.station1 = station1;
    this.station2 = station2;
}

function Line(lineNumber, segments){
    this.lineNumber = lineNumber;
    this.segments = segments;
}

function Event(description, effect){
    this.description = description;
    this.effect = effect;
}

export {Player, Segment, Line, Event}
// Given a directed graph, design an algorithm to find out whether there is a route between two nodes.

(function(){
    'use strict';

    var samplegraph = {
            "A":["B"],
            "B":["C"],
            "C":["D"],
            "D":["F"],
            "E":["F"],
            "F":["A"]
        };
    
    function notchecked(item, visited){
        for (var i = 0; i<visited.length; i++){
            if (item === visited[i]){
                return false;
            }
        }
        return true;
    }
    
    function doesRouteExist (graph, origin, dest){
        var visited = (arguments.length === 4)?arguments[3]:[];
        console.log(visited);
        var len = graph[origin].length;
        visited.push(origin);
        for (var i = 0; i<len; i++){
            console.log(i + ". origin: "+origin+"\n");
            if (graph[origin][i] === dest){
                return true;
            }else if (notchecked(graph[origin][i], visited) && doesRouteExist(graph, graph[origin][i], dest, visited)){
                return true;
            }
        }
        return false;
    }
    
    console.log((doesRouteExist(samplegraph, "A", "E"))?"super possible":"less possible");
    
    
})();
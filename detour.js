//Calculate the detour distance between two different rides. Given four latitude / longitude pairs, where driver one is traveling from point A to point B and driver two is traveling from point C to point D, write a function (in your language of choice) to calculate the shorter of the detour distances the drivers would need to take to pick-up and drop-off the other driver.

(function(path1, path2){
    
    //Checks that there are at least 2 arguments
    var inputValid = (arguments.length > 1) ? true : false;
    var point1;
    var point2;
    
    //Checks that all accessed properties are defined, does not validate lat/long values.
    function isValidInput (pathobj){
        if ((typeof pathobj == "object") && checkProp(pathobj, 'origin') && checkProp(pathobj, 'dest')){
            point1 = pathobj.origin && checkProp(pathobj.origin, 'lat') && checkProp(pathobj.origin, 'long');
            point2 = pathobj.dest && checkProp(pathobj.dest, 'lat') && checkProp(pathobj.dest, 'long')
            if (point1 && point2) return true;
        }
        return false;
    }
    
    //Checks if a property exists
    function checkProp (object, property){
        return ({}).hasOwnProperty.call(object, property);
    }
    
    //Checks all the arguments against isValidInput function
    for (var c = 0; c<arguments.length; c++){
        if (!isValidInput(arguments[c])) inputValid = false;
    }
    
    //Complains if isValidInput returned a false or there were fewer than 2 arguments
    if (!inputValid) console.log("Bad inputs.");
    if (inputValid) findAndOutputShortestPath(arguments, pathCombinations);
    
    function findAndOutputShortestPath(routes){
        var paths = findAllPaths(routes);
        getStreetPaths(paths);
    }
    
    var pathCombinations;
    function findAllPaths(routes){
        var paths = {};
        var usableNodes = [];
        pathCombinations = [];

        function searchOptions(nodes, oldNode, path){    
            var pathId;
            var currentNode;

            if(nodes.length === 0) {
                path.push(oldNode.id + oldNode.pickupordrop + "," + path[0][0]+"dest");
                pathCombinations.push(path);
                paths[oldNode.id + oldNode.pickupordrop + "," + path[0][0] + "dest"] = {
                    "origin": routes[oldNode.id][oldNode.pickupordrop], 
                    "dest": routes[path[0][0]]["dest"]
                }
            }
            
            for (var i = 0; i<nodes.length; i++){

                pathId = oldNode.id + oldNode.pickupordrop + "," + nodes[i].id + nodes[i].pickupordrop;
                path.push(pathId);
                if(!paths[pathId]){
                    paths[pathId] = {
                        "origin": routes[oldNode.id][oldNode.pickupordrop], 
                        "dest": routes[nodes[i].id][nodes[i].pickupordrop]
                    }
                }

                currentNode = {
                    "id": nodes[i].id,
                    "pickupordrop": nodes[i].pickupordrop
                }

                if(nodes[i].pickupordrop == "dest"){
                    nodes.splice(i, 1);
                    i--;
                }

                if(nodes[i] && nodes[i].pickupordrop == "origin") nodes[i].pickupordrop = "dest";

                searchOptions(nodes.slice(), currentNode, path);

            }
            
            return {
                "id": oldNode.id,
                "pickupordrop": oldNode.pickupordrop
            }
        }

        for (var i = 0; i<routes.length; i++){
            usableNodes.push({
                "id": i,
                "pickupordrop": "origin"
            });   
        }

        for (var i = 0; i<routes.length; i++){
            searchOptions(usableNodes.slice(0, i).concat(usableNodes.slice(i+1)), {
                "id": i,
                "pickupordrop": "origin"
            }, []);   
        }
        return paths;
    }
    
    function getStreetPaths (paths){
        var request = require('request');

        //Compiles the URL address that needs to be passed into the request
        var key = "";  //key=AIzaSyA6BO6cgT1A2aKelSLNnksdVOMiIniXyLs
        var requestAddress = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=";
        var requestedPaths = {};
        
        function requestAddressOf(origin, dest){
            if (key) key = "&key=" + key;
            if (origin && dest) return requestAddress + origin + "&destinations=" + dest + "&mode=driving" + key;
            return false;
        }
        
        function alreadyExists(k){
            if (requestedPaths[k]) return true;
            if (requestedPaths[k.split(",").reverse().join(",")]) return true;
            return false;
        }
                
        Object.keys(paths).forEach(function(k){
            var origin = paths[k].origin.lat + "," + paths[k].origin.long;
            var dest = paths[k].dest.lat + "," + paths[k].dest.long;
            var requestAddress = requestAddressOf(origin, dest);
            if(requestAddress && !alreadyExists(k)){
                requestedPaths[k] = true;
                (function(k){
                    request(requestAddress, handleStreetPaths.bind(undefined, k));
                })(k);   
            }
        });
        requestCount = Object.keys(requestedPaths).length;
    }
    
    var streetPaths = {};
    function handleStreetPaths(k, error, response, body){
        callCount++;
        function makePathObj(d){
            return {
                "dest" : d.destination_addresses,
                "origin" : d.origin_addresses,
                "distance" : d.rows[0].elements[0].distance.value
            }
        }
        
        if (!error && response.statusCode == 200) {
            var d = JSON.parse(body);
            streetPaths[k] = makePathObj(d);
        }
        findShortestDetour();
    }
    
    var callCount = 0;
    var requestCount;
    var recievedExpectedResponses = false;
    var foundExpectedData = false;
    
    function requestsComplete(){
        recievedExpectedResponses = callCount >= requestCount;
        foundExpectedData = Object.keys(streetPaths).length >= requestCount;
        if (recievedExpectedResponses && foundExpectedData) return true;
        if (recievedExpectedResponses && !foundExpectedData) console.log("Bad responses.");
        return false;
    }
    
    function findShortestDetour(){
        function getStreetDistance(i, step){
            var pathName = pathCombinations[i][step];
            if (streetPaths[pathName]) return streetPaths[pathName];
            if (streetPaths[pathName.split(",").reverse().join(",")]) return streetPaths[pathName.split(",").reverse().join(",")];
            return false;
        }
        
        if (requestsComplete()){
            var pathDistance;
            var edge;
            var shortestDistance;
            
            for (var i = 0; i<pathCombinations.length; i++){
                pathDistance = 0;
                for (var step = 0; step<pathCombinations[i].length; step++) {
                    edge = getStreetDistance(i, step);
                    pathDistance += edge.distance;
                    if (step === 0) console.log(i + ":\n Origin: " + edge.origin);
                }
                console.log("Destination: " + edge.dest);
                console.log("Total Distance: " + pathDistance + "\n");
                if ((typeof shortestDistance === 'undefined') || pathDistance < shortestDistance) shortestDistance = pathDistance;
            }
            
            console.log("Shortest Distance: " + shortestDistance);
        }
    }    
     
})(
    {
        origin:{
            lat: 37.7833,
            long: -122.4167
        },
        dest:{
            lat: 37.7843,
            long: -122.4197
        }
    },
    {
        origin:{
            lat: 37.7833,
            long: -122.4267
        },
        dest:{
            lat: 37.7833,
            long: -122.4167
        }
    }
)
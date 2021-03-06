// Given a sorted (increasing order) array, write an algorithm to create a binary tree with minimal height.

(function(){

    'use strict';
    
    var createTree = function(){
        var sampleArray = [];

        for (var i= 0; i<10; i++) sampleArray.push(Math.random()*100);

        sampleArray.sort(function(a, b) {
            return a-b;
        });
        
        return createNodes(sampleArray);
    }
        
    var createNodes = function (a){
        var len = a.length;
        var midpoint = (len-len%2)/2;
        var sol = [];
        sol.push(a[midpoint]);
        
        if (len >= 3){
            sol.push(createNodes(a.slice(0, midpoint-1)));
            sol.push(createNodes(a.slice(midpoint, len)));
        }
        
        return sol;
    }
    
    module.exports = createTree;
})();
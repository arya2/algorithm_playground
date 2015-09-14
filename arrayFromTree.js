// Given a binary search tree, design an algorithm which creates a linked list of all the nodes at each depth (i.e., if you have a tree with depth D, you’ll have D linked lists).

var sampleTree = require("./BSTgenerator")();

var createList = function (tree){
    var lists = [];
            
    (function getChildren(node){
        var len = node.length;
        var hasChildren = (len > 1)?true:false;
        var depth = arguments[1] + 1 || 1;
        if (!lists[depth]) lists[depth]=[];
        lists[depth].push(node[0])
        
        if(hasChildren){
            for (var i = 1; i<len; i++){
                getChildren(node[i], depth);
            }
        }
    })(tree);
    
    return lists;
}

var list = createList(sampleTree);

for (var i = 0, len = list.length; i<len; i++) console.log(list[i]);
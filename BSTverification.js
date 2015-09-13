// Implement a function to check if a tree is balanced. For the purposes of this question, a balanced tree is defined to be a tree such that no two leaf nodes differ in distance from the root by more than one.

(function(){
    'use strict';
    
    var sampleTree = [
        1,
        [
            2,
            [
                4,
                [
                    12,
                    [
                        1
                    ],
                    [
                        2,
                        [
                            1
                        ],
                        [
                            2
                        ]
                    ]
                ],
                [
                    8
                ]
            ],
            [
                5,
                [
                    9
                ],
                [
                    9
                ]
            ]
        ],
        [           
            3,
            [
                6,
                [
                    9
                ],
                [
                    9
                ]
            ],
            [
                7,
                [
                    9
                ],
                [
                    9
                ]
            ]
        ]
    ]
    
    var createChildren = function(tree) {
        var children = [];
        
        (function getChildren(node){
            var len = node.length;
            var hasChildren = (len > 1)?true:false;
            var depth = arguments[1] + 1 || 1;

            if(hasChildren){
                for (var i = 1; i<len; i++){
                    getChildren(node[i], depth);
                }
            }else if(len === 1){
                children.push(depth)
            }
        })(tree);
        
        return {
            isBalanced: function() {
                var len = children.length;
                var isEqual = [];
                var isMore = [];
                var isLess = [];
                var standardDepth = children[0];
                for (var i = 0; i<len; i++){
                    if (children[i] === standardDepth){
                        isEqual.push(true);
                    }else if(children[i] === (standardDepth - 1)){
                        isLess.push(true);
                    }else if(children[i] === (standardDepth + 1)){
                        isMore.push(true);
                    }else{
                        return false;
                    }
                }
                if (isMore.length && isLess.length){
                    return false;
                }                
                return true;
            },
            getChildren: function (){
                return children;
            }
          }
    }
    
    var children = createChildren(sampleTree);
    
    console.log(children.isBalanced())

})();
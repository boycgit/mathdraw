import Tree, {TreeNode, ComponentNode, SEARCH_BFS, SEARCH_DFS} from './tree'
import {expect} from 'chai'

// var tree = new Tree({'hello': 'world'},'root');
function factoryNameData(data, isObj){
    return isObj ? {name: data} : data;
}
function createBaseTree(isObj){
    let root = new ComponentNode(factoryNameData('one', isObj));
    let tree = new Tree(root);
    tree._root.children.push(new ComponentNode(factoryNameData('two', isObj)));
    tree._root.children[0].parent = tree;
     
    tree._root.children.push(new ComponentNode(factoryNameData('three', isObj)));
    tree._root.children[1].parent = tree;
     
    tree._root.children.push(new ComponentNode(factoryNameData('four', isObj)));
    tree._root.children[2].parent = tree;
     
    tree._root.children[0].children.push(new ComponentNode(factoryNameData('five', isObj)));
    tree._root.children[0].children[0].parent = tree._root.children[0];
     
    tree._root.children[0].children.push(new ComponentNode(factoryNameData('six', isObj)));
    tree._root.children[0].children[1].parent = tree._root.children[0];
     
    tree._root.children[2].children.push(new ComponentNode(factoryNameData('seven', isObj)));
    tree._root.children[2].children[0].parent = tree._root.children[2];

    tree._root.children[0].children[1].children.push(new ComponentNode(factoryNameData('eight', isObj)));
    tree._root.children[0].children[1].children[0].parent = tree._root.children[0].children[1];

    return tree;
    /*
        creates this tree
        one
        ├── two
        │   ├── five
        │   └── six
        │       └── eight
        ├── three
        └── four
            └── seven
        
        */
}


function traverseCount(tree, data, expected, type = SEARCH_BFS){
    let countAuto = 0;
    Tree.traverse(tree._root, (node)=>{
        countAuto++;
        return node.data === data;
    }, type);
    expect(countAuto).to.equal(expected); // 挨个测试
};

var tests = {

    init: function() {
        let node = new ComponentNode('one');
        console.log('%O', node, node.id);
        expect(node instanceof TreeNode).to.be.true;
        expect(node.id.indexOf('$')).to.equal(0);
        
        this.testBFS();
        this.testDFS();
        this.testAutoBreak();
        this.testAddNode();
        this.testRemoveNode();

        // 测试 map 方法
        this.testTreeMap();
        this.testTreeMap(true);

        // 测试 clone 方法
        this.testCloneTree();
        this.testCloneTree(true);

    },


    // 测试广度优先搜索
    testBFS: () => {
        let tree = createBaseTree();
        expect(tree._root.data).to.equal('one');

        // 第一种方式，使用静态方法
        let result = [];
        Tree.traverseBFS(tree._root, (node)=>{
            result.push(node.data);
        });
        expect(result).to.deep.equal(["one", "two", "three", "four", "five", "six", "seven", "eight"]);

        // 第二种方式，使用内置的方法，两者方式应该是等效的
        let result2 = [];
        tree.traverse(node =>{
            result2.push(node.data);
        });

        expect(result2).to.deep.equal(result);
    },
   
    // 测试广度优先搜索
    testDFS: () => {
        let tree = createBaseTree();
        expect(tree._root.data).to.equal('one');

        // 第一种方式，使用静态方法
        let result = [];
        Tree.traverseDFS(tree._root, (node)=>{
            result.push(node.data);
        });

        expect(result).to.deep.equal(["one", "two", "five", "six", "eight", "three", "four", "seven"]);

        // 第二种方式，使用内置的方法，两者方式应该是等效的
        let result2 = [];
        tree.traverse(node =>{
            result2.push(node.data);
        }, SEARCH_DFS);

        expect(result2).to.deep.equal(result);
    },

    // 测试搜索条件 break；减少计算数量
    testAutoBreak: ()=>{
        let tree = createBaseTree();

        // scene：不自动 break;
        // 第一种方式，使用静态方法
        let count = 0;
        Tree.traverseBFS(tree._root, (node)=>{
            count++;
        });
        expect(count).to.equal(8); // 迭代次数是节点个数次

        // 第二种方式，使用静态方法
        count = 0;
        Tree.traverseDFS(tree._root, (node)=>{
            count++;
        });
        expect(count).to.equal(8); // 迭代次数是节点个数次

        // scene：自动 break; 能及时 break;
        traverseCount(tree, 'one', 1);
        traverseCount(tree, 'two', 2);
        traverseCount(tree, 'three', 3);
        traverseCount(tree, 'four', 4);
        traverseCount(tree, 'five', 5);
        traverseCount(tree, 'six', 6);
        traverseCount(tree, 'seven', 7);
        traverseCount(tree, 'eight', 8);

        traverseCount(tree, 'one', 1, SEARCH_DFS);
        traverseCount(tree, 'two', 2, SEARCH_DFS);
        traverseCount(tree, 'three', 6, SEARCH_DFS);
        traverseCount(tree, 'four', 7, SEARCH_DFS);
        traverseCount(tree, 'five', 3, SEARCH_DFS);
        traverseCount(tree, 'six', 4, SEARCH_DFS);
        traverseCount(tree, 'seven', 8, SEARCH_DFS);
        traverseCount(tree, 'eight', 5, SEARCH_DFS);
    },

    // 增加树节点
    testAddNode: () =>{
        let nodes = [
            new ComponentNode('one'),
            new ComponentNode('two'),
            new ComponentNode('three'),
            new ComponentNode('four'),
            new ComponentNode('five'),
            new ComponentNode('six'),
            new ComponentNode('seven'),
            new ComponentNode('eight')
        ];
        let tree = new Tree(nodes[0]);
        tree.add(nodes[1], nodes[0]);
        tree.add(nodes[2], nodes[0]);
        tree.add(nodes[3], nodes[0]);

        tree.add(nodes[4], nodes[1]);
        tree.add(nodes[5], nodes[1]);

        tree.add(nodes[6], nodes[3]);

        tree.add(nodes[7], nodes[5]);

        // 深度递归测试一把
        let result = [];
        Tree.traverseDFS(tree._root, (node)=>{
            result.push(node.data);
        });

        expect(result).to.deep.equal(["one", "two", "five", "six", "eight", "three", "four", "seven"]);
         
    },
    
    testRemoveNode: ()=>{
        let nodes = [
            new ComponentNode('one'),
            new ComponentNode('two'),
            new ComponentNode('three'),
            new ComponentNode('four'),
            new ComponentNode('five'),
            new ComponentNode('six'),
            new ComponentNode('seven'),
            new ComponentNode('eight')
        ];

        let tree = new Tree(nodes[0]);
        tree.add(nodes[1], nodes[0]);
        tree.add(nodes[2], nodes[0]);
        tree.add(nodes[3], nodes[0]);

        tree.add(nodes[4], nodes[1]);
        tree.add(nodes[5], nodes[1]);

        tree.add(nodes[6], nodes[3]);

        tree.add(nodes[7], nodes[5]);

        // 移除节点 two
        let removedNode = tree.remove(nodes[1], nodes[0]);
        expect(removedNode.data).to.equal('two');

        // 深度递归测试一把
        let result = [];
        Tree.traverseDFS(tree._root, (node)=>{
            result.push(node.data);
        });
        expect(result).to.deep.equal(["one", "three", "four", "seven"]);  
    },

    testTreeMap: (isObj)=>{
        let tree = createBaseTree(isObj);
        
        const callback = function(node){
            let newNode = {}
            if(isObj){
                newNode.data = {};
                newNode.data.name = node.data.name + 2;
            } else {
                newNode.data = node.data + 2;
            }
            return new TreeNode(newNode.data);  // 返回新的树节点
        };

        let newTreeNode = Tree.map(tree._root, callback);

        // 深度递归测试一把
        let result = [];
        Tree.traverseDFS(newTreeNode, (node)=>{
            result.push(isObj ? node.data.name : node.data);
        });

        // console.log('newTreeNode:', newTreeNode);
        
        expect(result).to.deep.equal(["one2", "two2", "five2", "six2", "eight2", "three2", "four2", "seven2"]);

        // 原始树没有变更过
        let result2 = [];
        Tree.traverseDFS(tree._root, (node)=>{
            result2.push(isObj ? node.data.name : node.data);
        });
        expect(result2).to.deep.equal(["one", "two", "five", "six", "eight", "three", "four", "seven"]);
        // console.log('original Tree:', tree._root);
        

        // 也可以调用实例方法
        let newTree = tree.map(callback);
        let result3 = [];
        Tree.traverseDFS(newTree._root, (node)=>{
            result3.push(isObj ? node.data.name : node.data);
        });
        expect(result3).to.deep.equal(result); // 调用实例方法和调用静态方法结果应该一致
        
    },

    testCloneTree: (isObj)=>{
        let tree = createBaseTree(isObj);
        
        const cloneFunction = function(node){
            return node.clone();  // 返回新的树节点
        };

        let newTreeNode = Tree.clone(tree._root, cloneFunction);

        // 原始树的更改不会引起变更后树的数据
        let result = [];
        Tree.traverseDFS(tree._root, (node)=>{
            // 更改原树的结果
            if(isObj) {
                node.data.name += '_oo';
            } else {
                node.data += '_oo';
            }
            
            result.push(isObj ? node.data.name : node.data);
        });

        // 对 clone 树深度递归测试一把
        let result2 = [];
        Tree.traverseDFS(newTreeNode, (node)=>{
            result2.push(isObj ? node.data.name : node.data);
        });

        // console.log('newTreeNode:', newTreeNode);
        expect(result).to.deep.equal(["one_oo", "two_oo", "five_oo", "six_oo", "eight_oo", "three_oo", "four_oo", "seven_oo"]);

        // 原始树的更改不会引起变更后树的数据
        expect(result2).to.deep.equal(["one", "two", "five", "six", "eight", "three", "four", "seven"]);
        

        // 也可以调用实例方法
        let newTree = tree.clone();
        let result3 = [];
        Tree.traverseDFS(newTree._root, (node)=>{
            result3.push(isObj ? node.data.name : node.data);
        });
        expect(result3).to.deep.equal(result); // 调用实例方法和调用静态方法结果应该一致
    },

}

export default tests; 
// console.log('tree', tree);
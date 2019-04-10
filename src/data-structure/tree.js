import {uuid, invariant, isExist, isFunction} from '../lib/util';
import {cloneDeep} from 'lodash';
import Queue from './queue';
import Stack from './stack'


class TreeNode {
    constructor(data, id, parent, children) {
        this.id = id || this.idRule(); // 根据 name 生成随机id
        this.data = data;
        this.parent = parent || null;
        this.children = children || [];
    }

    idRule() {
        let uid = uuid();
        return `${uid}`;
    }

    static is(node) {
        return node instanceof TreeNode; // 判断是否是节点类型
    }
    // 只对值进行深拷贝
    static clone(node){
        const{
            data, id, parent, children
        } = node;
        return new TreeNode(cloneDeep(data), id, parent, children);
    }
    clone(){
        return TreeNode.clone(this);
    }
    print(){
        return `id: ${this.id}, data: ${JSON.stringify(this.data)}, parentId: ${this.parent && this.parent.id}`;
    }
}


class ComponentNode extends TreeNode {
    constructor(data, id){
        super(data, id);
    }

    // 覆盖基类的 id 生成规则
    idRule(){
        let uid = uuid();
        return `$${uid}`;  
    }
}



// 数据结构：https://code.tutsplus.com/zh-hans/articles/data-structures-with-javascript-tree--cms-23393

// 算法参考：https://github.com/kdn251/interviews/blob/master/README-zh-cn.md

const SEARCH_BFS = 'bfs';
const SEARCH_DFS = 'dfs';
const FN_CHILD_ASSIGN = function(parent, children){
    parent.children = children;
}
/**
 * 数据结构 - 树
 * 
 * @class Tree
 */
class Tree {
    constructor(node) {
        invariant(TreeNode.is(node), '输入参数必须是 TreeNode 类型');
        this._root = node;
    }
    
    /**
     * 递归方法名称的枚举
     * 
     * @readonly
     * @static
     * @memberof Tree
     */
    static get TRAVERSE_TYPE(){
        return [SEARCH_BFS, SEARCH_DFS]; // 定义搜索的方式
    }

    /**
     * 重新映射成另外一棵树，其实就是在广度优先搜索遍历的同时，执行一些副操作
     * 
     * @static
     * @param {any} treeNode 
     * @param {any} callback  (node, parentNode) node 作为当前遍历的节点，表示入参，不用处理 children 属性；parentNode 表示父节点
     * @param {boolean} [disableParent=false] 取消自动设置 parent，有些场景下不需要
     * @param {boolean} [childrenAssignFunction=false] 使用自定义的 children assign 方法，MST 场景下对象的赋值不能直接使用 `=`，
     * @returns 
     * @memberof Tree
     */
    static map(treeNode, callback, disableParent=false, childrenAssignFunction = null){
        invariant(isFunction(callback), 'callback 必须是函数类型');

        var queue = new Queue(); // 基准队列
        var queuePair = new Queue(); // 同步用的队列，给新对象使用， 这样不更改原始对象数据，同时每个队列的对象类型是一致的；
        let newNode = callback(treeNode, null); // 克隆，防止修改原始对象

        // children 的赋值
        let assignFunction = childrenAssignFunction ? childrenAssignFunction : FN_CHILD_ASSIGN;

        invariant(isFunction(assignFunction), 'assignFunction 必须是函数类型');

        // 将新节点入栈
        queue.enqueue(treeNode);
        queuePair.enqueue(newNode);

        var node, nodePair;
        
        while (queue.length()) {
            node = queue.dequeue(); // 出队
            nodePair = queuePair.dequeue(); // 同步队列出队

            //如果该节点有子节点，继续添加进入队列
            if (node.children && node.children.length) {
                let newSubNodes = node.children.map((child)=>{
                    let newChildNode = callback(child, node);

                    // 重新修改 parent 对象
                    if(!disableParent){
                        newChildNode.parent = nodePair; 
                    }

                    queue.enqueue(child); // 基准队列入队
                    queuePair.enqueue(newChildNode); // 同步队列入队

                    return newChildNode;
                });
                assignFunction(nodePair, newSubNodes);
            } else {
                assignFunction(nodePair, []); // 相当于 nodePair.children = [];
            }
        }

        return newNode;
    }

    /**
     * 拷贝当前树, 相当于是对 map 方法的包装
     * 
     * @static
     * @param {any} treeNode 拷贝当前树根节点
     * @param {any} cloneFunction 节点拷贝函数
     * @param {boolean} [disableParent=false] 取消自动设置 parent
     * @param {any} [childrenAssignFunction=null] 自定义children赋值函数，MST需要自定义
     * @returns 
     * @memberof Tree
     */
    static clone(treeNode, cloneFunction, disableParent=false, childrenAssignFunction = null) {
        invariant(isFunction(cloneFunction), 'cloneFunction 必须是函数类型');
        
        return Tree.map(treeNode, function(node){
            return cloneFunction(node);
        }, disableParent, childrenAssignFunction);
    }

    
    /**
     * 树的搜索算法，统一入口
     * 
     * @static
     * @param {any} nodes 输入的节点集合
     * @param {any} callback 迭代回调函数
     * @param {any} [traverseType=SEARCH_BFS] 搜索方式
     * @memberof Tree
     */
    static traverse(nodes, callback, traverseType = SEARCH_BFS, breakIfCallbackReturnTrue = true) {
        invariant(Tree.TRAVERSE_TYPE.includes(traverseType), `目前不支持 ${traverseType} 遍历方式`);
        switch (traverseType) {
            case SEARCH_BFS:
                Tree.traverseBFS(nodes, callback, breakIfCallbackReturnTrue);
                break;
            case SEARCH_DFS:
                Tree.traverseDFS(nodes, callback, breakIfCallbackReturnTrue);
                break;
            default:
                break;
        }
    }

    /**
     * 广度优先搜索 
     * 
     * @static
     * @param {any} nodes 输入的节点集合
     * @param {any} callback 迭代回调函数
     * @returns 
     * @memberof Tree
     */
    static traverseBFS(nodes, callback, breakIfCallbackReturnTrue = true) {
        if(isExist(nodes)){
            nodes = [].concat(nodes);
        }

        if (!nodes || !nodes.length) return;
        var queue = new Queue();
        //先将第一层节点放入栈，倒序压入
        nodes.forEach(node=>{
            queue.enqueue(node);
        });

        var node;

        while (queue.length()) {
            node = queue.dequeue(); // 弹出元素

            let result = callback && callback(node);
            if(!!breakIfCallbackReturnTrue && !!result){
                break;
            }

            //如果该节点有子节点，继续添加进入栈顶
            if (node.children && node.children.length) {
                node.children.forEach(child=>{
                    queue.enqueue(child);
                });
            }
        }
    }

    /**
     * 深度优先搜索
     * 
     * @static
     * @param {any} nodes 
     * @param {any} callback 
     * @returns 
     * @memberof Tree
     */
    static traverseDFS(nodes, callback, breakIfCallbackReturnTrue = true) {
        if(isExist(nodes)){
            nodes = [].concat(nodes);
        }

        if (!nodes || !nodes.length) return;

        var stack = new Stack();

        // 将节点倒序入栈
        for(var i = nodes.length; i > 0; i--){
            stack.push(nodes[i - 1]);
        }

        var node;
        while(stack.length()) {
            node = stack.pop(); // 弹出
            let result = callback && callback(node);
            if(!!breakIfCallbackReturnTrue && !!result){
                break;
            }

            if (node.children && node.children.length) {
                // 将子节点倒序入栈
                for(var i = node.children.length; i > 0; i--){
                    stack.push(node.children[i - 1]);
                }
            }
        }
    }
    

    // 默认是广度优先搜索
    traverse(callback, traverseType = SEARCH_BFS, breakIfCallbackReturnTrue = true) {
        Tree.traverse(this._root, callback, traverseType, breakIfCallbackReturnTrue);
    }
    
    /**
     * 添加节点
     * 
     * @param {any} node 
     * @param {any} toNode 
     * @param {any} [traverseType=SEARCH_BFS] 
     * @memberof Tree
     */
    add(node, toNode, traverseType = SEARCH_BFS) {
        invariant(TreeNode.is(node), `${node.print()} 不是 TreeNode 实例`);
        invariant(TreeNode.is(toNode), `${toNode.print()} 不是 TreeNode 实例`);

        let parent = null;
        let callback = function(node) {
            if(node.id === toNode.id){
                parent = node;
            }
        }

        // 遍历
        this.traverse(callback, traverseType);

        invariant(parent, `${toNode} 节点不在当前树中`)

        // 更新节点
        parent.children.push(node);
        node.parent = parent;
    }
    
    /**
     * 重新映射成另外一棵树
     * 
     * @param {any} callback 
     * @returns 
     * @memberof Tree
     */
    map(callback) {
        let newNode = Tree.map(this._root, callback);
        return new Tree(newNode); // 返回一棵新的节点树
    }

    /**
     * 重新拷贝成另外一棵树
     * 
     * @param {any} callback 
     * @returns 
     * @memberof Tree
     */
    clone(cloneFunction) {
        let newNode = Tree.map(this._root, node => {return node.clone();});
        return new Tree(newNode); // 返回一棵新的节点树
    }




    /**
     * 从树中删除节点
     * 
     * @param {any} node 
     * @param {any} fromNode 
     * @param {any} [traverseType=SEARCH_BFS] 
     * @memberof Tree
     */
    remove(node, fromNode, traverseType = SEARCH_BFS){
        invariant(TreeNode.is(node), `${node.print()} 不是 TreeNode 实例`);
        invariant(TreeNode.is(fromNode), `${fromNode.print()} 不是 TreeNode 实例`);

        let parent = null;
        let childToRemove = null;

        let callback = function(node) {
            if(node.id === fromNode.id) {
                parent = node;
            }
        };

        this.traverse(callback, traverseType);

        invariant(!!parent, `父节点 ${fromNode.print()} 不存在`);
        
        let index = findNodeIndex(parent.children, node);

        invariant(index > -1, `子节点 ${node.print()} 不存在`);

        let removed = parent.children.splice(index, 1);  // 返回被删除的节点
        return removed[0];
    }

}

function findNodeIndex(arr, node) {
    var index;
 
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === node.id) {
            index = i;
        }
    }
 
    return index;
}

export default Tree;

export {
    SEARCH_BFS,
    SEARCH_DFS,
    ComponentNode,
    TreeNode
}
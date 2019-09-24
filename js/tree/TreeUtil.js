class TreeUtil {
    constructor(options) {
        let defaultValue = {
            key: 'menuCode',
            children: 'subMenuList',
            comparison: 'equal' //equal, like
        };

        options = options || defaultValue;
        this.key = options.key || defaultValue.key;
        this.children = options.children || defaultValue.children;
        this.comparison = options.comparison || defaultValue.comparison;
    }


    getSearchTree(nodeList, searchValue) {
        // 所以根节点搜索
        nodeList.forEach((n) => {
            this.searchEach(n, searchValue);
        });

        // 没有叶子节点的根节点也要清理掉
        let length = nodeList.length;
        for (let i = length - 1; i >= 0; i--) {
            let e2 = nodeList[i];
            if (!this.isHasChildren(e2) && this.isSearchValue(e2[this.key], searchValue)) {
                nodeList.splice(i, 1);
            }
        }
        return nodeList;
    }

    /**
     * 对子节点进行搜索
     * @param node
     * @param value
     */
    searchEach(node, value) {
        let depth = this.getTreeDepth(node);

        for (let i = 0; i < depth - 1; i++) {
            // 记录【删除不匹配搜索内容的叶子节点】操作的次数。
            // 如果这个变量记录的操作次数为0，表示树形结构中，所有的
            // 叶子节点(不包含只有根节点的情况)都匹配搜索内容。那么就没有必要再
            // 在循环体里面遍历树了.
            let spliceCounter = 0;

            // 遍历树形结构
            this.traverseTree(node, n => {
                if (this.isHasChildren(n)) {
                    let children = n[this.children];
                    let length = children.length;

                    // 找到不匹配搜索内容的叶子节点并删除。为了避免要删除的元素在数组中的索引改变，从后向前循环,
                    // 找到匹配的元素就删除。
                    for (let j = length - 1; j >= 0; j--) {
                        let e3 = children[j];
                        if (!this.isHasChildren(e3) && this.isSearchValue(e3[this.key], value)) {
                            children.splice(j, 1);
                            spliceCounter++;
                        }
                    }
                }
            });

            // 所有的叶子节点都匹配搜索内容，没必要再执行循环体了。
            if (spliceCounter === 0) {
                break;
            }
        }
    }

    /**
     * 通过传入根节点获得树的深度，是 calDepth 的调用者。
     * @param node
     * @returns {number}
     */
    getTreeDepth(node) {
        if (!node) {
            return 0;
        }
        // 返回结果
        let r = 0;
        // 树中当前层节点的集合。
        let currentLevelNodes = [node];
        // 判断当前层是否有节点
        while (currentLevelNodes.length > 0) {
            // 当前层有节点，深度可以加一。
            r++;
            // 下一层节点的集合。
            let nextLevelNodes = [];
            // 找到树中所有的下一层节点，并把这些节点放到 nextLevelNodes 中。
            for (let i = 0; i < currentLevelNodes.length; i++) {
                let e = currentLevelNodes[i];
                if (this.isHasChildren(e)) {
                    nextLevelNodes = nextLevelNodes.concat(e[this.children]);
                }
            }
            // 令当前层节点集合的引用指向下一层节点的集合。
            currentLevelNodes = nextLevelNodes;
        }
        return r;
    }

    /**
     * 非递归遍历树
     * @param node
     * @param callback
     */
    traverseTree(node, callback) {
        if (!node) {
            return;
        }
        let tmpNode, stack = [];
        stack.push(node);
        while (stack.length > 0) {
            tmpNode = stack.pop();
            callback(tmpNode);
            if (tmpNode[this.children] && tmpNode[this.children].length > 0) {
                for (let i = tmpNode[this.children].length - 1; i >= 0; i--) {
                    stack.push(tmpNode[this.children][i]);
                }
            }
        }
    }

    /**
     * 判断树形结构中的一个节点是否具有孩子节点
     * @param node
     * @returns {boolean}
     */
    isHasChildren(node) {
        return node[this.children] && node[this.children].length > 0;
    }

    /**
     * 判断当前是否是搜索节点
     * @param keyValue 节点值
     * @param searchValue 搜索对象
     * @returns {boolean}
     */
    isSearchValue(keyValue, searchValue) {
        if (this.comparison === 'like') {
            if (!Array.isArray(searchValue)) {
                return keyValue.indexOf(searchValue) <= -1;
            } else {
                for (let i = 0; i < searchValue.length; i++) {
                    if (keyValue.indexOf(searchValue[i]) <= -1) {
                        return true;
                    }
                }
                return false;
            }
        } else if (this.comparison === 'equal') {
            if (!Array.isArray(searchValue)) {
                return keyValue !== searchValue;
            } else {
                for (let i = 0; i < searchValue.length; i++) {
                    if (keyValue !== searchValue[i]) {
                        return true;
                    }
                }
                return false;
            }
        }
    }
}


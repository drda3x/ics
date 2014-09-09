(function (g) {
    'use strict';

    /**
     * Class for create and manipulate the tree structure
     */
    function Tree(content) {
        this.structure = [];
    }

    /**
     * Method to add data-content of the node
     */
    Tree.prototype.add = function (object) {
        if (object instanceof TreeElement) {
            this.content.push(object);
        } else {
            throw 'Tree.add() -> object has to be an instance of TreeElement'
        }
        return this;
    }



    Tree.prototype.find = function (id) {
        if (!(id instanceof 'number')) {
            throw 'Tree.find() ID should be a number';
        } else {
        	for(var level in this.structure) {
        		for(var element in level) {
        			if(element.id == id) {
        				return element;
        			}
        		}
        	}
        	return null;
        }
    }

    Tree.prototype.draw = function() {

    }

    function TreeElement(id, name, parent, neighbors) {
    	this.id = id;
    	this.name = name;
    	this.parent = parent;
    	this.neighbors = neighbors;
    }

    if(!q){
    	return {
    		TreeElement: TreeElement,
    		Tree: Tree
    	}
    }

    if(!g.ics) {
    	g.ics = {}
    }

    g.ics.TreeElement = TreeElement;
    g.ics.Tree = Tree;

})(this);


/*
 Для каждого объекта нужно:
 1. Проверить есть ли в дереве родитель
 2. Если есть - добавить объект в родительский список связи
 3. Если нет - добавить родителя в дерево, а потом и сам объект
 4. И т.д.
 */
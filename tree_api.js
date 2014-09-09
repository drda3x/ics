(function (g) {
    'use strict';

    /**
     * Class for create and manipulate the tree structure
     */
    function Tree(content) {
        this.structure = [];
        this.content = content;
        this.content.sort(function(a,b) {
	        var a = a.relations.parent,
	            b = b.relations.parent;

	        if(a instanceof Array){
	            a.sort();
	            a = a[0];
	        }

	        if(b instanceof Array) {
	            b.sort();
	            b = b[0];
	        }

	        if(a == null) {
	            return -1;
	        } else if (b == null) {
	            return +1;
	        } else {
	            return a - b;
	        }
	    });

	    for(var elem in this.content) {
	    	/**
			 * 1. Узнать слой на который надо вставить элемент
			 * 2. Вставить элемент на позицию
	    	 */
	    	 var layer = this.getLayer(elem);
	    	 layer.push(elem);
	    }
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
        }

        return this;
    }

    Tree.prototype.find = function (id) {
        if (!(id instanceof 'number')) {
            throw 'Tree.find() ID should be a number';
        } else {
        	for(level in this.structure) {
        		for(element in level) {
        			if(element.id == id) {
        				return element;
        			}
        		}
        	}
        	return null;
        }
    }

    Tree.prototype.draw = function() {}

    /**
     *  Method to get layer for chosen element
     */
    Tree.prototype.getLayer = function(element) {
    	for(var layer in structure) {
    		for(var _element in layer) {
    			if(_element.id = element.parent) {
    				return layer;
    			}
    		}
    	}
    }

    function TreeElement(id, name, parents, neighbors) {
    	this.id = id;
    	this.name = name;
    	this.parents = parents;
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
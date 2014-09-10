(function (g, d3) {
    'use strict';

    /**
     * Class for create and manipulate the tree structure
     */
    function Tree(content) {
        this.structure = [];
        this.content = content;
        this.content.sort(function(a,b) {
            if (a.relations == null) {
                return -1;
            } else if (b.relations == null) {
                return +1;
            } else {
                var a = a.relations.parent,
                    b = b.relations.parent;

                if (a instanceof Array) {
                    a.sort();
                    a = a[0];
                }

                if (b instanceof Array) {
                    b.sort();
                    b = b[0];
                }


                return a - b;
            }
	    });

	    for(var index in this.content) {
	    	/**
			 * 1. Узнать слой на который надо вставить элемент
			 * 2. Вставить элемент на позицию
	    	 */
	    	 var elem = this.content[index]
            elem.position = {};
	    	 var layer = this.getLayer(elem);
	    	 layer.data.push(elem);
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

    Tree.prototype.draw = function(selector) {
        /**
         * 1. Обходим структуру по слоям
         * 2. Горизонталь: Для каждого слоя смотрим количество элементов на слое и расчитываем расстояние между ними т.о.
         *      чтобы расстояние между ники было одинаковым.
         *    Вертикаль: Каждый новый слой отображается += некая константа.
         */

        var self = this,
            container = d3.select(selector),
            width = parseInt(container.style('width')),
            height = parseInt(container.style('height')),
            svg = d3.select(selector)
                .append('svg')
                .style('width', width)
                .style('height', height);

        svg.selectAll('circle')
            .data(this.content)
            .enter()
            .append('circle')
            .attr('cx', function(d) {
                var layer = self.getLayer(d),
                    step = width / (1 + layer.data.length),
                    position = (function(l, e) {
                    for(var i= 0, j= l.length; i<j; i++) {
                        if(l[i].id == e.id) {
                            return i + 1;
                        }
                    }
                })(layer.data, d);

                d.position.x = step * position;
                return d.position.x
            })
            .attr('cy', function(d) {
                var layer = self.getLayer(d);

                d.position.y = 25 * (layer.level + 1);

                return d.position.y;
            })
            .attr('r', 8);
    }

    /**
     *  Method to get layer for chosen element
     */
    Tree.prototype.getLayer = function(element) {

        var layer,
            layerIndex = 0;

        if(element.relations == null) {
        	layer = this.structure[0];
        	if(layer) {
        		return layer;      	
        	} else {
        		layer = {
                    level: layerIndex,
                    data: []
                };
        		this.structure.push(layer);
        		return layer;
        	}
            
        }

        var thisLayer = false;

    	for(var layers in this.structure) {
    		layer = this.structure[layers];

    		if (thisLayer) {
                return layer;
            }

            for (var _elements in layer.data) {
            	var _element = layer.data[_elements];
                if (_element.id == element.relations.parent) {
                    thisLayer = true;
                }
            }
            layerIndex++;
        }

        if (thisLayer) {
            layer = {
                level: layerIndex,
                data: []
            };
            this.structure.push(layer);
            return layer;
        }
        return undefined;
    }

    function TreeElement(id, name, parents, neighbors) {
    	this.id = id;
    	this.name = name;
    	this.parents = parents;
    	this.neighbors = neighbors;
    }

    if(!g){
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

})(this, d3);


/*
 Для каждого объекта нужно:
 1. Проверить есть ли в дереве родитель
 2. Если есть - добавить объект в родительский список связи
 3. Если нет - добавить родителя в дерево, а потом и сам объект
 4. И т.д.
 */

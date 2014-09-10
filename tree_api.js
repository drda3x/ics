(function (g, d3) {
    'use strict';

    var colors = [
        '#0106FF',
        '#01A976',
        '#FF0181'
    ];

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
                var v1 = a.relations.parent,
                    v2 = b.relations.parent;

                if (v1 instanceof Array) {
                    v1.sort();
                    v1 = v1[0];
                }

                if (v2 instanceof Array) {
                    v2.sort();
                    v2 = v2[0];
                }

                if(v1 == v2) {
                    return a.id - b.id;
                } else {
                    return v1 - v2;
                }
            }
	    });

	    for(var index in this.content) {
	    	/**
			 * 1. Узнать слой на который надо вставить элемент
			 * 2. Вставить элемент на позицию
	    	 */
	    	 var elem = this.content[index];
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
    };

    Tree.prototype.find = function (id) {
        if (!(typeof id == 'number')) {
            throw 'Tree.find() ID should be a number';
        } else {
        	for(var lev_index= 0, lev_last= this.structure.length; lev_index < lev_last; lev_index++) {
                var level = this.structure[lev_index];
        		for(var elem_index= 0, elem_last= level.data.length; elem_index < elem_last; elem_index++) {
                    var element = level.data[elem_index];
        			if(element.id == id) {
        				return element;
        			}
        		}
        	}
        	return null;
        }
    };

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

        this.calculatePositions(container);

        var links = [],
            target;
        for(var element_index= 0, last_index= this.content.length; element_index < last_index; element_index++) {
            var element = this.content[element_index];
            for(var key in element.relations) {
                var relation = element.relations[key];
                if(!(relation instanceof Array)) {
                    relation = [relation];
                }
                for(var rel_index= 0, last_rel= relation.length; rel_index < last_rel; rel_index++) {
                    target = this.find(relation[rel_index]);

                    links.push({
                        from: {
                            x: element.position.x,
                            y: element.position.y
                        },
                        to: {
                            x: target.position.x,
                            y: target.position.y
                        }
                    });
                }
            }
        }

        svg.selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('x1', function(d) {
                return d.from.x;
            })
            .attr('y1', function(d) {
                return d.from.y;
            })
            .attr('x2', function(d) {
                return d.to.x;
            })
            .attr('y2', function(d) {
                return d.to.y;
            })
            .attr('stroke','#0106FF')
            .attr('stroke-width', 2);

        svg.selectAll('circle')
            .data(this.content)
            .enter()
            .append('circle')
            .attr('cx', function(d) {
                return d.position.x;
            })
            .attr('cy', function(d) {
                return d.position.y;
            })
            .attr('r', 15)
            .attr('id', function(d) {
                return d.id
            })
            .attr('fill', function(d) {
                return colors[d.group];
            });

    };

    Tree.prototype.calculatePositions = function(container) {

        var width = parseInt(container.style('width')),
            height = parseInt(container.style('height'));

        for(var elem_index= 0, last_elem= this.content.length; elem_index<last_elem; elem_index++) {

            var d = this.content[elem_index];

            var layer = this.getLayer(d),
                step = width / (1 + layer.data.length),
                position = (function(l, e) {
                    for(var i= 0, j= l.length; i<j; i++) {
                        if(l[i].id == e.id) {
                            return i + 1;
                        }
                    }
                })(layer.data, d);

            if(d.relations != null) {
                var children = [],
                    parent = this.find(d.relations.parent);
                for(var i= 0, j= layer.data.length; i<j; i++) {
                    if(layer.data[i].relations.parent == parent.id) {
                        children.push(layer.data[i]);
                    }
                }

                var offset = ((parent.position.toNextElement && children.length > 1) ? parent.position.toNextElement/2 : 75 * (children.length - 1));

                position = (function(l, e) {
                    for(var i= 0, j= l.length; i<j; i++) {
                        if(l[i].id == e.id) {
                            return i;
                        }
                    }
                })(children, d);

                var x1 = parent.position.x - offset,
                    x2 = parent.position.x + offset,
                    d1 = x2 - x1,
                    off = Math.round(d1/((children.length-1 > 1) ? children.length-1 : 1));

                d.position.toNextElement = off;
                d.position.x = parent.position.x - offset + off * position;
            } else {
                d.position.x = step * position;
            }

            d.position.y = 100 * (layer.level + 1);

        }

        return this;
    };

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
    };

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

(function () {
    'use strict';

    /**
     * Class for create and manipulate the tree structure
     */
    function TreeData(id, name) {
        this.id = id;
        this.name = name;
        this.content = [];
        this.anotherRelations = []
    }

    /**
     * Method to add data-content of the node
     */
    TreeData.prototype.add = function (object) {
        if (object instanceof TreeData) {
            this.content.push(object);
        } else {
            if (!object.name || !(object.name instanceof 'string')) {
                throw 'TreeData -> add()... insorrect name of the incoming object...';
            }
            if (!object.id || !(object.id instanceof 'number')) {
                throw 'TreeData -> add()... incorrect id of the incoming object...';
            }
            var _object = new TreeData(object.id, object.name);
            this.content.push(_object);
        }

        return this;
    }

    TreeData.prototype.find = function (id) {
        if (!(id instanceof 'number')) {
            throw 'TreeData -> find.. ID should be a number';
        }
        if (this.id == id) {
            return this;
        } else {
            var finded;
            for (var i = 0, j = this.content.length; i < j; i++) {
                finded = this.content[i].find(id);
            }
            return finded;
        }
    }

    var nodes = [
        {
            id: 4,
            name: 'level-3',
            relations: {
                parent: [2,3]
            }
        },
        {
            id: 1,
            name: 'level-1',
            relations: {
                parent: 0
            }
        },
        {
            id: 0,
            name: 'core-node',
            relations: {
                parent: null
            }
        },
        {
            id: 3,
            name: 'level-2',
            relations: {
                parent: 0,
                neighbors: 2
            }
        },
        {
            id: 2,
            name: 'level-2',
            relations: {
                parent: 0,
                neighbors: 3
            }
        }
    ];

    nodes = nodes.sort(function(a,b) {
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

    console.log(nodes);

})();


/*
 Для каждого объекта нужно:
 1. Проверить есть ли в дереве родитель
 2. Если есть - добавить объект в родительский список связи
 3. Если нет - добавить родителя в дерево, а потом и сам объект
 4. И т.д.
 */
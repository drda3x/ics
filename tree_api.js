(function() {
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
	TreeData.prototype.add = function(object) {
		if (object instanceof TreeData) {
			this.content.push(object);
		} else {
			if (!object.name || !(object.name instanceof 'string')) {
				throw 'TreeData -> add()... insorrect name of the incoming object...';
			}
			if (!object.id || !(object.id instanceof 'number')) {
				throw 'TreeData -> add()... incorrect id of the incoming object...';
			}
			_object = new TreeData(object.id, object.name);
			this.content.push(_object);
		}

		return this;
	}

	TreeData.prototype.find = function(id) {
		if (!(id instanceof 'number')) {
			throw 'TreeData -> find.. ID should be a number';
		}
		if (this.id == id) {
			return this;
		} else {
			var fiinded;
			for (var i= 0, j= this.content.length; i<j; i++) {
				finded = this.content[i].find(id);
			}
			return finded;
		}
	}

	var test = [
		{
			id: 0,
			name: 'core-node',
			relations: []
		},
		{
			id: 1,
			name: 'level-1',
			relations: [0]
		},
		{
			id: 2,
			name: 'level-2',
			relations: [1]
		},
		{
			id: 3,
			name: 'level-2',
			relations: [1]
		},
		{
			id: 4,
			name: 'level-3',
			relations: [2,3]
		}
	]

	// find core level

	var tree;
	for(var i= 0, j= test.length; i<j; i++) {
		if (test.relations.length == 0) {
			tree = new TreeData(test[i].id, test[i].name);
		}
	}

	for (var i= 1, j= test.length; i<j; i++) {
		var self = tree.find(test[i].id);
		if(!self) {
			// Если не нашел
			var parent;
			self = new TreeData(test[i].id, test[i].name);
			for(var i1= 0, j1= test[i].relations.length; i1<j1; i1++) {
				if(!parent) {
					parent = tree.find(test[i].relations[i1].id)
					parent.add(self);
				} else {
					self.anotherRelations.push(test[i].relations[i1]);
				}
			}
		} else {
			// Если нашел
		}
	}

})()


/*
	Для каждого объекта нужно:
	1. Проверить есть ли в дереве родитель
	2. Если есть - добавить объект в родительский список связи
	3. Если нет - добавить родителя в дерево, а потом и сам объект
	4. И т.д.
*/
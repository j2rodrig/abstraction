/*
Abstraction. Facilities for maintaining a cross-device abstraction of
heterogeneous object graphs.
*/
(function() {

	var abstraction = undefined;

	/*
	The local store of objects.
	Keyed first by name, then by id.
	*/
	var store = {};
	var metastore = {};  // information about each store

	var callbacks = [];  // 

	function result(callback, args) {
		if (callback) callbacks.push(
			function () { callback.apply(null, args); }
			);
	}

	function depsOK(name, depKeys, expectedVersion) {
		var dep = undefined;
		var st = store[name];
		for (dep of depKeys) {
			if (!st[dep] || st[dep].version > expectedVersion)
				return false;
		}
		return true;
	}

	abstraction = {

		/*
		Calls callback functions for all completed actions.
		Only actions that have already completed will be executed;
		if a callback generates more callbacks, then these additional
		callbacks will be processed on the next call to processCompletedActions.
		Delaying newly-generated callbacks prevents difficult situations
		involving infinite recursion.
		*/
		processCompletedActions: function() {
			var callback = undefined;
			var completed = callbacks;
			callbacks = [];
			for (callback of completed) callback();
		},

		newTemporaryLocalSpace: function() {
			var space = {
				version: 0,
				objects: {},
				getLocal: function(key) {
					debugtext.log("getLocal", key);
					return space.objects[key];
				},
				insert: function(o, callback) {
					var newVersion = space.version + 1;
					o.key = newVersion;
					o.version = newVersion;
					space.version = newVersion;
					space.objects[o.key] = o;
					debugtext.log("insert", o.key);
				},
				update: function(o, callback) {
					var newVersion = space.version + 1;
					o.version = newVersion;
					space.version = newVersion;
					space.objects[o.key] = o;
				},
			};
			return space;
		},

		/*
		Creates an object store with the given name.

		If socketUpstream is specified, then the store will first be
		created on the abstraction server connected through that socket.

		The nameUpstream parameter specifies the name of the space
		on the upstream server. If not specified, it is assumed to be
		the same as name.

		callback arguments are (successFlag, functionName, storeName, message).
		*/
		createStore: function(name, socketUpstream, nameUpstream, callback) {
			if (store[name]) result(callback, [false, "createStore", name, "a store called '"+name+"' already exists"]);
			else if (socketUpstream) {
				// todo upstream communications
			} else {
				store[name] = {};
				metastore[name] = { version: 0 };
				result(callback, [true, "createStore", name]);
			}
		},

		openStore: function(name, socketUpstream, nameUpstream, callback) {
			//
		},

		/*
		Places the given object in the store with the given name.
		Sets obj.key to a unique integer within the store.
		Sets obj.version 
		*/
		spawn: function(obj, name, depKeys, expectedVersion, callback) {
			var st = store[name];
			var meta = metastore[name];
			var key = meta.version;  // verson numbers are unique per operation, so they can serve as object keys

			if (depsOK(name, depKeys, expectedVersion)) {
				obj.key = key;
				obj.version = meta.version;
				meta.version += 1;
				st[key] = obj;
				result(callback, [true, "spawn", obj]);
			} else
				result(callback, [false, "spawn", obj, "unsatisfied dependencies"]);
		},

		update: function(obj, id, name, deps, callback) {
			//
		},
	};

	if (typeof module === 'object' && typeof module.exports === 'object')
		module.exports = abstraction;  // Node.js export
	else
		window.abstraction = abstraction;  // Browser use
})();
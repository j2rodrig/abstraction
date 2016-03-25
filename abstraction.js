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

	abstraction = {

		/*
		Creates an object store with the given name.
		If socketUpstream is specified, then the store will first be
		created on the abstraction server connected through that socket.
		*/
		createStore: function(name, socketUpstream, callback) {
			//
		},

		openStore: function(name, socketUpstream, callback) {
			//
		},

		/*
		Places the given object in the store with the given name.
		*/
		spawn: function(obj, name, deps, callback) {
			//
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
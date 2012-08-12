/**
 * reactive.js
 *
 * reactive.js provides syncronization between public and private objects thus bringing
 * reactive programming to JavaScript.
 *
 * Copyright 2012 Constantin Dumitrescu (@daslocer)
 *
 * Released under the MIT and GPL Licenses.
 *
 * ------------------------------------------------
 * author:  Constantin Dumitrescu
 * version: 0.1.0
 * url:  https://github.com/daslocer/ReactiveJS
 */

var sync = (function () {		
	var 
		// Store object references using a unique ID to link to eachother.
		objects = {},
		/**
		 * Create a new ID to recognize registered objects.
		 * @return string, Incremental generated string.
		 * @TODO: Requires a random generated Id?
		 */
		newId = (function () {
			var id = 0;
			return function () {
				id += 1;
				return 'object-' + id;
			};
		}()),
		// Stores methods that will be placed in the registered object.
		augmentTemplate = {},
		// Define the chain of command.
		chain = {};

	/** 
	 * Check if the object is already registered.
	 * @return boolean, True if the object is registered and False if it's not.
	 * @param obj object, The object to be tested.
	 */
	function isRegistered(obj) {
		if (true === obj.hasOwnProperty('uniqueSyncId') && true === objects.hasOwnProperty(obj.uniqueSyncId)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Some objects may not be synced.
	 * @return boolean, True if it can be syncd, false if it cannot.
	 * @param obj object, The object to be tested.
	 */
	function canRegister(obj) {
		if ('object' === typeof obj) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Test method if it can be synchronized.
	 * @return boolean, True if it can, false if it cannot.
	 * @param obj object, The object to be tested.
	 * @param prop string, The name of the property to be tested.
	 */
	function isSynchronizable(obj, prop) {
		if (
			'string' === typeof obj[prop] ||
			'number' === typeof obj[prop]
		) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Link two objects together.
	 */
	function link(obj, target, property) {
		if (false === (true === target.hasOwnProperty(property) && true === isSynchronizable(target, property))) {
			console.warn('[SYNC]: Property "' + property + '" does not exist in target object.');
			console.log('[SYNC]: finish output.');
		} else {
			Object.defineProperty(obj, property, {
				get: function () {
					return target[property];
				},
				set: function (val) {
					target[property] = val;
					return;
				}
			});
		}
	}

	/**
	 * Register a new object.
	 */
	function register(obj) {
		var id = newId();
		// Mark the object with an id.
		Object.defineProperty(obj, 'uniqueSyncId', {
			value: id,
			enumerable: false,
			writable: false,
			configurable: false
		});
		// Store the object through reference.
		objects[id] = obj;
	}



	// Start the linking process.
	chain.link = function () {
		Object.defineProperty(this, 'action', {
			value: 'link',
			enumerable: false,
			writable: false,
			configurable: false
		});
		Object.defineProperty(this, 'additional', {
			value: Array.prototype.slice.call(arguments),
			enumerable: false,
			writable: false,
			configurable: false
		});
		return this;
	};

	// Link to the target object.
	chain.to = function (target) {
		var i,
			obj = objects[this.uniqueSyncId];

		// If additional is empty then link all properties.
		// Else link only the specified properties.
		if (0 === this.additional.length) {
			for (i in obj) {
				if (true === obj.hasOwnProperty(i)) {
					link(obj, target, i);
				}
			}
		} else {
			for (i = 0; i < this.additional.length; i += 1) {
				link(obj, target, this.additional[i]);
			}
		}
	}

	// Show how this object is linked through-out the system.
	chain.debug = function () {
		console.log('Debugging this: ');
		console.log(this);
	};

	/**
	 * Return an interface to the world.
	 * @param obj object, To be registered by sync.
	 */
	return function (obj) {
		var i,
			id,
			newChain;

		// Register the object if it's not registered.
		if (false === isRegistered(obj)) {

			// If the object cannot be registered then return.
			if (false === canRegister(obj)) {
				console.warn('[SYNC]: Object cannot be registered.');
				return;
			}

			register(obj);
		}

		// Create a new chain and add the unique id of the object in order to recognize it later.
		newChain = Object.create(chain);
		Object.defineProperty(newChain, 'uniqueSyncId', {
			value: obj.uniqueSyncId,
			enumerable: false,
			writable: false,
			configurable: false
		});

		return newChain;
	};
}());
/**
 * Library that augments objects and extends their native behaviour by
 * syncronising to other objects.
 * While this should be done through common prototype this sync happens
 * at object level instead of prototype and where two objects can have 
 * different prototypes.
 * @return function, The sync register function.
 * @param obj object, The object needed for augmentation.
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
		if (true === obj.hasOwnProperty('uniqueId') && true === objects.hasOwnProperty(obj.uniqueId)) {
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
			console.log(target);
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

	// Start the linking process.
	chain.link = function () {
		this.__proto__.action = 'link';
		this.__proto__.additional = Array.prototype.slice.call(arguments);
		return this;
	};

	// Link to this object.
	chain.to = function (target) {
		var i;
		// If additional is empty then link all properties.
		// Else link only the specified properties.
		if (0 === this.additional.length) {
			for (i in this) {
				if (true === this.hasOwnProperty(i)) {
					link(this, target, i);
				}
			}
		} else {
			for (i = 0; i < this.additional.length; i += 1) {
				link(this, target, this.additional[i]);
			}
		}
	}

	// Show how this object is linked through-out the system.
	chain.debug = function () {
		console.log('Debugging this: ');
		console.log(this);
	};

	return function (obj) {
		var i,
			id;
		// If the object is registered then return.
		if (true === isRegistered(obj)) {
			console.warn('[SYNC]: Object has been registered.');
			return;
		}

		// If the object cannot be registered then return.
		if (false === canRegister(obj)) {
			console.warn('[SYNC]: Object cannot be registered.');
			return;
		}

		// Generate a new id.
		id = newId();
		// Mark the object with an id.
		obj.__proto__.uniqueId = id;
		// Store the object thru reference.
		objects[id] = obj;

		// Start augmenting the object.
		for (i in chain) {
			if (true === chain.hasOwnProperty(i)) {
				if (true === obj.hasOwnProperty(i)) {
					console.warn('[SYNC]: Object has property ' + i + ' and should not be overwritten.');
				} else {
					obj.__proto__[i] = chain[i];
				}
			}
		}
	};
}());
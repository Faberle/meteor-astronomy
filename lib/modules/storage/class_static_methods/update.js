let methods = Astro.Module.modules.storage.classStaticMethods;

methods.update = function(selector, modifier, options, callback) {
	let Class = this;
	let Collection = Class.getCollection();

	// Throw exception if we are trying to update more than one document at once.
	Astro.utils.storage.throwIfSelectorIsNotId(Collection, selector, 'update');

	// If we omit options argument then it may be a callback function.
	if (options instanceof Function) {
		callback = options;
		options = {};
	}
	// Make sure that options is at least an empty object.
	options = options || {};

	// Prepare arguments.
	let args = [
		Class.getName(),
		selector,
		modifier,
		options
	];
	// Wrap callback function.
	let wrappedCallback = Astro.utils.wrapCallback(callback);

	// If we are dealing with a remote collection and we are not on the server.
	if (Collection._connection && Collection._connection !== Meteor.server) {

		// Prepare meteor method name to be called.
		let methodName = '/Astronomy/update';
		// Prepare meteor method options.
		let options = {
			throwStubExceptions: true,
			returnStubValue: true
		};

		try {
			// Run Meteor method.
			return Collection._connection.apply(
				methodName, args, options, wrappedCallback
			);
		}
		// Catch stub exceptions.
		catch(error) {
			wrappedCallback(error);
		}

	}
	// If we can just remove a document without calling the meteor method. We may
	// be on the server or the collection may be local.
	else {

		try {
			// Set the "trusted" argument to true.
			args.push(true);
			// Remove a document.
			return wrappedCallback(
				undefined, Astro.utils.storage.classUpdate.apply(null, args)
			);
		}
		catch(error) {
			wrappedCallback(error);
		}

	}
};
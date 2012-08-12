describe('Object registration and validation tests', function() {
	it('Unique ID validation', function() {
		var object1 = {};
		sync(object1);
		expect(object1.uniqueSyncId).not.toBe(undefined);
	});
});

describe('Object initial reset on synconization', function () { 
	it('Link to an object without arguments', function () { 
		var object1 = {
				foo: 'bar'
			},
			object2 = {
				foo: 'baz'
			};
		sync(object1)
		sync(object2).link().to(object1);
		expect(object2.foo).toBe('bar');
	});

	it('Link to an object with arguments', function () { 
		var object1 = {
				foo: 'bar'
			},
			object2 = {
				foo: 'baz'
			};
		sync(object1)
		sync(object2).link('foo').to(object1);
		expect(object2.foo).toBe('bar');
	});
});

describe('Object syncronization on value change.', function() {
	it('First value change', function() {
		var object1 = {
				foo: 'bar'
			},
			object2 = {
				foo: 'baz'
			};
		sync(object1);
		sync(object2).link().to(object1);
		object1.foo = 'qux';
		expect(object2.foo).toBe('qux');
	});
});

describe('Object syncronization with names.', function() {
	it('First value change', function() {
		var object1 = {
				foo: 'bar'
			},
			object2 = {
				foo: 'baz'
			};
		sync(object1, 'first-object');
		sync(object2).link().to('first-object');
		object1.foo = 'qux';
		expect(object2.foo).toBe('qux');
	});
});
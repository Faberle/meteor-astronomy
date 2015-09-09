Tinytest.add('Fields - Push', function(test) {
  var NestedPush = Astro.Class({
    name: 'NestedPush'
  });

  var Push = Astro.Class({
    name: 'Push',
    fields: {
      arrayA: {
        type: 'array',
        default: function() {
          return [];
        }
      },
      arrayB: {
        type: 'array',
        default: function() {
          return [];
        }
      },
      typedArrayA: {
        type: 'array',
        nested: 'string',
        default: function() {
          return [];
        }
      },
      typedArrayB: {
        type: 'array',
        nested: 'string',
        default: function() {
          return [];
        }
      },
      classArrayA: {
        type: 'array',
        nested: 'NestedPush',
        default: function() {
          return [];
        }
      },
      classArrayB: {
        type: 'array',
        nested: 'NestedPush',
        default: function() {
          return [];
        }
      }
    }
  });
  var push = new Push();

  // Non-typed arrays.
  push.push('arrayA', 1);
  test.equal(push.arrayA, [1],
    'Pushing a single value into the non-typed array field should succeed'
  );

  push.push({
    'arrayA': 2,
    'arrayB': 1,
  });
  test.equal(
    push.get(['arrayA', 'arrayB']),
    {
      'arrayA': [1, 2],
      'arrayB': [1]
    },
    'Pushing multiple values into the non-typed array field should succeed'
  );

  // Typed arrays.
  push.push('typedArrayA', 1);
  test.equal(push.typedArrayA, ['1'],
    'Pushing a single value into the typed array field should succeed'
  );

  push.push({
    'typedArrayA': 2,
    'typedArrayB': 1,
  });
  test.equal(
    push.get(['typedArrayA', 'typedArrayB']),
    {
      'typedArrayA': ['1', '2'],
      'typedArrayB': ['1']
    },
    'Pushing multiple values into the typed array field should succeed'
  );

  // Class arrays.
  push.push('classArrayA', {});
  test.instanceOf(push.classArrayA[0], NestedPush,
    'Pushing a single value into the class typed array field should succeed'
  );

  push.push({
    'classArrayA': {},
    'classArrayB': {},
  });
  test.instanceOf(push.classArrayB[0], NestedPush,
    'Pushing multiple values into the class typed array field should succeed'
  );
});
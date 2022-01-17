# d8a

Data validation library.

### Install

```sh
npm i d8a
```

### Spec

These are the available validations:
```js
// Run validations on specified fields
{
  name: {
    required: true,  // this means can not be undefined
    eq: 5,           // Equal to
    ne: 5,           // Not equal to
    gt: 5,           // Greater than
    lt: 5,           // Less than
    gte: 5,          // Greater than or equal to
    lte: 5,          // Less than or equal to
    in: [1, 2, 3],   // Must be in list
    nin: [1, 2, 3],  // Must not be in list
    length: 5,       // Length of string must be
    minlength: 5,    // Minimum length of string
    maxlength: 5,    // Maximum length of string
    match: /regex/,  // Must match regex
    matcher: async function(val, $) {
      // Validation fails on truthy value
      if (!val) {
        return 'val is not found'
      }
      // Return nothing or undefined to pass
    },
    is: 'boolean',  // Must be true or false
    is: 'string',   // Must be a string
    is: 'number',   // Must be a number, integer or decimal (float)
    is: 'integer',  // Must be an integer
    is: 'decimal',  // Must be a decimal number
    is: 'date',     // Must be a date
    is: 'id',       // Must be an id
    is: 'object',   // Must be an object
    is: 'array',    // Must an array
    is: 'email',    // Must be an email address
    is: 'url'       // Must be a URL
  }
}
```

### Validate

```js
const { validate } = require('d8a')

let spec = {
  val: {
    required: true
  }
}
let data = {
  val: 'hello'
}
let opt = {}
let error = await validate(spec, data, opt)

// Returns null if no errors found
if (error === null) {
  console.log('No errors')
} else {
  console.log(error.val)
  // Prints: ['is required']) if val is not defined
}
```

### Options
The third parameter to the `validate` function are the options:
```js
validation({}, {}, {

  // Language used for locales
  lang: 'en',

  // Custom translate function
  t: async function(key, ...args) {}
})
```

### Extension function
You can extend the validations with your own validator functions:
```js

async function extension({
  spec,
  data,
  opt,
  lang,
  t,
  errors,
  add,
  field,
  spec,
  type,
  validator,
  a, // value of validation
  b  // value of data
}) {
  // Example:
  if (type == 'unique) {
    add(field, 'must be unique')
  }
}

// Pass function as last parameter
const error = await validate({}, {}, extension)

// With options
const error = await validate({}, {}, { lang: 'no' }, extension)
```

### Locales
The default locales are found here:

```js
const { locales } = require('d8a')
```

They look like this:
```js
// Default locale translations
{
  en: {
    validation: {
      required: 'is required',
      eq: 'must be equal to %s',
      ne: 'must not be equal to %s',
      gt: 'must be greater than %s',
      lt: 'must be less than %s',
      gte: 'must be greater than or equal to %s',
      lte: 'must be less than or equal to %s',
      in: 'must be one of %s',
      nin: 'must not be one of %s',
      length: 'length must be %s',
      minlength: 'minimum length is %s',
      maxlength: 'maximum length is %s',
      boolean: 'must be true or false',
      string: 'must be a string',
      number: 'must be a number',
      integer: 'must be an integer',
      decimal: 'must be a decimal',
      date: 'must be a date',
      id: 'must be an id',
      object: 'must be an object',
      array: 'must be an array',
      email: 'must be an email',
      url: 'must be a URL',
      match: "must match '%s'"
    }
  }
}
```

You can add your own locales and translation function like this:

```js
const myLocales = {
  en: {
    validation: {
      required: 'must be included'
    }
  }
}

function translate(key, ...args) {
  return myLocales[key] || key
}

let spec = {}, data = {}
const error = await validate(spec, data, { t: translate })
```

MIT Licensed. Enjoy!

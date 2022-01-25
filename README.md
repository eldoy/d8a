# d8a

Data validation library.

### Install

```sh
npm i d8a
```

### Usage

```js
const d8a = require('d8a')

// Options, defaults shown
const validator = d8a({
  // Language used for locales
  lang: 'en',

  // Mode for validations
  // Setting to 'strict' will make all fields required
  mode: 'lax',

  // Custom translate function
  t: async function(key, ...args) {},

  // Custom locales, example
  locales: {
    en: {
      validation: {
        unique: 'must be unique'
      }
    }
  }
})

// Validate
const result = await validator.validate({}, {})

// Allow
const result = await validator.allow({}, [])

// Deny
const result = await validator.deny({}, [])
```

Read on to learn more about the different functions.


### Validate

Run the validator with:
```js
let spec = {
  val: {
    required: true
  }
}
let data = {
  val: 'hello'
}

let error = await d8a().validate(spec, data)

// Returns null if no errors found
if (error === null) {
  console.log('No errors')
}

// Prints: ['is required']) if val is not defined
console.log(error.val)
```

These are the built in validations:
```js
// Write a spec with specified fields, here for 'name'
{
  name: {
    required: true,  // Value must be defined
    eq: 5,           // Equal to, default
    ne: 5,           // Not equal to
    gt: 5,           // Greater than
    lt: 5,           // Less than
    gte: 5,          // Greater than or equal to
    lte: 5,          // Less than or equal to
    in: [1, 2, 3],   // Must be in list
    nin: [1, 2, 3],  // Must not be in list
    length: 5,       // Length of string must be
    min: 5,          // Minimum length of string
    max: 5,          // Maximum length of string
    match: /regex/,  // Must match regex
    matcher: async function(val, opt) {
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

### Allow

The `allow` function lets you whitelist fields on an object:

```js
const d8a = require('d8a')

const obj = {
  val: 1
}

// Returns null if no errors found
let error = d8a().allow(obj, ['val'])

// Prints: ['is not allowed']) if val is defined
// Only 'key' and 'name' is allowed
let error = d8a().allow(obj, ['key', 'name'])
```

### Deny

The `deny` function lets you blacklist fields on an object:

```js
const d8a = require('d8a')

const obj = {
  val: 1
}

// Returns null if no errors found, 'key' is not defined
let error = await d8a().deny(obj, ['key'])

// Prints: ['is denied']) if val is defined
// 'val' is not allowed thus is denied
let error = d8a().deny(obj, ['val', 'name'])
```

Both `allow` and `deny` works with dot notation.

### Extensions
You can extend the validations with your own validator functions:
```js
// Write a validator function
async function unique({
  spec,
  data,
  opt,
  lang,
  t,
  errors,
  add,
  field,
  type,
  want, // the value we want
  got   // the value of the data
}) {
  // Example:
  add(field, 'must be unique')
}

// Create ext object for option
const ext = {
  unique: {
    type: 'bool', // The accepted value type for this function
    fn: unique
  }
}

// Pass ext option
const error = await d8a({ ext }).validate({}, {})
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
      min: 'minimum length is %s',
      max: 'maximum length is %s',
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
const error = await d8a({ t: translate }).validate(spec, data)
```

MIT Licensed. Enjoy!

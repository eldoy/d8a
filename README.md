# d8a

Data validation library.

### Install

```sh
npm i d8a
```

### Spec

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
    is: 'undefined' // Must be undefined
    is: 'null'      // Must be null

    // Can have multiple types
    is: ['string', 'number']

    // isnt is the opposite of is
    isnt: 'null'    // Must not be null
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
validate({}, {}, {

  // Language used for locales
  // default is 'en' (English)
  lang: 'en',

  // Skip the validation if the value is undefined
  // default is false
  lax: false,

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
```

### Extension function
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
const error = await validate({}, {}, { ext })
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
      match: "must match '%s'",
      is: "must be %s",
      isnt: "must not be %s",
      boolean: 'boolean',
      string: 'string',
      number: 'number',
      integer: 'integer',
      decimal: 'decimal',
      date: 'date',
      id: 'id',
      object: 'object',
      array: 'array',
      email: 'email',
      url: 'URL',
      undefined: 'undefined',
      null: 'null'
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

If you need custom error messages for a certain field, you can do it by adding an object as value that looks like this:

```js
const spec = {
  email: {
    required: {
      val: true,
      message: 'must be custom'
    }
  }
}
```

MIT Licensed. Enjoy!

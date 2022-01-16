# d8a

Data validation library.

### Usage

```sh
npm i d8a
```

#### Validate
```js
const { validate } = require('d8a')

let spec = {
  val: {
    required: true
  }
}
let data = {}
let opt = {}
let error = await validate(spec, data, opt)

if (error === null) {
  console.log('No errors')
} else {
  console.log(error.val)
  // Prints: ['is required'])
}
```

#### Options
The third parameter to the `validate` function are the options:
```js
validation({}, {}, {

  // Language used for locales
  lang: 'en',

  // Custom translate function
  t: async function(key, ...args) {}
})
```

#### Extension function
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

#### Locales
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

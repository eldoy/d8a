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
  name,
  value
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

module.exports = {
  required: 'bool',
  eq: 'any',
  ne: 'number',
  gt: 'number',
  lt: 'number',
  gte: 'number',
  lte: 'number',
  in: 'array',
  nin: 'array',
  length: 'int',
  min: 'int',
  max: 'int',
  match: 'regex',
  matcher: 'function',
  is: 'string'
}

// Types currently allowed:
// bool - true or false
// any - any value
// number - integer or float
// int - integer
// array - array
// regex - regex
// function - function, can be async
// string - string

// Could support:
// object
// null
// float
// truthy
// falsy
// compound types: string|number

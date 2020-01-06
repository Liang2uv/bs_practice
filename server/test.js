const assert = require('http-assert')

function aaa() {
  assert(false, 422, '错了')
}

function bbb() {
  try {
    aaa()
  } catch (error) {
    console.log(error);
    console.log(JSON.stringify(error))
    console.log(error.status);
    console.log(error.message);
  }
}

bbb()
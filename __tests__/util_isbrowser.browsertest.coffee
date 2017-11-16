SGN = require '../lib/coffeescript'

test 'isBrowser works right', ->
    expect(SGN.util.isBrowser()).toBeTruthy()
    expect(SGN.util.isNode()).toBeFalsy()

    return
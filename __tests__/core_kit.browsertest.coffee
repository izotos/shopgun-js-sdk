SGN = require '../lib/coffeescript/browser'
appKey = '00j486xcipwzk2rmcbzfalpk4sgx9v3i'

SGN.config.set
    appKey: appKey

test 'Making a request', (done) ->
    SGN.CoreKit.request
        url: '/v2/countries'
    , (err, data) ->
        expect(data).toBeDefined()

        done()
        
        return

    return

SGN = require './sgn'

SGN.request = require './request'

# Expose the different kits.
SGN.GraphKit = require './kits/graph'
SGN.CoreKit = require './kits/core'

module.exports = SGN

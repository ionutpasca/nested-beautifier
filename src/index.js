'use strict'

var Constants = require('./constants')
var Utils = require('./utils')

module.exports = { beautify: beautify }

function beautify(nestedJson, parent) {
    validateInput(nestedJson, parent)
    var jsonIsValid = Utils.validateJson(nestedJson)
    if (!jsonIsValid) {
        throw new Error(Constants.INVALID_JSON)
    }

    if (typeof parent === 'string') {
        parent = { name: parent }
    }
    parent.idAttr = parent.idAttr ? parent.idAttr : getParentIdAttr(nestedJson, parent)
    if (!parent.idAttr) {
        nestedJson = applyHashesOnParents(nestedJson, parent.name)
        parent.idAttr = 'id'
    }

    var children = findChildren(nestedJson, parent.name)

    var lookup = {}
    var jsonCopy = Utils.copyObject(nestedJson, true)

    jsonCopy.forEach(function (obj) {
        lookup[obj[parent.name][parent.idAttr]] = obj
        obj = initializeNodeChildren(obj, parent.name, children)
    })

    nestedJson.forEach(function (obj) {
        children.forEach(function (child) {
            var parentForChild = lookup[obj[parent.name][parent.idAttr]][parent.name][child]
            var childIsAlreadyContained = Utils.arrayContainsObject(parentForChild, obj[child])

            if (!childIsAlreadyContained) {
                parentForChild.push(obj[child])
            }
        })
    })

    return computeFinalResult(lookup)
}

function validateInput(nestedJson, parent) {
    if (!nestedJson || !parent) {
        throw new Error(Constants.REQUIRED_DATA)
    }
    if (typeof parent !== 'string' && !parent.name) {
        throw new Error(Constants.INVALID_PARENT)
    }
}

function getParentIdAttr(nestedJson, parent) {
    var parentName = parent.name ? parent.name : parent
    var firstObj = nestedJson[0][parentName]

    var preferableIdAttr = 'id'
    if (Utils.objectHasProperty(firstObj, preferableIdAttr)) {
        return preferableIdAttr
    } else {
        return false
    }
}

function applyHashesOnParents(nestedJson, parentName) {
    var hashes = {}
    nestedJson.forEach(function (obj) {
        var valuesAsString = ''
        Object.keys(obj[parentName]).forEach(function (key) {
            valuesAsString += obj[parentName][key]
        })
        var hash = hashes[valuesAsString] ? hashes[valuesAsString] : Utils.createHashFromString(valuesAsString)

        if (!hashes[valuesAsString]) {
            hashes[valuesAsString] = hash
        }
        obj[parentName]['id'] = hash
    })
    return nestedJson
}

function findChildren(nestedJson, parentName) {
    var firstObj = nestedJson[0]
    if (typeof firstObj !== 'object') {
        throw new Error(Constants.INVALID_JSON)
    }

    var keys = Object.keys(firstObj)
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] === parentName) {
            keys.splice(i, 1)
        }
    }
    return keys
}

function initializeNodeChildren(node, parentName, children) {
    children.forEach(function (child) {
        node[parentName][child] = []
        delete node[child]
    })
    return node
}

function computeFinalResult(lookupResult) {
    var finalResult = []
    Object.keys(lookupResult)
        .forEach(function (key) {
            finalResult.push(lookupResult[key])
        })
    return finalResult
}
'use strict'

module.exports = {
    createHashFromString: createHashFromString,
    objectHasProperty: objectHasProperty,
    validateJson: validateJson,
    copyObject: copyObject
}

function createHashFromString(string) {
    if (Array.prototype.reduce) {
        return this.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)
    }
    var hash = 0;
    if (string.length === 0) {
        return hash
    }
    for (var i = 0; i < string.length; i++) {
        var character = string.charCodeAt(i)
        hash = ((hash << 5) - hash) + character
        hash = hash & hash
    }
    return hash;
}

function objectHasProperty(object, propertyToFind) {
    return Object.keys(object).indexOf(propertyToFind) !== -1
}

function validateJson(jsonToValidate) {
    var stringifiedJson = JSON.stringify(jsonToValidate)
    try {
        JSON.parse(stringifiedJson)
    } catch (e) {
        return false
    }
    return true
}

function copyObject(orig, deep) {
    var copy = Object.create(Object.getPrototypeOf(orig))
    copyOwnPropertiesFrom(copy, orig, deep)
    return copy
}

function copyOwnPropertiesFrom(target, source, deep) {
    var sourceProperties = Object.getOwnPropertyNames(source)

    sourceProperties.forEach(function (propKey) {
        var desc = Object.getOwnPropertyDescriptor(source, propKey)
        Object.defineProperty(target, propKey, desc)
        if (deep && typeof desc.value === 'object') {
            target[propKey] = copyObject(source[propKey], deep)
        }
    })
    return target
}
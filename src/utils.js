'use strict'

module.exports = {
    createHashFromString: createHashFromString,
    arrayContainsObject: arrayContainsObject,
    objectHasProperty: objectHasProperty,
    validateJson: validateJson,
    copyObject: copyObject
}

function createHashFromString(string) {
    if (Array.prototype.reduce) {
        return string.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)
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

function arrayContainsObject(array, object) {
    if (!array.length) {
        return false
    }
    var i = 0
    var found = false
    while (i < array.length && !found) {
        if (objectsAreEqual(array[i], object)) {
            found = true
        }
        i += 1
    }
    return found
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
    if (orig === null) {
        return null;
    }
    var copy = Object.create(Object.getPrototypeOf(orig))
    copyOwnPropertiesFrom(copy, orig, deep)
    return copy
}

function copyOwnPropertiesFrom(target, source, deep) {
    var sourceProperties = Object.getOwnPropertyNames(source)

    sourceProperties.forEach(function (propKey) {
        var desc = Object.getOwnPropertyDescriptor(source, propKey)
        Object.defineProperty(target, propKey, desc)
        if (deep && typeof desc.value === 'object' && desc.value !== null && !desc.value instanceof Date) {
            target[propKey] = copyObject(source[propKey], deep)
        } else if (desc.value === null) {
            target[propKey] = desc.value
        }

    })
    return target
}

function objectsAreEqual(firstObj, objectToCompare) {
    if (typeof firstObj !== typeof objectToCompare) {
        return false
    }

    if (typeof objectToCompare === 'string' || typeof firstObj === 'string') {
        return firstObj === objectToCompare
    }

    var key = null
    for (key in firstObj) {
        switch (typeof (firstObj[key])) {
            case 'object':
                if (!objectsAreEqual(firstObj[key], (objectToCompare[key]))) {
                    return false
                }
                break

            case 'function':
                if (typeof (objectToCompare[key]) == 'undefined' ||
                    (key != 'equals' && firstObj[key].toString() != objectToCompare[key].toString())) {
                    return false;
                }
                break

            default:
                if (firstObj[key] != objectToCompare[key]) {
                    return false;
                }
        }
    }

    for (key in objectToCompare) {
        if (typeof (firstObj[key]) == 'undefined') {
            return false;
        }
    }
    return true;
}
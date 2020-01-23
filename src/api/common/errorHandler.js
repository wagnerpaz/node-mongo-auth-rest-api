const _ = require('lodash')

module.exports = (req, res, next) => {
    const bundle = res.locals.bundle

    const errors = []

    if(bundle.errors) {
        _.forIn(bundle.errors, (obj, key) => {
            if(!obj.kind) return
            if(obj.reason && obj.reason.kind) {
                obj = obj.reason
                key = key + (obj.path && obj.path.length > 0 ? '.' + obj.path : '')
            }
            
            const error = {
                kind: obj.kind,
                path: _convertMoongoseInstancePathToJavascriptPath(key),
                value: obj.value,
                message: obj.message
            }
            errors.push(error)
        })
    }

    if(errors.length > 0) {
        res.status(500).json({errors})
    }
    else {
        next()
    }
}

const _convertMoongoseInstancePathToJavascriptPath = (path) => {
    let replaced = path
    let old = replaced
    while ( (replaced = replaced.replace(/\.(\d+?)\./, '[$1].')) != old ) {
        old = replaced
    }
    return replaced
}
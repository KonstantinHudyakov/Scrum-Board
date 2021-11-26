export function createError(request, response, message = "") {
    return new Error(`${message}
        Request: ${JSON.stringify(reqResAsObject(request))}
        Response:${JSON.stringify(reqResAsObject(response))}`)
}

function objectToMap(obj) {
    const filtered = {};
    for (const key in obj)
        if (['boolean', 'number', 'string'].includes(typeof obj[key]) || obj[key] === null)
            filtered[key] = obj[key];
    return filtered;
}

function reqResAsObject(r) {
    return {
        ...objectToMap(r),
        headers: Object.fromEntries(r.headers),
        signal: objectToMap(r.signal),
    }
}
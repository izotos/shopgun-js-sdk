SGN = require '../sgn'
axios = require 'axios'

module.exports = (options = {}, callback, progressCallback) ->
    requestOptions =
        method: options.method or 'get'
        url: options.url
        headers: options.headers
        timeout: options.timeout
        json: options.json
        data: options.body
        formData: options.formData
        forever: true
        params: options.qs
        withCredentials: options.useCookies
        onUploadProgress: progressCallback || ->
        onDownloadProgress: progressCallback || ->
    
    if Array.isArray options.cookies
        jar = request.jar()

        options.cookies.forEach (cookie) ->
            jar.setCookie request.cookie("#{cookie.key}=#{cookie.value}"), cookie.url

            return

        requestOptions.jar = jar

    axios(requestOptions).then((response) ->
        callback null,
            statusCode: response.status
            headers: response.headers
            body: response.data
    ).catch((error) ->
        callback error
    )

    return

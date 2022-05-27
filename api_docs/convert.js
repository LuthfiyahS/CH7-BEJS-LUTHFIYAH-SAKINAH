const postmanToOpenApi = require('postman-to-openapi')

const postmanCollection = './APIGAMESCH07.postman_collection.json'
const outputFile = './collection.yaml'

postmanToOpenApi(postmanCollection, outputFile, { defaultTag: 'General' }).then(result => {
    console.log(`OpenAPI specs: ${result}`)
}).catch(err => {
    console.log(err)
})
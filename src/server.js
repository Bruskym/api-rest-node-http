import http from 'node:http'
import { routes } from './routes.js'
import { readBody } from './middlewares/readBodyContent.js'
import { extractQueryParams } from './utils/extract-query-params.js'


const app = http.createServer(async (req, res) => {
    const {method, url} = req
    
    await readBody(req, res) // middleware criando req.body
    
    const route = routes.find(route => {
        return route.method === method && route.url.test(url)
    })

    if(route) {
        const routeParams = url.match(route.url)

        const {query, ...params} = routeParams.groups

        req.params = params
        req.query = query ? extractQueryParams(query) : {}

        return route.handle(req, res)
    }

    return res.writeHead(404).end('')
})

app.listen(3000)
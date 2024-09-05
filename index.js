const fs = require('fs')
const http = require('http')
const url = require('url')

const replaceTemplate = require('./modules/replaceTemplate')
/////////////////////////////////////////////////
//Reading the file previously to not read it everytime the endpoint gets hit and creating the templates
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')
const productData = JSON.parse(data)
//SERVER OPERATIONS
//Creating the server
const server = http.createServer((req, res) => {
    const {query,pathname} = url.parse(req.url,true)
    //Overview Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200,{'Content-type':'text/html'})
        const cardsHTML = productData.map(el=> replaceTemplate(tempCard,el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHTML)
        res.end(output)
    
    //Product page
    }else if (pathname === '/product') {
        res.writeHead(200,{'content-type':'text/html'})
        const product = productData[query.id]
        let selectedProduct = replaceTemplate(tempProduct,product)
        res.end(selectedProduct)

    //API
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        })
        res.end(data)

    //Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'Hello World!'
        })
        res.end('<h1>Page not found!</>')
    }
})
//Method to start the server on port 8000 and address localhost
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000!')
})


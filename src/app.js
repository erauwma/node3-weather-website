const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

console.log(__dirname)
console.log(path.join(__dirname, '../public'))
const app = express()

// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', { title: 'Weather App', name: 'Andrew Mead' })
})

app.get('/about', (req, res) => {
    res.render('about', { title: 'about me', name: 'Marnix Erauw' })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({ error: 'you must provide an address' })
    }
    geocode(req.query.address, (error, { latitude, longitude, location }) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecast) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastdata,
                location,
                address: req.query.address
            })
        })
    })
    console.log(req.query.address)
})

app.get('/help', (req, res) => {
    res.render('help', {
        helptext: 'This is some helpful text.',
        title: 'Help',
        name: 'Marnix Erauw'
    })
})

app.get('/products', (req, res) => {

    if (!req.query.search) {
        return res.send({ error: 'you must provide a search term' })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Marnix Erauw',
        errorMessage: 'Help for this article does not exist.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Marnix Erauw',
        errorMessage: 'Page not found'
    })
})
app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})
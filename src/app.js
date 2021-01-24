const express = require('express')
const path = require('path')
const hbs = require('hbs')
const request = require('request')

console.log(__dirname)
console.log(path.join(__dirname,'../public'))

// Path location 
const publicDirectoryPath = path.join(__dirname,'../public')
const pathview = path.join(__dirname,'../templates/views')
const pathPartials = path.join(__dirname, '../templates/partials')

const app = express()

// For handlebars for view engine and views directory
app.set('view engine', 'hbs')
app.set('views',pathview)
hbs.registerPartials(pathPartials)


app.use(express.static(publicDirectoryPath))

app.get('',(req,res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Himanshu'
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About The Page',
        name: 'Himanshu'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help Section',
        name: 'Himanshu'
    })
})

app.get('/weather',(req,res) => {

    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    const url = 'http://api.weatherstack.com/current?access_key=db617f674e596d34de33e98614c383cc&query='+ req.query.address

    request({url: url, json: true}, (error, {body}) => {
        if(error){
            res.send({
                error: 'Unable to connect to weather services'
            })
        
        }
        else if(body.error) {
            res.send({
                error: 'Unable to find Location!'
            })
        }
        else {
            res.send({
                Forecast: body.current.weather_descriptions[0] + '. It is currently ' + body.current.temperature + ' degree ' + 'out. There is ' + body.current.precip + '% chance of rain.',
                Location: body.location.name +' ' + body.location.region + ' ' + body.location.country,
                Address: req.query.address
            })
        }
    })



    // res.send({
    //     Location: req.query.address,
    //     Forecast: 'Partly Cloudy. The temperature is 25 degree and 0% chance of rain',
        
    // })
})

app.get('/help/*',(req,res) => {
    res.render('404page', {
        title: 'help article not found!',
        name: 'Himanshu',
        paragraph: '404 Error!'

    })
})

app.get('*', (req,res) => {
    res.render('404page', {
        title: '404 Page Not Found!',
        name: 'Himanshu',
        paragraph: 'This Page is not set'
    })
})

// app.com
//app.com/help

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
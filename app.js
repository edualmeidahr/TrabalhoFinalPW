const express = require('express')
const app = express()

const port = 3002
const bodyParser = require("body-parser")
const formData = require("express-form-data")
const fs = require("fs")
const cors = require("cors")
const moment = require("moment")




var corsOptions = {
	origin: 'http://127.0.0.1:5500',
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.static('uploads'))
app.use(formData.parse())
app.use(bodyParser.urlencoded({ extended: true }))

require("./rotas/clientes")(app)
require("./rotas/fornecedores")(app)

app.get('/', (req, res) => {
	res.send(moment().format("YYYY-MM-DD"))
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})


/*
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
*/
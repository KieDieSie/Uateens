import express, { json } from "express"
import {appendFileSync} from 'fs'
const app = express()



app.use(express.static('./'))
app.use(express.json())

app.post('/stats', (req, res) => {
    appendFileSync('statistics.txt', JSON.stringify(req.body) + '\n')
})

app.listen(3000)

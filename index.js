const express = require('express')
const app = express()
const cluster = require('cluster')
const os = require('os')

const PORT = process.env.PORT || 4000

if(cluster.isMaster){
    const cpuCount = os.cpus().length
    for(let i = 0; i < cpuCount; i++){
        cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker died...${worker.process.pid}`)
        cluster.fork()
    })
} else{
    app.listen(PORT, () => console.log(`Server ${process.pid} is Running at PORT: ${PORT}`))
    app.get('/', (req, res) => {
        res.json(isPrime(parseInt(req.query.number)))
        // cluster.worker.kill()
    })
}

const isPrime = (number) => {
    let flag = true
    for(let i = 2; i < number; i++){
        if(number % i == 0){
            flag = false
        }
    }
    return {
        number: number,
        isPrime: flag,
        processid: `${process.pid}`
    }
}

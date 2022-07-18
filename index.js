const { Client, LocalAuth } = require('whatsapp-web.js')
const ffmpeg = require('ffmpeg-static')
const client = new Client({ authStrategy: new LocalAuth(), ffmpegPath: ffmpeg })
const qrcode = require('qrcode-terminal')
const { prefix } = require('./config.json')
require('colors')
const fs = require('fs')

client.on('qr', (qr) => qrcode.generate(qr, { small: true }))

client.on('ready', () => { console.log('Useless 🚀 \t'.green + `${fs.readFileSync('./.version')}`.yellow) })

client.on('auth_failure', () => { console.error('Error de autenticacion.\nUsa npm run fix auth') })

client.on('message', async (message) =>
{
    client.sendSeen()
    if(message.body.substring(0, 1) != prefix) return
    const args = message.body.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()
    if(!fs.existsSync(`./commands/${command}.js`)) return
    delete require.cache[require.resolve(`./commands/${command}.js`)]
    try { require(`./commands/${command}.js`).run(client, message, args) }
    catch(err) { console.error(err) }
})

client.initialize()
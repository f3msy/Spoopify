const config = require('./config.json');
const { Client } = require('discord.js-selfbot-v13');

/** @type {Set<import('discord.js-selfbot-v13').Client>} */
const clients = new Set();

const c = {
    blue : '\x1b[34m',
    bold : '\x1b[1m',
    reset : '\x1b[0m'
}

for (const token of config.tokens) {
    for (const [browser, device] of Object.entries(config.devices)) {
        if (!device.spoof) continue;

        /** @type {import('discord.js-selfbot-v13').Client} */
        const client = new Client({ ws: { properties: { browser } } });

        console.clear();

        client.once('ready', async () => {
            if (config.status === "online") client.user?.setStatus("online");
            else if (config.status === "idle") client.user?.setStatus("idle");
            else if (config.status === "dnd") client.user?.setStatus("dnd");
    
            console.log(`${c.bold}spoofed as ${c.blue}${browser}${c.reset} on ${c.blue}${c.bold}${device.name}${c.reset} for @${c.bold}${client.user?.username}${c.reset}${c.blue}${c.bold} | ${c.reset}${c.bold}${client.user?.id}${c.reset}`);

        });

        client.login(token).catch(console.error);
        clients.add(client);
    }
}

process.once('SIGINT', () => {
    console.log(`\n${c.bold}destroying all active clients...${c.reset}`);
    clients.forEach(client => client.destroy());
    process.exit(0);
});

const localtunnel = require('localtunnel');
const fs = require('fs');

(async () => {
  try {
    const tunnel = await localtunnel({ port: 3000, subdomain: 'kiet-lucky-submission-final' });
    fs.writeFileSync('SUCCESS.txt', tunnel.url);
    console.log('Tunnel started at:', tunnel.url);
    
    tunnel.on('close', () => {
      console.log('Tunnel closed');
    });
  } catch (err) {
    fs.writeFileSync('ERROR.txt', err.message);
    console.error('Error starting tunnel:', err);
  }
})();

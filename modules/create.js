const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sellvpn.db');

async function createssh(username, password, exp, iplimit, serverId) {
  console.log(`Creating SSH account for ${username} with expiry ${exp} days, IP limit ${iplimit}, and password ${password}`);
  
  // Validasi username
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username)) {
    return '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.';
  }

  // Ambil domain dari database
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err) {
        console.error('Error fetching server:', err.message);
        return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');
      }

      if (!server) return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');

      const domain = server.domain;
      const auth = server.auth;
      // Updated endpoint and parameters for SSH
      const url = `http://${domain}:6969/create-ssh?auth=${auth}&user=${username}&password=${password}&exp=${exp}&limitip=${iplimit}`;
      
      axios.get(url)
        .then(response => {
          if (response.data.status === "success") {
            const sshData = response.data.data;
            // Map the new JSON structure to the message
            const msg = `
🌟 *AKUN SSH PREMIUM* 🌟

🔹 *Informasi Akun*
┌─────────────────────
│ *Username* : \`${sshData.username}\`
│ *Password* : \`${sshData.password}\`
└─────────────────────
┌─────────────────────
│ *Host* : \`${sshData.host}\`
│ *IP* : \`${sshData.ip}\`
│ *OpenSSH* : \`${sshData.ports.openSSH}\`
│ *Dropbear* : \`${sshData.ports.dropbear}\`
│ *SSH WS* : \`${sshData.ports.sshWS}\`
│ *SSH SSL* : \`${sshData.ports.sshWSSSL}\`
│ *OVPN SSL* : \`${sshData.ports.ovpnSSL}\`
│ *OVPN TCP* : \`${sshData.ports.ovpnTCP}\`
│ *OVPN UDP* : \`${sshData.ports.ovpnUDP}\`
│ *BadVPN* : \`${sshData.ports.badVPN}\`
└─────────────────────
🔗 *Payloads*
───────────────────────
*WS Non-TLS:*
\`\`\`
${sshData.payloads.wsNtls}
\`\`\`
*WS TLS:*
\`\`\`
${sshData.payloads.wsTls}
\`\`\`
───────────────────────
🔗 *Links*
OpenVPN: [Download](${sshData.ovpnDownload})
Save Account: [Save](${sshData.saveLink})
───────────────────────
┌─────────────────────
│ Expires: \`${sshData.expired}\`
│ IP Limit: \`${iplimit} IP\`
│ Location: \`${sshData.city}, ${sshData.isp}\`
└─────────────────────

✨ Selamat menggunakan layanan kami! ✨
`;
              console.log('SSH account created successfully');
              return resolve(msg);
            } else {
              console.log('Error creating SSH account');
              return resolve(`❌ Terjadi kesalahan: ${response.data.message || 'Unknown error'}`);
            }
          })
        .catch(error => {
          console.error('Error saat membuat SSH:', error);
          return resolve('❌ Terjadi kesalahan saat membuat SSH. Silakan coba lagi nanti.');
        });
    });
  });
}

async function createvmess(username, exp, quota, limitip, serverId) {
  console.log(`Creating VMess account for ${username} with expiry ${exp} days, quota ${quota} GB, limit IP ${limitip} on server ${serverId}`);
  
  // Validasi username
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username)) {
    return '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.';
  }

  // Ambil domain dan auth dari database
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err) {
        console.error('Error fetching server:', err.message);
        return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');
      }

      if (!server) return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');

      const domain = server.domain;
      const auth = server.auth;
      // Updated endpoint and parameters for VMess
      const url = `http://${domain}:6969/create-vmess?auth=${auth}&user=${username}&quota=${quota}&limitip=${limitip}&exp=${exp}`;
      
      axios.get(url)
        .then(response => {
          if (response.data.status === "success") {
            const vmessData = response.data.data;
            const msg = `
🌟 *AKUN VMESS PREMIUM* 🌟

🔹 *Informasi Akun*
┌─────────────────────
│ *Username* : \`${vmessData.user}\`
│ *Domain* : \`${vmessData.domain}\`
│ *UUID* : \`${vmessData.uuid}\`
│ *Expired* : \`${vmessData.expired}\`
└─────────────────────
🔐 *VMESS TLS*
\`\`\`
${vmessData.ws_tls}
\`\`\`
🔓 *VMESS NON-TLS*
\`\`\`
${vmessData.ws_none_tls}
\`\`\`
🔒 *VMESS GRPC*
\`\`\`
${vmessData.grpc}
\`\`\`
┌─────────────────────
│ Quota: \`${quota === '0' || quota === 0 ? 'Unlimited' : quota + ' GB'}\`
│ IP Limit: \`${limitip === '0' || limitip === 0 ? 'Unlimited' : limitip + ' IP'}\`
└─────────────────────
🔗 [OpenClash](${vmessData.openclash}) | [Dashboard](${vmessData.dashboard_url})

✨ Selamat menggunakan layanan kami! ✨
`;
              console.log('VMess account created successfully');
              return resolve(msg);
            } else {
              console.log('Error creating VMess account');
              return resolve(`❌ Terjadi kesalahan: ${response.data.message || 'Unknown error'}`);
            }
          })
        .catch(error => {
          console.error('Error saat membuat VMess:', error);
          return resolve('❌ Terjadi kesalahan saat membuat VMess. Silakan coba lagi nanti.');
        });
    });
  });
}

async function createvless(username, exp, quota, limitip, serverId) {
  console.log(`Creating VLESS account for ${username} with expiry ${exp} days, quota ${quota} GB, limit IP ${limitip} on server ${serverId}`);
  
  // Validasi username
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username)) {
    return '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.';
  }

  // Ambil domain dari database
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err) {
        console.error('Error fetching server:', err.message);
        return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');
      }

      if (!server) return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');

      const domain = server.domain;
      const auth = server.auth;
      // Updated endpoint and parameters for VLess
      const url = `http://${domain}:6969/create-vless?auth=${auth}&user=${username}&quota=${quota}&limitip=${limitip}&exp=${exp}`;
      
      axios.get(url)
        .then(response => {
          if (response.data.status === "success") {
            const vlessData = response.data.data;
            const msg = `
🌟 *AKUN VLESS PREMIUM* 🌟

🔹 *Informasi Akun*
┌─────────────────────
│ *Username* : \`${vlessData.user}\`
│ *Domain* : \`${vlessData.domain}\`
│ *UUID* : \`${vlessData.uuid}\`
│ *Expired* : \`${vlessData.expired}\`
└─────────────────────
🔐 *VLESS TLS*
\`\`\`
${vlessData.ws_tls}
\`\`\`
🔓 *VLESS NON-TLS*
\`\`\`
${vlessData.ws_none_tls}
\`\`\`
🔒 *VLESS GRPC*
\`\`\`
${vlessData.grpc}
\`\`\`
┌─────────────────────
│ Quota: \`${quota === '0' || quota === 0 ? 'Unlimited' : quota + ' GB'}\`
│ IP Limit: \`${limitip === '0' || limitip === 0 ? 'Unlimited' : limitip + ' IP'}\`
└─────────────────────
🔗 [OpenClash](${vlessData.openclash}) | [Dashboard](${vlessData.dashboard_url})

✨ Selamat menggunakan layanan kami! ✨
`;
              console.log('VLESS account created successfully');
              return resolve(msg);
            } else {
              console.log('Error creating VLESS account');
              return resolve(`❌ Terjadi kesalahan: ${response.data.message || 'Unknown error'}`);
            }
          })
        .catch(error => {
          console.error('Error saat membuat VLESS:', error);
          return resolve('❌ Terjadi kesalahan saat membuat VLESS. Silakan coba lagi nanti.');
        });
    });
  });
}

async function createtrojan(username, exp, quota, limitip, serverId) {
  console.log(`Creating Trojan account for ${username} with expiry ${exp} days, quota ${quota} GB, limit IP ${limitip} on server ${serverId}`);
  
  // Validasi username
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username)) {
    return '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.';
  }

  // Ambil domain dari database
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err) {
        console.error('Error fetching server:', err.message);
        return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');
      }

      if (!server) return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');

      const domain = server.domain;
      const auth = server.auth;
      // Updated endpoint and parameters for Trojan
      const url = `http://${domain}:6969/create-trojan?auth=${auth}&user=${username}&quota=${quota}&limitip=${limitip}&exp=${exp}`;
      
      axios.get(url)
        .then(response => {
          if (response.data.status === "success") {
            const trojanData = response.data.data;
            const msg = `
🌟 *AKUN TROJAN PREMIUM* 🌟

🔹 *Informasi Akun*
┌─────────────────────
│ *Username* : \`${trojanData.user}\`
│ *Domain* : \`${trojanData.domain}\`
│ *UUID* : \`${trojanData.uuid}\`
│ *Expired* : \`${trojanData.expired}\`
└─────────────────────
🔐 *TROJAN WS*
\`\`\`
${trojanData.ws}
\`\`\`
🔒 *TROJAN GRPC*
\`\`\`
${trojanData.grpc}
\`\`\`
┌─────────────────────
│ Quota: \`${quota === '0' || quota === 0 ? 'Unlimited' : quota + ' GB'}\`
│ IP Limit: \`${limitip === '0' || limitip === 0 ? 'Unlimited' : limitip + ' IP'}\`
└─────────────────────
🔗 [OpenClash](${trojanData.openclash}) | [Dashboard](${trojanData.dashboard_url})

✨ Selamat menggunakan layanan kami! ✨
`;
              console.log('Trojan account created successfully');
              return resolve(msg);
            } else {
              console.log('Error creating Trojan account');
              return resolve(`❌ Terjadi kesalahan: ${response.data.message || 'Unknown error'}`);
            }
          })
        .catch(error => {
          console.error('Error saat membuat Trojan:', error);
          return resolve('❌ Terjadi kesalahan saat membuat Trojan. Silakan coba lagi nanti.');
        });
    });
  });
}

async function createshadowsocks(username, exp, quota, limitip, serverId) {
  console.log(`Creating Shadowsocks account for ${username} with expiry ${exp} days, quota ${quota} GB, limit IP ${limitip} on server ${serverId}`);
  
  // Validasi username
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username)) {
    return '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.';
  }

  // Ambil domain dari database
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err) {
        console.error('Error fetching server:', err.message);
        return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');
      }

      if (!server) return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');

      const domain = server.domain;
      const auth = server.auth;
      // Keeping original Shadowsocks implementation (port 5888) as no new parameters provided
      const param = `:5888/createshadowsocks?user=${username}&exp=${exp}&quota=${quota}&iplimit=${limitip}&auth=${auth}`;
      const url = `http://${domain}${param}`;
      axios.get(url)
        .then(response => {
          if (response.data.status === "success") {
            const shadowsocksData = response.data.data;
            const msg = `
🌟 *AKUN SHADOWSOCKS PREMIUM* 🌟

🔹 *Informasi Akun*
┌─────────────────────
│ *Username* : \`${shadowsocksData.username}\`
│ *Domain* : \`${shadowsocksData.domain}\`
│ *NS* : \`${shadowsocksData.ns_domain}\`
│ *Port TLS* : \`443\`
│ *Port HTTP*: \`80\`
│ *Alter ID* : \`0\`
│ *Security* : \`Auto\`
│ *Network* : \`Websocket (WS)\`
│ *Path* : \`/shadowsocks\`
│ *Path GRPC*: \`shadowsocks-grpc\`
└─────────────────────
🔐 *URL SHADOWSOCKS TLS*
\`\`\`
${shadowsocksData.ss_link_ws}
\`\`\`
🔒 *URL SHADOWSOCKS GRPC*
\`\`\`
${shadowsocksData.ss_link_grpc}
\`\`\`
🔒 *PUBKEY*
\`\`\`
${shadowsocksData.pubkey}
\`\`\`
┌─────────────────────
│ Expiry: \`${shadowsocksData.expired}\`
│ Quota: \`${shadowsocksData.quota === '0 GB' ? 'Unlimited' : shadowsocksData.quota}\`
│ IP Limit: \`${shadowsocksData.ip_limit === '0' ? 'Unlimited' : shadowsocksData.ip_limit} IP\`
└─────────────────────
Save Account Link: [Save Account](https://${shadowsocksData.domain}:81/shadowsocks-${shadowsocksData.username}.txt)
✨ Selamat menggunakan layanan kami! ✨
`;
              console.log('Shadowsocks account created successfully');
              return resolve(msg);
            } else {
              console.log('Error creating Shadowsocks account');
              return resolve(`❌ Terjadi kesalahan: ${response.data.message}`);
            }
          })
        .catch(error => {
          console.error('Error saat membuat Shadowsocks:', error);
          return resolve('❌ Terjadi kesalahan saat membuat Shadowsocks. Silakan coba lagi nanti.');
        });
    });
  });
}

module.exports = { createssh, createvmess, createvless, createtrojan, createshadowsocks };

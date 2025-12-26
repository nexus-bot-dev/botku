const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sellvpn.db');

async function renewssh(username, exp, limitip, serverId) {
  console.log(`Renewing SSH account for ${username} with expiry ${exp} days, limit IP ${limitip} on server ${serverId}`);
  
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
      // Updated renew endpoint for SSH (http://ip:6969/rensh?auth=...&num=...&exp=...)
      // num parameter is filled with username
      const url = `http://${domain}:6969/rensh?auth=${auth}&num=${username}&exp=${exp}`;
      
      axios.get(url)
        .then(response => {
          // Check for success status (assuming similar JSON structure for success/fail)
          if (response.data.status === "success" || response.data.msg === "success" || response.status === 200) {
            // Note: The original code expected data returned. 
            // If the new API just returns success, we format the message with input data.
            // If it returns data, we can use it. 
            const msg = `
🌟 *RENEW SSH PREMIUM* 🌟

🔹 *Informasi Akun*
┌─────────────────────────────
│ Username: \`${username}\`
│ Tambahan Masa Aktif: \`${exp} Hari\`
└─────────────────────────────
✅ Akun ${username} berhasil diperbarui
✨ Selamat menggunakan layanan kami! ✨
`;
         
              console.log('SSH account renewed successfully');
              return resolve(msg);
            } else {
              console.log('Error renewing SSH account');
              return resolve(`❌ Terjadi kesalahan: ${response.data.message || 'Gagal renew'}`);
            }
          })
        .catch(error => {
          console.error('Error saat memperbarui SSH:', error);
          return resolve('❌ Terjadi kesalahan saat memperbarui SSH. Silakan coba lagi nanti.');
        });
    });
  });
}

async function renewvmess(username, exp, quota, limitip, serverId) {
    console.log(`Renewing VMess account for ${username} with expiry ${exp} days, quota ${quota} GB, limit IP ${limitip} on server ${serverId}`);
    
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
        // Updated renew endpoint for VMess (http://ip:6969/renws?auth=...&num=...&exp=...)
        const url = `http://${domain}:6969/renws?auth=${auth}&num=${username}&exp=${exp}`;
        
        axios.get(url)
          .then(response => {
            if (response.data.status === "success" || response.data.msg === "success" || response.status === 200) {
              const msg = `
  🌟 *RENEW VMESS PREMIUM* 🌟
  
  🔹 *Informasi Akun*
  ┌─────────────────────────────
  │ Username: \`${username}\`
  │ Tambahan Masa Aktif: \`${exp} Hari\`
  └─────────────────────────────
  ✅ Akun ${username} berhasil diperbarui
  ✨ Selamat menggunakan layanan kami! ✨
  `;
                console.log('VMess account renewed successfully');
                return resolve(msg);
              } else {
                console.log('Error renewing VMess account');
                return resolve(`❌ Terjadi kesalahan: ${response.data.message || 'Gagal renew'}`);
              }
            })
          .catch(error => {
            console.error('Error saat memperbarui VMess:', error);
            return resolve('❌ Terjadi kesalahan saat memperbarui VMess. Silakan coba lagi nanti.');
          });
      });
    });
  }

  async function renewvless(username, exp, quota, limitip, serverId) {
    console.log(`Renewing VLess account for ${username} with expiry ${exp} days, quota ${quota} GB, limit IP ${limitip} on server ${serverId}`);
    
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
        // Updated renew endpoint for VLess (http://ip:6969/renvl?auth=...&num=...&exp=...)
        const url = `http://${domain}:6969/renvl?auth=${auth}&num=${username}&exp=${exp}`;
        
        axios.get(url)
          .then(response => {
            if (response.data.status === "success" || response.data.msg === "success" || response.status === 200) {
              const msg = `
  🌟 *RENEW VLESS PREMIUM* 🌟
  
  🔹 *Informasi Akun*
  ┌─────────────────────────────
  │ Username: \`${username}\`
  │ Tambahan Masa Aktif: \`${exp} Hari\`
  └─────────────────────────────
  ✅ Akun ${username} berhasil diperbarui
  ✨ Selamat menggunakan layanan kami! ✨
  `;
           
                console.log('VLess account renewed successfully');
                return resolve(msg);
              } else {
                console.log('Error renewing VLess account');
                return resolve(`❌ Terjadi kesalahan: ${response.data.message || 'Gagal renew'}`);
              }
            })
          .catch(error => {
            console.error('Error saat memperbarui VLess:', error);
            return resolve('❌ Terjadi kesalahan saat memperbarui VLess. Silakan coba lagi nanti.');
          });
      });
    });
  }

  async function renewtrojan(username, exp, quota, limitip, serverId) {
    console.log(`Renewing Trojan account for ${username} with expiry ${exp} days, quota ${quota} GB, limit IP ${limitip} on server ${serverId}`);
    
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
        // Updated renew endpoint for Trojan (http://ip:6969/rentr?auth=...&num=...&exp=...)
        const url = `http://${domain}:6969/rentr?auth=${auth}&num=${username}&exp=${exp}`;
        
        axios.get(url)
          .then(response => {
            if (response.data.status === "success" || response.data.msg === "success" || response.status === 200) {
              const msg = `
  🌟 *RENEW TROJAN PREMIUM* 🌟
  
  🔹 *Informasi Akun*
  ┌─────────────────────────────
  │ Username: \`${username}\`
  │ Tambahan Masa Aktif: \`${exp} Hari\`
  └─────────────────────────────
  ✅ Akun ${username} berhasil diperbarui
  ✨ Selamat menggunakan layanan kami! ✨
  `;
           
                console.log('Trojan account renewed successfully');
                return resolve(msg);
              } else {
                console.log('Error renewing Trojan account');
                return resolve(`❌ Terjadi kesalahan: ${response.data.message || 'Gagal renew'}`);
              }
            })
          .catch(error => {
            console.error('Error saat memperbarui Trojan:', error);
            return resolve('❌ Terjadi kesalahan saat memperbarui Trojan. Silakan coba lagi nanti.');
          });
      });
    });
  }

  async function renewshadowsocks(username, exp, quota, limitip, serverId) {
    console.log(`Renewing Shadowsocks account for ${username} with expiry ${exp} days, quota ${quota} GB, limit IP ${limitip} on server ${serverId}`);
    
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
        // Keep original Shadowsocks implementation (port 5888)
        const param = `:5888/renewshadowsocks?user=${username}&exp=${exp}&quota=${quota}&iplimit=${limitip}&auth=${auth}`;
        const url = `http://${domain}${param}`;
        axios.get(url)
          .then(response => {
            if (response.data.status === "success") {
              const shadowsocksData = response.data.data;
              const msg = `
  🌟 *RENEW SHADOWSOCKS PREMIUM* 🌟
  
  🔹 *Informasi Akun*
  ┌─────────────────────────────
  │ Username: \`${username}\`
  │ Kadaluarsa: \`${shadowsocksData ? shadowsocksData.expired : 'Updated'}\`
  │ Batas IP: \`${limitip} IP\`
  └─────────────────────────────
  ✅ Akun ${username} berhasil diperbarui
  ✨ Selamat menggunakan layanan kami! ✨
  `;
           
                console.log('Shadowsocks account renewed successfully');
                return resolve(msg);
              } else {
                console.log('Error renewing Shadowsocks account');
                return resolve(`❌ Terjadi kesalahan: ${response.data.message}`);
              }
            })
          .catch(error => {
            console.error('Error saat memperbarui Shadowsocks:', error);
            return resolve('❌ Terjadi kesalahan saat memperbarui Shadowsocks. Silakan coba lagi nanti.');
          });
      });
    });
  }
  
  module.exports = { renewshadowsocks, renewtrojan, renewvless, renewvmess, renewssh };

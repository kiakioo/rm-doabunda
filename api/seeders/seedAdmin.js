const bcrypt = require('bcryptjs');
const db = require('../utils/db');

async function createAdmin() {
    try {
        // Kita atur password default-nya adalah: admin123
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        // Memasukkan data ke tabel users
        await db.query(
            "INSERT INTO users (name, username, password, role) VALUES ('Administrator', 'admin', ?, 'admin')",
            [hashedPassword]
        );
        
        console.log("✅ Akun Admin berhasil dibuat!");
        process.exit();
    } catch (error) {
        console.error("❌ Gagal membuat admin:", error.message);
        process.exit(1);
    }
}

createAdmin();
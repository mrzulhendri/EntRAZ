/**
 * ============================================================
 * RAZAuth.js - Sistem Autentikasi untuk EntRAZ
 * ============================================================
 * Terakhir diperbarui: 2026-02-17
 * Versi: 1.0.0
 * 
 * Deskripsi:
 * Menangani pembuatan & verifikasi JWT token,
 * hashing password, dan middleware autentikasi.
 * ============================================================
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Kunci rahasia untuk JWT (di production, gunakan environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'entraz-secret-key-2026-change-in-production';

// Durasi token berlaku (7 hari)
const TOKEN_EXPIRY = '7d';

/**
 * generateToken - Membuat JWT token untuk user
 * @param {Object} user - Data user (id, username, role)
 * @returns {string} JWT token
 */
export function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role,
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
    );
}

/**
 * verifyToken - Memverifikasi JWT token
 * @param {string} token - JWT token yang akan diverifikasi
 * @returns {Object|null} Data user jika valid, null jika tidak
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * hashPassword - Meng-hash password menggunakan bcrypt
 * @param {string} password - Password plaintext
 * @returns {string} Password yang sudah di-hash
 */
export function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

/**
 * comparePassword - Membandingkan password dengan hash
 * @param {string} password - Password plaintext
 * @param {string} hash - Password hash dari database
 * @returns {boolean} True jika cocok
 */
export function comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

/**
 * getTokenFromRequest - Mengambil token dari header Authorization
 * Format: "Bearer <token>"
 * @param {Request} request - Next.js Request object
 * @returns {string|null} Token jika ada, null jika tidak
 */
export function getTokenFromRequest(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}

/**
 * authenticateRequest - Middleware untuk memvalidasi request
 * Mengambil token dari header dan memverifikasi
 * @param {Request} request - Next.js Request object
 * @returns {Object} { user, error }
 */
export function authenticateRequest(request) {
    const token = getTokenFromRequest(request);
    if (!token) {
        return { user: null, error: 'Token tidak ditemukan' };
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return { user: null, error: 'Token tidak valid atau sudah kadaluarsa' };
    }

    return { user: decoded, error: null };
}

/**
 * requireAdmin - Memeriksa apakah user adalah admin
 * @param {Request} request - Next.js Request object
 * @returns {Object} { user, error }
 */
export function requireAdmin(request) {
    const { user, error } = authenticateRequest(request);
    if (error) return { user: null, error };
    if (user.role !== 'admin') {
        return { user: null, error: 'Akses ditolak. Hanya admin yang bisa mengakses.' };
    }
    return { user, error: null };
}

# 📱 EchoTic Mobile (`EchoTic-Mobile`)

Aplikasi Mobile berbasis **React Native** & **Expo (Expo Router)** untuk platform tiket konser **EchoTic**, yang terhubung secara penuh ke backend REST API **`echotic-be`** (Node.js, Express, MySQL, JWT).

---

## 🛠️ Tech Stack & Library

- **Framework**: Expo (Expo Router v4) & React Native 0.86
- **State & Data Fetching**: `@tanstack/react-query` v5 & React Context API
- **HTTP Client**: `axios` (dengan Interceptor JWT Token & Auto Refresh)
- **Security Storage**: `expo-secure-store` (untuk menyimpan JWT Token secara aman)
- **Local Storage**: `@react-native-async-storage/async-storage` (untuk user profile caching)
- **Styling**: NativeWind v4 (Tailwind CSS untuk React Native)
- **Graphics & QR**: `react-native-qrcode-svg`, `expo-image`, `react-native-svg`
- **Animations**: `react-native-reanimated`

---

## 📂 Struktur Folder (`EchoTic-Mobile`)

```
EchoTic-Mobile/
├── app/                         # Routing berbasis file Expo Router
│   ├── (auth)/                  # Stack navigasi autentikasi
│   │   ├── login.jsx            # Screen Sign In (Terhubung ke /api/auth/login)
│   │   ├── register.jsx         # Screen Register (Terhubung ke /api/auth/register)
│   │   └── forgot-password.jsx  # Reset password
│   ├── (tabs)/                  # Bottom Tab Navigation Utama
│   │   ├── index.jsx            # Home / Discover Feed (Featured Events & Countdown)
│   │   ├── discover.jsx         # Search & Filter Catalog Konser
│   │   ├── tickets.jsx          # My Gate Passes (Terhubung ke /api/orders/my)
│   │   └── profile.jsx          # Profile User & Vanguard VIP Hub
│   ├── checkout/
│   │   └── index.jsx            # Step 1 Attendee Info Form
│   ├── concert/
│   │   └── [id].jsx             # Detail Konser & Interactive Visual Seat Map
│   ├── payment/
│   │   ├── index.jsx            # Step 2 Payment Method Selection & Pay Action
│   │   └── success.jsx          # Confirmation Screen
│   ├── ticket/
│   │   └── [id].jsx             # Digital Gate Admission Pass & Scan QR Code
│   └── _layout.jsx              # Root App Layout & Providers
├── components/                  # UI Components (Button, Input, Card, SeatMap, dll)
├── constants/                   # Token warna (`colors.js`) & tema
├── contexts/                    # AuthContext (JWT) & ToastContext
├── providers/                   # AppProviders Wrapper (QueryClientProvider, Toast, Auth)
├── services/                    # API Services Layer (TERHUBUNG KE BACKEND REST API)
│   ├── api.js                   # Axios Instance + Platform-aware Base URL + Token Interceptor
│   ├── authService.js           # Service API untuk Login, Register, Logout, Profile
│   ├── eventService.js          # Service API untuk Event Catalog, Detail, & Seat Map
│   └── orderService.js          # Service API untuk Checkout Transaction & Riwayat Tiket
├── utils/                       # Formatter Rupiah & Date id-ID
├── app.json                     # Konfigurasi Expo App
├── .gitignore                   # Rule Git ignore untuk Expo React Native
├── package.json                 # Dependensi Mobile
└── README.md                    # Dokumentasi Mobile App
```

---

## 🔌 Sinkronisasi Data dengan Backend (`echotic-be`)

Aplikasi mobile ini **100% menggunakan data riil dari backend `echotic-be`**:

1. **Autentikasi (JWT Token)**:
   - Login & Register mengirimkan request ke Express API (`/api/auth/login` & `/api/auth/register`).
   - Token disimpan menggunakan **Expo SecureStore** (`echotic_access_token` & `echotic_refresh_token`).
   - `api.js` otomatis menginjeksikan header `Authorization: Bearer <token>` pada setiap request.

2. **Katalog & Seat Map Real-Time**:
   - `eventService.js` mengambil data event, venue, artis, dan ulasan langsung dari MySQL melalui backend.
   - Peta kursi (`getSeats()`) mengambil status ketersediaan kursi secara real-time dari database backend.

3. **Transaksi & E-Ticket QR**:
   - Pembelian tiket diproses melalui endpoint transaksi backend (`POST /api/orders`).
   - E-Ticket Pass membaca data transaksi asli (`GET /api/orders/:id`) dan merepresentasikan kode unik `TKT-XXXXXXXX` dalam bentuk QR Code.

---

## ⚙️ Pengaturan URL Backend API (`services/api.js`)

Secara bawaan (`services/api.js`), Base URL otomatis mendeteksi platform:
- **Android Emulator**: `http://10.0.2.2:5000/api`
- **iOS Simulator / Web**: `http://localhost:5000/api`

Jika ingin menggunakan perangkat HP fisik (Physical Device) via Wi-Fi lokal, atur environment variable `EXPO_PUBLIC_API_URL` di file `.env` dalam folder `EchoTic-Mobile`:

```env
EXPO_PUBLIC_API_URL=http://<IP_LAPTOP_KAMU>:5000/api
```
*(Contoh: `EXPO_PUBLIC_API_URL=http://192.168.1.10:5000/api`)*

---

## 🚀 Cara Menjalankan Mobile App

### 1. Install Dependensi
```bash
cd EchoTic-Mobile
npm install
```

### 2. Pastikan Backend Server (`echotic-be`) Sudah Berjalan
```bash
# Di terminal terpisah
cd EchoTic/echotic-be
npm run dev
```

### 3. Jalankan Expo Development Server
```bash
# Jalankan Expo CLI
npm run start
```

### 4. Opsi Pengujian App:
- **Web Browser**: Tekan tombol `w` di terminal Expo untuk membuka di Web.
- **Android Emulator**: Tekan tombol `a` di terminal Expo.
- **iOS Simulator**: Tekan tombol `i` di terminal Expo (khusus macOS).
- **HP Fisik**: Scan QR Code yang muncul di terminal menggunakan aplikasi **Expo Go** di Android/iOS.

# Defter Uygulaması - Backend Kurulum

Bu proje, fotoğraf ve el yazısı içeren defter sayfalarını MongoDB'ye kaydeden bir uygulamadır.

## 📋 Gereksinimler

- Node.js (v14 veya üzeri)
- MongoDB (Yerel veya MongoDB Atlas)

## 🚀 Kurulum Adımları

### 1. Node.js Paketlerini Yükle

```bash
npm install
```

### 2. .env Dosyası Oluştur

Proje klasöründe `.env` dosyası oluştur:

```env
MONGODB_URI=mongodb://localhost:27017/defter
PORT=3000
```

**MongoDB Atlas (Cloud) kullanıyorsan:**
```env
MONGODB_URI=mongodb+srv://kullanici:sifre@cluster.mongodb.net/defter?retryWrites=true&w=majority
PORT=3000
```

### 3. MongoDB'yi Başlat

**Yerel MongoDB kullanıyorsan:**
```bash
# Mac/Linux
mongod

# Windows
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

**MongoDB Atlas kullanıyorsan:**
- MongoDB Atlas'a giriş yap
- Connection string'i al
- `.env` dosyasına ekle

### 4. Backend Server'ı Başlat

```bash
npm start
```

veya development modunda (otomatik yeniden başlatma):

```bash
npm run dev
```

Server başarılı başladıysa şunu göreceksin:
```
✅ MongoDB bağlantısı başarılı!
🚀 Server çalışıyor: http://localhost:3000
📊 Health check: http://localhost:3000/api/health
```

### 5. Frontend'i Aç

`defter-pageflip.html` dosyasını tarayıcıda aç.

## 📡 API Endpoints

### 1. Kullanıcının Tüm Sayfalarını Getir
```
GET http://localhost:3000/api/pages/:kullaniciId
```

### 2. Tek Sayfa Kaydet (Her sayfa ayrı document)
```
POST http://localhost:3000/api/page/save
Body: {
  "kullaniciId": "string",
  "sayfaNo": 0,
  "metin": "string",
  "foto": "base64 string",
  "canvas": "base64 string",
  "kaydedildi": true
}
```

### 3. Tek Sayfa Sil
```
DELETE http://localhost:3000/api/page/:kullaniciId/:sayfaNo
```

### 4. Tüm Sayfaları Sil
```
DELETE http://localhost:3000/api/pages/:kullaniciId
```

### 5. Health Check
```
GET http://localhost:3000/api/health
```

## 🔧 Ayarlar

### Frontend (defter-pageflip.html)

Dosyanın üst kısmında `API_URL` değişkenini düzenle:

```javascript
const API_URL = 'http://localhost:3000/api';
```

Eğer farklı bir port kullanıyorsan buradan değiştir.

## 📦 MongoDB Veri Yapısı

**Her sayfa ayrı bir document olarak kaydedilir:**

```json
{
  "_id": "ObjectId",
  "kullaniciId": "kullanici_12345",
  "sayfaNo": 0,
  "metin": "Sayfa içeriği...",
  "foto": "data:image/jpeg;base64,...",
  "canvas": "data:image/png;base64,...",
  "kaydedildi": true,
  "createdAt": "2025-11-17T10:00:00.000Z",
  "updatedAt": "2025-11-17T10:00:00.000Z"
}
```

**Örnek: 3 sayfa = 3 ayrı document**

```
Collection: pages

Document 1:
{ kullaniciId: "user_123", sayfaNo: 0, metin: "İlk sayfa", ... }

Document 2:
{ kullaniciId: "user_123", sayfaNo: 1, metin: "İkinci sayfa", ... }

Document 3:
{ kullaniciId: "user_123", sayfaNo: 2, metin: "Üçüncü sayfa", ... }
```

**Avantajlar:**
- ✅ Her sayfa bağımsız
- ✅ Tek sayfa güncellemesi hızlı
- ✅ 1000+ sayfa sorunsuz
- ✅ Bellek verimli

## 🎯 Kullanım

1. Backend server'ı başlat (`npm start`)
2. Frontend'i tarayıcıda aç (`defter-pageflip.html`)
3. Sayfa oluştur, yazı yaz, fotoğraf çek
4. **"Kaydet"** butonuna bas
5. **O sayfa ayrı bir document olarak MongoDB'ye kaydedilir!** ✅
6. Yeni sayfa açılır, devam et!

**Her "Kaydet" = 1 yeni MongoDB document**
- Sayfa 1 kaydet → `pages` collection'a 1. document eklenir
- Sayfa 2 kaydet → `pages` collection'a 2. document eklenir
- ...
- 1000. sayfa kaydet → `pages` collection'a 1000. document eklenir ✅

## 🐛 Sorun Giderme

### "MongoDB bağlantı hatası"
- MongoDB'nin çalıştığından emin ol
- `.env` dosyasındaki `MONGODB_URI` doğru mu kontrol et

### "CORS hatası"
- Backend server'ın çalıştığından emin ol
- Frontend'i `http://` veya `https://` ile aç (file:// protokolü CORS hatası verir)

### "Sunucuya bağlanılamadı"
- Backend server çalışıyor mu? (`http://localhost:3000/api/health` kontrol et)
- Frontend'deki `API_URL` doğru mu?

## 📝 Notlar

- Fotoğraflar Base64 formatında MongoDB'ye kaydedilir
- LocalStorage yedekleme olarak kullanılır
- Her kullanıcıya benzersiz ID atanır
- 1000+ fotoğraf destekler! 🎉

## 🛠️ Geliştirme

Backend'i geliştirmek için:

```bash
npm run dev
```

Nodemon otomatik yeniden başlatma sağlar.

## 📄 Lisans

MIT


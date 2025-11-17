const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Fotoğraflar için büyük limit
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Bağlantısı
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://voiceAI:halilkaya@voiceapi.kliyb.mongodb.net/page?retryWrites=true&w=majority&appName=voiceApi';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB bağlantısı başarılı!'))
    .catch((err) => console.error('❌ MongoDB bağlantı hatası:', err));

// Sayfa Schema - Her sayfa ayrı bir document
const pageSchema = new mongoose.Schema({
    sayfaNo: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    metin: {
        type: String,
        default: ''
    },
    foto: {
        type: String,
        default: ''
    },
    canvas: {
        type: String,
        default: ''
    },
    kaydedildi: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Page = mongoose.model('Page', pageSchema);

// API Endpoints

// 1. Tüm sayfaları getir
app.get('/api/pages', async (req, res) => {
    try {
        // Tüm sayfaları sayfa numarasına göre sıralı getir
        const sayfalar = await Page.find({}).sort({ sayfaNo: 1 });

        res.json({
            success: true,
            toplamSayfa: sayfalar.length,
            data: sayfalar
        });
    } catch (error) {
        console.error('Sayfalar getirme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sayfalar getirilemedi',
            error: error.message
        });
    }
});

// 2. Tek sayfa kaydet (Her sayfa ayrı document)
app.post('/api/page/save', async (req, res) => {
    try {
        const { sayfaNo, metin, foto, canvas, kaydedildi } = req.body;

        if (sayfaNo === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Sayfa numarası gerekli'
            });
        }

        // Sayfa var mı kontrol et
        let sayfa = await Page.findOne({ sayfaNo });

        if (sayfa) {
            // Güncelle
            sayfa.metin = metin || '';
            sayfa.foto = foto || '';
            sayfa.canvas = canvas || '';
            sayfa.kaydedildi = kaydedildi !== undefined ? kaydedildi : true;
            await sayfa.save();

            console.log(`✅ Sayfa ${sayfaNo} güncellendi`);
        } else {
            // Yeni oluştur
            sayfa = new Page({
                sayfaNo,
                metin: metin || '',
                foto: foto || '',
                canvas: canvas || '',
                kaydedildi: kaydedildi !== undefined ? kaydedildi : true
            });
            await sayfa.save();

            console.log(`✅ Yeni sayfa ${sayfaNo} oluşturuldu`);
        }

        res.json({
            success: true,
            message: 'Sayfa başarıyla kaydedildi!',
            data: {
                id: sayfa._id,
                sayfaNo: sayfa.sayfaNo,
                kaydedildi: sayfa.kaydedildi
            }
        });
    } catch (error) {
        console.error('Sayfa kaydetme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sayfa kaydetme sırasında hata oluştu',
            error: error.message
        });
    }
});

// 3. Tek sayfa sil
app.delete('/api/page/:sayfaNo', async (req, res) => {
    try {
        const { sayfaNo } = req.params;

        const result = await Page.deleteOne({ sayfaNo: parseInt(sayfaNo) });

        if (result.deletedCount > 0) {
            console.log(`✅ Sayfa ${sayfaNo} silindi`);
            res.json({
                success: true,
                message: 'Sayfa başarıyla silindi!'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Sayfa bulunamadı'
            });
        }
    } catch (error) {
        console.error('Sayfa silme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sayfa silme sırasında hata oluştu',
            error: error.message
        });
    }
});

// 4. Tüm sayfaları sil
app.delete('/api/pages', async (req, res) => {
    try {
        const result = await Page.deleteMany({});

        console.log(`✅ ${result.deletedCount} sayfa silindi`);
        res.json({
            success: true,
            message: `${result.deletedCount} sayfa başarıyla silindi!`
        });
    } catch (error) {
        console.error('Sayfalar silme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sayfalar silme sırasında hata oluştu',
            error: error.message
        });
    }
});

// 5. Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server çalışıyor!',
        timestamp: new Date()
    });
});

// Server'ı başlat
app.listen(PORT, () => {
    console.log(`🚀 Server çalışıyor: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});


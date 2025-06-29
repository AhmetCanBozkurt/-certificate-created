# 🏆 Sertifika Oluşturucu - React Uygulaması

Bu proje, React ile geliştirilmiş interaktif bir **sertifika oluşturma aracıdır**. Kullanıcılar, bir sertifika şablonu görseli (PNG/JPG) ve isim listesi (TXT) yükleyerek, listedeki tüm kişiler için özelleştirilmiş sertifikalar oluşturabilir.

## 🚀 Özellikler

- 📄 **PNG/JPG Sertifika Şablonu Yükleme**
- 📜 **TXT formatında isim listesi desteği**
- ✍️ Yazı tipi (font) seçimi
- 🔠 Yazı boyutu belirleme
- 🎨 Yazı rengi seçme
- 📍İsmin yerleşeceği koordinatları belirtme (gelişmiş sürümde)
- 👁️ Anlık önizleme desteği
- 🖨️ Tüm isimler için otomatik sertifika üretimi

## 📷 Ekran Görüntüsü

![Sertifika Oluşturucu Arayüzü](./assets/screenshot.png)

## 📁 Gerekli Dosyalar

1. **Sertifika Şablonu**  
   - PNG veya JPG formatında olmalıdır.  
   - Örneğin: `certificate_template.png`

2. **İsim Listesi (TXT)**  
   - Her satırda bir isim olacak şekilde olmalıdır.  
   - Örneğin:
     ```
     Ahmet Can Bozkurt
     Ayşe Yılmaz
     Mehmet Demir
     ```

## ⚙️ Kullanım

### Adım 1: Şablonu ve İsimleri Yükleyin
- `Sertifika Şablonu Yükle` alanından şablon görselini yükleyin.
- `İsim Listesi Yükle` alanından isimlerin yer aldığı `.txt` dosyasını yükleyin.

### Adım 2: Yazı Ayarlarını Seçin
- Yazı Tipi: Arial, Times New Roman, vb.
- Yazı Boyutu: Örneğin `24`
- Yazı Rengi: Renk kutusundan seçim yapılabilir.

### Adım 3: Önizleme
- Seçilen ilk isim, ayarladığınız yazı stili ile şablona uygulanarak anlık gösterilir.

### Adım 4: Toplu Sertifika Üretimi
- Buton üzerinden tüm isimler için otomatik çıktı alınabilir (gelişmiş sürümde).

## 🧱 Kurulum

Projenin kaynak kodunu yerel makinenize çekmek için:

```bash
git clone https://github.com/kullaniciadi/sertifika-olusturucu.git
cd sertifika-olusturucu
npm install
npm start

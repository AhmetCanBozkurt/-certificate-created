import { useState, useRef, useEffect } from 'react'
import { PDFDocument, /* rgb, StandardFonts */ } from 'pdf-lib'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import './App.css'

function App() {
  const [sertifikaResmi, setSertifikaResmi] = useState<File | null>(null)
  const [imageData, setImageData] = useState<string>('')
  const [isimListesi, setIsimListesi] = useState<string[]>([])
  const [koordinat, setKoordinat] = useState({ x: 0, y: 0 })
  const [boyut, setBoyut] = useState({ width: 0, height: 0 })
  const [yukleniyor, setYukleniyor] = useState(false)
  const [fontBoyutu, setFontBoyutu] = useState<number>(24)
  const [secilenFont, setSecilenFont] = useState<string>('Arial')
  const [yaziRengi, setYaziRengi] = useState<string>('#000000')
  const [renkSecimModu, setRenkSecimModu] = useState<boolean>(false)
  const [ornekYazi, setOrnekYazi] = useState<string>('Ahmet Can Bozkurt')
  const [onizlemeCanvas, setOnizlemeCanvas] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ornekCanvasRef = useRef<HTMLCanvasElement>(null)

  const fontSecenekleri = [
    // Adobe Standart Fontlar (Type 1)
    { id: 'Courier', ad: 'Courier' },
    { id: 'Courier-Bold', ad: 'Courier Bold' },
    { id: 'Courier-Oblique', ad: 'Courier Italic' },
    { id: 'Courier-BoldOblique', ad: 'Courier Bold Italic' },
    { id: 'Helvetica', ad: 'Helvetica' },
    { id: 'Helvetica-Bold', ad: 'Helvetica Bold' },
    { id: 'Helvetica-Oblique', ad: 'Helvetica Italic' },
    { id: 'Helvetica-BoldOblique', ad: 'Helvetica Bold Italic' },
    { id: 'Times-Roman', ad: 'Times Roman' },
    { id: 'Times-Bold', ad: 'Times Bold' },
    { id: 'Times-Italic', ad: 'Times Italic' },
    { id: 'Times-BoldItalic', ad: 'Times Bold Italic' },
    { id: 'Symbol', ad: 'Symbol' },
    { id: 'ZapfDingbats', ad: 'Zapf Dingbats' },

    // CID Fontlar (Asya Dilleri için)
    { id: 'HeiseiKakuGo-W5', ad: 'Heise Kaku Gothic' },
    { id: 'HeiseiMin-W3', ad: 'Heise Mincho' },
    { id: 'HYGoThic-Medium', ad: 'HY Gothic' },
    { id: 'HYSMyeongJo-Medium', ad: 'HY Myeong Jo' },
    { id: 'MHei-Medium', ad: 'MHei' },
    { id: 'MSung-Light', ad: 'MSung' },
    { id: 'STSong-Light', ad: 'STSong' },

    // Windows Sistem Fontları
    { id: 'Arial', ad: 'Arial' },
    { id: 'Arial-Bold', ad: 'Arial Bold' },
    { id: 'Arial-BoldItalic', ad: 'Arial Bold Italic' },
    { id: 'Arial-Italic', ad: 'Arial Italic' },
    { id: 'TimesNewRoman', ad: 'Times New Roman' },
    { id: 'TimesNewRoman-Bold', ad: 'Times New Roman Bold' },
    { id: 'TimesNewRoman-BoldItalic', ad: 'Times New Roman Bold Italic' },
    { id: 'TimesNewRoman-Italic', ad: 'Times New Roman Italic' }
  ]

  // Örnek yazıyı güncelle
  useEffect(() => {
    const canvas = ornekCanvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Canvas'ı temizle
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Arka planı beyaz yap
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Yazı ayarları
        ctx.font = `${fontBoyutu}px "${secilenFont}"`
        ctx.fillStyle = yaziRengi
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // Metni ortala
        const x = canvas.width / 2
        const y = canvas.height / 2
        
        // Metni çiz
        ctx.fillText(ornekYazi, x, y)
      }
    }
  }, [secilenFont, fontBoyutu, yaziRengi, ornekYazi])

  // Önizleme canvas'ını güncelle
  useEffect(() => {
    if (sertifikaResmi && koordinat.x !== 0 && koordinat.y !== 0) {
      const canvas = document.createElement('canvas')
      canvas.width = boyut.width
      canvas.height = boyut.height
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        const img = new Image()
        img.onload = () => {
          // Arka plan resmini çiz
          ctx.drawImage(img, 0, 0, boyut.width, boyut.height)
          
          // Metni çiz
          ctx.font = `${fontBoyutu}px "${secilenFont}"`
          ctx.fillStyle = yaziRengi
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          
          // Anti-aliasing ayarları
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          
          // Örnek metni çiz
          ctx.fillText(ornekYazi, koordinat.x, koordinat.y)
          
          // Canvas'ı base64 formatına çevir
          setOnizlemeCanvas(canvas.toDataURL('image/jpeg', 1.0))
        }
        img.src = imageData
      }
    }
  }, [sertifikaResmi, koordinat, fontBoyutu, secilenFont, yaziRengi, ornekYazi, imageData, boyut])

  const sertifikaYukle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSertifikaResmi(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImageData(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)

      const img = new Image()
      img.onload = () => {
        setBoyut({ 
          width: img.naturalWidth,
          height: img.naturalHeight 
        })
      }
      img.src = URL.createObjectURL(file)
    }
  }

  const isimListesiYukle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const dosya = e.target.files[0]
      const okuyucu = new FileReader()
      okuyucu.onload = (e) => {
        const icerik = e.target?.result as string
        const isimler = icerik.split('\n').map(isim => isim.trim()).filter(isim => isim)
        setIsimListesi(isimler)
      }
      okuyucu.readAsText(dosya)
    }
  }

  useEffect(() => {
    if (sertifikaResmi && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const img = document.createElement('img')
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
      }
      
      img.src = URL.createObjectURL(sertifikaResmi)

      return () => {
        URL.revokeObjectURL(img.src)
      }
    }
  }, [sertifikaResmi])

  const renkSec = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      
      const x = Math.floor((e.clientX - rect.left) * scaleX)
      const y = Math.floor((e.clientY - rect.top) * scaleY)
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const pixel = ctx.getImageData(x, y, 1, 1).data
        const hex = '#' + [pixel[0], pixel[1], pixel[2]]
          .map(x => x.toString(16).padStart(2, '0'))
          .join('')
        
        setYaziRengi(hex)
        setRenkSecimModu(false) // Renk seçildikten sonra modu kapat
      }
    }
  }

  const koordinatBelirle = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (renkSecimModu) {
      renkSec(e)
      return
    }

    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY
      
      setKoordinat({ x, y })
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const img = document.createElement('img')
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          ctx.beginPath()
          ctx.arc(x, y, 5, 0, 2 * Math.PI)
          ctx.fillStyle = 'red'
          ctx.fill()
        }
        img.src = URL.createObjectURL(sertifikaResmi!)

        return () => {
          URL.revokeObjectURL(img.src)
        }
      }
    }
  }

  const tekPDFOlustur = async (isim: string): Promise<Uint8Array> => {
    try {
      // console.log(`${isim} icin PDF olusturuluyor...`)
      
      // Önce canvas üzerine çizim yapalım
      const canvas = document.createElement('canvas')
      canvas.width = boyut.width
      canvas.height = boyut.height
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        throw new Error('Canvas context oluşturulamadı')
      }

      // Arka plan resmini çiz
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imageData
      })
      ctx.drawImage(img, 0, 0, boyut.width, boyut.height)

      // Metni çiz
      ctx.font = `${fontBoyutu}px "${secilenFont}"`
      ctx.fillStyle = yaziRengi
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Anti-aliasing ayarları
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      // Metni çiz
      ctx.fillText(isim, koordinat.x, koordinat.y)
      
      // Canvas'ı JPEG olarak al
      const jpegData = canvas.toDataURL('image/jpeg', 1.0)
      const base64Data = jpegData.split(',')[1]
      const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))

      // PDF oluştur
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([boyut.width, boyut.height])
      
      // JPEG'i PDF'e ekle
      const image = await pdfDoc.embedJpg(imageBytes)
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: boyut.width,
        height: boyut.height
      })

      const pdfBytes = await pdfDoc.save({
        useObjectStreams: false,
        addDefaultPage: false
      })
      
      // console.log('PDF başarıyla oluşturuldu')
      return pdfBytes

    } catch (error) {
      console.error(`${isim} için PDF oluşturma hatası:`, error)
      throw error
    }
  }

  const sertifikalariIndir = async () => {
    if (!imageData) {
      alert('Lütfen önce bir sertifika şablonu yükleyin.')
      return
    }

    setYukleniyor(true)

    try {
      /* const testPdf = await tekPDFOlustur(isimListesi[0]) */
      
      const zip = new JSZip()

      for (const isim of isimListesi) {
        try {
          const pdfBytes = await tekPDFOlustur(isim)
          zip.file(`${isim}.pdf`, pdfBytes)
        } catch (pdfError) {
          console.error(`${isim} için işlem hatası:`, pdfError)
          throw pdfError
        }
      }

      const zipDosyasi = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      })
      
      saveAs(zipDosyasi, 'sertifikalar.zip')
    } catch (error) {
      console.error('Genel hata:', error)
      if (error instanceof Error) {
        console.error('Hata detayı:', error.message)
        console.error('Hata yığını:', error.stack)
      }
      alert('Sertifikalar oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sertifika Oluşturucu</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Sertifika Şablonu Yükle:</label>
          <input type="file" accept="image/*" onChange={sertifikaYukle} className="border p-2" />
          <p className="text-sm text-gray-600 mt-1">PNG veya JPG formatında bir sertifika şablonu yükleyin.</p>
        </div>

        <div>
          <label className="block mb-2">İsim Listesi Yükle (TXT):</label>
          <input type="file" accept=".txt" onChange={isimListesiYukle} className="border p-2" />
          <p className="text-sm text-gray-600 mt-1">Her satırda bir isim olacak şekilde TXT dosyası yükleyin.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Yazı Tipi:</label>
            <select 
              value={secilenFont} 
              onChange={(e) => setSecilenFont(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <optgroup label="Adobe Standart Fontlar">
                {fontSecenekleri.slice(0, 14).map(font => (
                  <option key={font.id} value={font.id}>{font.ad}</option>
                ))}
              </optgroup>
              <optgroup label="CID Fontlar">
                {fontSecenekleri.slice(14, 21).map(font => (
                  <option key={font.id} value={font.id}>{font.ad}</option>
                ))}
              </optgroup>
              <optgroup label="Windows Sistem Fontları">
                {fontSecenekleri.slice(21).map(font => (
                  <option key={font.id} value={font.id}>{font.ad}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block mb-2">Yazı Boyutu:</label>
            <input 
              type="number" 
              value={fontBoyutu}
              onChange={(e) => setFontBoyutu(Number(e.target.value))}
              min="8"
              max="72"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Yazı Rengi:</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={yaziRengi}
                onChange={(e) => setYaziRengi(e.target.value)}
                className="w-full h-10 p-0 border rounded"
              />
              {sertifikaResmi && (
                <button
                  onClick={() => setRenkSecimModu(!renkSecimModu)}
                  className={`px-3 py-2 rounded ${
                    renkSecimModu 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  title="Resimden renk seç"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 10-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53s-.94.19-1.28.53l-.97.97-.75-.75.97-.97c.34-.34.53-.8.53-1.28s.19-.94.53-1.28L12.75 9M15 11.25L12.75 9" />
                  </svg>
                </button>
              )}
            </div>
            {renkSecimModu && (
              <p className="text-sm text-blue-600 mt-1">
                Renk seçmek için resme tıklayın
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2">Önizleme Metni:</label>
          <input
            type="text"
            value={ornekYazi}
            onChange={(e) => setOrnekYazi(e.target.value)}
            placeholder="Önizleme için metin girin"
            className="w-full p-2 border rounded"
          />
        </div>

        {sertifikaResmi && (
      <div>
            <p className="mb-2">
              {renkSecimModu 
                ? 'Renk seçmek için görsele tıklayın'
                : 'İsimlerin yazılacağı yeri seçmek için görsele tıklayın'}
            </p>
            <div className="border p-2 bg-gray-50 rounded">
              <canvas
                ref={canvasRef}
                onClick={koordinatBelirle}
                className={`max-w-full cursor-${renkSecimModu ? 'crosshair' : 'pointer'}`}
                style={{ maxWidth: '100%' }}
              />
            </div>
            {!renkSecimModu && koordinat.x !== 0 && koordinat.y !== 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Seçilen koordinat: X: {Math.round(koordinat.x)}, Y: {Math.round(koordinat.y)}
              </p>
            )}
      </div>
        )}

        {isimListesi.length > 0 && koordinat.x !== 0 && koordinat.y !== 0 && (
          <div>
            <button
              onClick={sertifikalariIndir}
              disabled={yukleniyor}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors ${yukleniyor ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {yukleniyor ? 'İşleniyor...' : `Sertifikaları İndir (${isimListesi.length} adet)`}
        </button>
            <p className="text-sm text-gray-600 mt-1">
              Yüklenen isim sayısı: {isimListesi.length}
            </p>

            {onizlemeCanvas && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Sertifika Önizleme</h3>
                <div className="border p-2 bg-gray-50 rounded">
                  <img 
                    src={onizlemeCanvas} 
                    alt="Sertifika önizleme" 
                    className="max-w-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

# 🎓 Edulera - Online Eğitim ve Sertifika Platformu

**Edulera**, kullanıcıların çeşitli uzmanlık alanlarında video içerikli eğitimler alabileceği, bilgi seviyelerini quizlerle test edip başarılarına göre sertifika kazanabileceği kapsamlı bir e-öğrenme (e-learning) platformudur. 

Bu proje, modern web standartlarına uygun olarak tasarlanmış ve kullanıcı deneyimini ön planda tutan bir arayüze sahiptir.

## 🚀 Projenin Amacı ve Temel Özellikler

Platform, hem bireysel öğrencilere hem de kurumsal firmalara hizmet vermek üzere farklı rol yapılarını destekleyecek şekilde kurgulanmıştır.

* **🔐 Kapsamlı Kullanıcı Yönetimi:** Kayıt ol (Register), Giriş yap (Login) sayfaları ve kullanıcıların aldığı kursları/sertifikaları görebileceği detaylı Profil ekranı.
* **📚 Kurs Kataloğu ve Oynatıcı:** Kategori bazlı filtreleme yapılabilen kurs kataloğu, detaylı kurs içerik sayfaları ve video eğitim oynatıcısı (Player).
* **✍️ Quiz ve Sertifika Sistemi:** Eğitim sonlarında kullanıcıların başarı durumunu ölçen interaktif quizler ve başarıya bağlı olarak üretilen otomatik sertifikalar.
* **💳 Ödeme Sistemi (Checkout):** Ücretli kursların satın alınabilmesi için tasarlanmış ödeme adım sayfaları.
* **🏢 Rol Bazlı Paneller:** Standart öğrenci görünümünün yanı sıra, içerik yönetimi için **Admin** paneli ve şirketlerin kendi çalışanlarını takip edebileceği **Kurumsal (Corporate)** sayfalar.

## 💻 Kullanılan Teknolojiler

Bu projenin arayüzü ve istemci tarafı (client-side) işlevleri tamamen temel web teknolojileri kullanılarak geliştirilmiştir:

* **HTML5:** Sayfa iskeleti ve semantik yapı.
* **CSS3:** Modern, duyarlı (responsive) tasarım, karanlık mod (dark theme) uyumu ve animasyonlar.
* **JavaScript (Vanilla JS):** Sayfa içi etkileşimler, form doğrulamaları ve dinamik arayüz geçişleri.
* **Geliştirme Ortamı:** Visual Studio Code.

## 📁 Proje Klasör Yapısı

Proje dosyaları, modüler bir yaklaşımla işlevlerine göre HTML sayfalarına ayrılmıştır:

```text
├── index.html          # Ana Sayfa
├── login.html          # Kullanıcı Girişi
├── register.html       # Yeni Kayıt
├── profile.html        # Kullanıcı Profil ve Ayarları
├── catalog.html        # Kurs Kataloğu ve Filtreleme
├── course-detail.html  # Kurs Detay ve Tanıtım Sayfası
├── player.html         # Video Eğitim Oynatıcısı
├── quiz.html           # Değerlendirme Sınavları
├── certificate.html    # Başarı Sertifikası Görüntüleme
├── checkout.html       # Satın Alma ve Ödeme Ekranı
├── admin.html          # Yönetim Paneli
└── corporate.html      # Kurumsal Firma Paneli

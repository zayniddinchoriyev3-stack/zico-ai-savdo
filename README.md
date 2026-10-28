# ZICO AI SAVDO — boshlang‘ich demo

Telefon yoki kompyuterdan ko‘rib chiqish mumkin bo‘lgan React/Vite interfeys prototipi.

## Hozir mavjud
- Bosh sahifa va demo ko‘rsatkichlari
- Mahsulotlar ro‘yxati va mahsulot qo‘shish
- AI kontent studiyasi uchun demo ekran
- Instagram, Facebook va YouTube nashr markazi interfeysi
- Nashr rejimi: tasdiqlab nashr qilish, avtomatik nashr yoki ikkala rejim
- Kontent navbati va demo holatlari
- Savdo tahlili va sozlamalar ekranlari
- Moslashuvchan mobil interfeys

## Muhim cheklov
Bu **interfeys prototipi**, tayyor ishlab turgan tijoriy xizmat emas. Hozir:
- haqiqiy AI matn/video generatsiyasi ulanmagan;
- Instagram/Facebook/YouTube akkauntlariga haqiqiy OAuth ulanishi yo‘q;
- tugmalar demo holatini o‘zgartiradi, real post joylamaydi;
- backend, ma’lumotlar bazasi, media saqlash va xavfsiz token boshqaruvi hali kerak.

## Ishga tushirish
Node.js o‘rnatilgan kompyuterda:
```bash
npm install
npm run dev
```

Keyingi bosqichda loyihani GitHub orqali onlayn joylashtirish, so‘ng backend va platformalarning rasmiy API integratsiyalarini bosqichma-bosqich qo‘shish mumkin.

## Rejalashtirilgan arxitektura
1. Frontend: React web ilova.
2. Backend: autentifikatsiya, kontent navbati, rejalashtirilgan vazifalar.
3. Database: foydalanuvchi, mahsulot, buyurtma, kontent va hisobotlar.
4. AI services: matn, ssenariy, tarjima va media yaratish.
5. Secure storage: platforma tokenlari va maxfiy kalitlar.
6. Official APIs: Instagram, Facebook va YouTube.
7. Scheduler/worker: vaqt bo‘yicha avtomatik nashr va xatolarni qayta urinish.
8. Android APK: web ilova barqarorlashgach alohida qadoqlash bosqichi.

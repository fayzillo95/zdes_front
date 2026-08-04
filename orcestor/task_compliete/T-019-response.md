# T-019 Bajarildi

- `advance-list`, `holiday-list`, `adjustment-list`, `leave-list` komponentlarida `loadError` o'zgaruvchisi qo'shildi.
- Yuklash metodlarida xatolik bo'lgan holat uchun ushlanib, `loadError = true` qiymati berildi. 
- Component shablonlariga (`.html`) xatolik holatini anglatuvchi blok qo'shildi (`<div class="error-state-box">`).
- Qayta urinib ko'rish tugmasi orqali ma'lumotlarni qayta yuklash ishga tushirilishi ta'minlandi.
- O'zgartirishlardan so'ng `npm run build` komandasi muvaffaqiyatli o'tdi (xatoliklar kuzatilmadi, faqat ba'zi CSS fayllarning byudjetidan oshib ketganligi bo'yicha ogohlantirishlar chiqdi).

Barcha shartlar bajarildi.

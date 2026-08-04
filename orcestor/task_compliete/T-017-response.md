## T-017 — Vizual Tekshiruv Natijasi (To'g'rilangan)

**Status:** ✅ BAJARILDI (Vizual tasdiqlangan)

---

### Tasdiqlangan Sabablar (Chrome DevTools MCP orqali):

#### 1. Hover holatidagi chiziq sababi
**Fayl:** `src/styles.css` (108-qator)  
**Selektor:** `tr:hover td { background-color: var(--color-border); }`

Bu global qoida hover paytida BARCHA `td` larni `--color-border` (kulrang, `#e2e8f0`) bilan to'ldirardi. `td.actions-cell` esa `display: flex` bo'lgani uchun, flex container ichidagi tugmalar atrofida ota-ona `td` ning kulrang backgroundi "chiziq" kabi ko'rinardi. Har bir komponentda allaqachon `.table-row:hover { background-color: var(--color-bg-secondary) }` qoidasi mavjud — bu global qoida uni o'chirib yuborgan edi.

**Fix:** Overbroad `tr:hover td` qoidasi olib tashlandi.

#### 2. Hoversiz holatdagi chiziq sababi
**Fayl:** `src/styles.css` (133-137 qatorlar)  
**Selektor:** `.column-filter-row th { border-bottom: 1px solid var(--color-border); }`

Filter qatorida "Amallar" ustuniga to'g'ri keluvchi `<th></th>` elementi ichida hech qanday filter input yo'q (bo'sh), lekin unga `border-bottom` qoidasi baribir qo'llanilardi — bu havoda osilib turgan gorizontal chiziq `<hr>` kabi ko'rinardi.

**Fix:** `.column-filter-row th:empty { border-bottom: none !important; }` qo'shildi.

---

### Olib tashlangan noto'g'ri fix:
- `td.actions-cell { display: table-cell !important; }` — bu flex layoutni buzardi (NOTO'G'RI edi)

---

### Commit:
`d267502` — `fix(T-017): proper CSS fix - remove overbroad tr:hover td, fix empty th border`

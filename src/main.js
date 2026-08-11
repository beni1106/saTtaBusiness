import './style.css'
import { createIcons, Menu, X, Mail, Phone, MapPin, Linkedin, Instagram, ChevronDown, ShieldCheck, Users, Layers, ArrowRight, Award, TrendingUp, Check } from 'lucide'
import { dict } from './i18n.js'

// --- Icon (lucide dari npm, bukan CDN, versinya ter-pin di package.json) ---
createIcons({
  icons: { Menu, X, Mail, Phone, MapPin, Linkedin, Instagram, ChevronDown, ShieldCheck, Users, Layers, ArrowRight, Award, TrendingUp, Check }
})

// --- Navbar: tambah shadow tipis begitu discroll (bg-nya udah solid dari awal) ---
const nav = document.getElementById('site-nav')
if (nav) {
  const onScroll = () => {
    const scrolled = window.scrollY > 24
    nav.dataset.scrolled = String(scrolled)
    nav.classList.toggle('shadow-lg', scrolled)
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
}

// --- Off-canvas menu: khusus mobile & tablet (tombolnya sendiri disembunyikan di desktop lewat CSS `lg:hidden`) ---
const menuBtn = document.getElementById('menu-btn')
const menuOverlay = document.getElementById('menu-overlay')
const menuBackdrop = document.getElementById('menu-backdrop')
const menuPanel = document.getElementById('menu-panel')

if (menuBtn && menuOverlay && menuBackdrop && menuPanel) {
  let hideTimeoutId = null
  let lastFocusedEl = null
  // sinkron manual dengan breakpoint `lg` (1024px) punya Tailwind, dipakai buat auto-close menu
  const desktopQuery = window.matchMedia('(min-width: 1024px)')
  const focusableSelector = 'a[href], button:not([disabled])'
  const getFocusable = () => Array.from(menuPanel.querySelectorAll(focusableSelector))

  function openMenu() {
    // BUG LAMA: kalau user klik tutup lalu buka lagi dengan cepat, setTimeout dari closeMenu()
    // sebelumnya bisa nembak belakangan dan tiba-tiba nge-hidden panel yang baru saja dibuka.
    // Fix: batalkan timeout yang masih pending setiap kali openMenu() dipanggil.
    if (hideTimeoutId) { clearTimeout(hideTimeoutId); hideTimeoutId = null }

    lastFocusedEl = document.activeElement
    menuOverlay.classList.remove('hidden')
    requestAnimationFrame(() => {
      menuBackdrop.classList.remove('opacity-0')
      menuPanel.classList.remove('translate-x-full')
      menuOverlay.classList.add('is-open') // trigger animasi stagger link di CSS
    })
    document.body.style.overflow = 'hidden'
    menuBtn.setAttribute('aria-expanded', 'true')
    menuBtn.querySelector('[data-icon-open]')?.classList.add('hidden')
    menuBtn.querySelector('[data-icon-close]')?.classList.remove('hidden')

    // pindahkan fokus ke dalam panel — sebelumnya fokus keyboard tetap "nyangkut"
    // di elemen belakang layar padahal visualnya sudah ketutup overlay
    getFocusable()[0]?.focus()
  }

  function closeMenu({ restoreFocus = true } = {}) {
    menuBackdrop.classList.add('opacity-0')
    menuPanel.classList.add('translate-x-full')
    menuOverlay.classList.remove('is-open')
    document.body.style.overflow = ''
    menuBtn.setAttribute('aria-expanded', 'false')
    menuBtn.querySelector('[data-icon-open]')?.classList.remove('hidden')
    menuBtn.querySelector('[data-icon-close]')?.classList.add('hidden')

    if (hideTimeoutId) clearTimeout(hideTimeoutId)
    hideTimeoutId = setTimeout(() => {
      menuOverlay.classList.add('hidden')
      hideTimeoutId = null
    }, 300)

    // kembalikan fokus ke tombol hamburger (atau elemen sebelumnya) — sebelumnya fokus dibiarkan
    // menggantung di link yang baru saja hilang dari DOM/terklik
    if (restoreFocus) (lastFocusedEl || menuBtn).focus()
  }

  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true'
    isOpen ? closeMenu() : openMenu()
  })
  menuBackdrop.addEventListener('click', () => closeMenu())
  menuPanel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu({ restoreFocus: false })))

  document.addEventListener('keydown', (e) => {
    if (menuBtn.getAttribute('aria-expanded') !== 'true') return
    if (e.key === 'Escape') { closeMenu(); return }

    // focus trap sederhana: selama panel terbuka, Tab tidak boleh "bocor" ke konten di belakangnya
    if (e.key === 'Tab') {
      const focusables = getFocusable()
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
  })

  // BUG LAMA: kalau panel dibuka di mobile lalu layar di-resize/rotasi melewati breakpoint desktop,
  // tombol hamburger otomatis hilang (lg:hidden) tapi panel & scroll-lock body tetap nyangkut terbuka.
  // Fix: auto-close begitu viewport masuk ke ukuran desktop.
  desktopQuery.addEventListener('change', (e) => {
    if (e.matches && menuBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu({ restoreFocus: false })
    }
  })
}

// --- Highlight menu aktif sesuai halaman ---
// Cuma set aria-current; warnanya diatur lewat CSS (attribute selector [data-nav-link][aria-current="page"])
// biar tidak tabrakan spesifisitas sama utility warna Tailwind lain yang sudah menempel di elemen sama.
const currentPage = document.body.dataset.page
if (currentPage) {
  document.querySelectorAll(`[data-nav-link="${currentPage}"]`).forEach(el => {
    el.setAttribute('aria-current', 'page')
  })
}

// --- Reveal-on-scroll pakai IntersectionObserver bawaan browser (bukan AOS) ---
const revealEls = document.querySelectorAll('[data-reveal]')
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || 0
        setTimeout(() => entry.target.classList.add('is-visible'), Number(delay))
        io.unobserve(entry.target)
      }
    })
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
  revealEls.forEach(el => io.observe(el))
} else {
  revealEls.forEach(el => el.classList.add('is-visible'))
}

// --- Accordion sederhana (dipakai di halaman Layanan > Management Training) ---
document.querySelectorAll('[data-accordion-item]').forEach(item => {
  const trigger = item.querySelector('[data-accordion-trigger]')
  const panel = item.querySelector('[data-accordion-panel]')
  const chevron = trigger?.querySelector('[data-chevron]')
  if (!trigger || !panel) return
  trigger.addEventListener('click', () => {
    const isOpen = item.getAttribute('data-open') === 'true'
    item.setAttribute('data-open', String(!isOpen))
    panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : '0px'
    if (chevron) chevron.style.transform = !isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
  })
})

// --- Lang switcher fungsional (client-side, ganti teks lewat data-i18n) ---
const LANG_KEY = 'sbp-lang-v2'
function applyLang(lang) {
  const table = dict[lang] || dict.id
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n
    if (table[key]) el.textContent = table[key]
  })
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder
    if (table[key]) el.setAttribute('placeholder', table[key])
  })
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    const active = btn.dataset.langBtn === lang
    btn.classList.toggle('bg-brand', active)
    btn.classList.toggle('text-[#0F172A]', active)
    btn.classList.toggle('text-white', !active)
    btn.setAttribute('aria-pressed', String(active))
  })
  document.documentElement.lang = lang
  localStorage.setItem(LANG_KEY, lang)
}

document.querySelectorAll('[data-lang-btn]').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.langBtn))
})

applyLang(localStorage.getItem(LANG_KEY) || 'en')
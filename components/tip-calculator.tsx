'use client'

import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import {
  Check,
  ChevronDown,
  Minus,
  Moon,
  Plus,
  ReceiptText,
  RotateCcw,
  Share2,
  Sparkles,
  Sun,
  Users,
  WalletCards,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'

const tipOptions = [10, 15, 18, 20, 25]
const currencies = {
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
} as const

type Currency = keyof typeof currencies

function formatMoney(value: number, currency: Currency) {
  return new Intl.NumberFormat(currencies[currency].locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0)
}

function AnimatedAmount({ value, currency }: { value: number; currency: Currency }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value.toFixed(2)}
        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
        transition={{ type: 'spring', stiffness: 280, damping: 25 }}
        className="block tabular-nums"
      >
        {formatMoney(value, currency)}
      </motion.span>
    </AnimatePresence>
  )
}

function SummaryRow({ label, value, icon: Icon, delay = 0 }: { label: string; value: string; icon: typeof ReceiptText; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      whileHover={{ y: -2 }}
      className="summary-row"
    >
      <span className="flex items-center gap-3 text-muted-foreground"><span className="icon-well"><Icon aria-hidden="true" /></span>{label}</span>
      <span className="font-semibold tabular-nums text-foreground">{value}</span>
    </motion.div>
  )
}

export function TipCalculator() {
  const [billInput, setBillInput] = useState('128.50')
  const [tip, setTip] = useState(20)
  const [custom, setCustom] = useState(false)
  const [people, setPeople] = useState(3)
  const [currency, setCurrency] = useState<Currency>('USD')
  const [taxEnabled, setTaxEnabled] = useState(false)
  const [serviceEnabled, setServiceEnabled] = useState(false)
  const [roundTotal, setRoundTotal] = useState(false)
  const [dark, setDark] = useState(true)
  const [copied, setCopied] = useState(false)

  const bill = Math.max(0, Number.parseFloat(billInput) || 0)
  const tax = taxEnabled ? bill * 0.0825 : 0
  const service = serviceEnabled ? bill * 0.05 : 0
  const tipAmount = bill * (tip / 100)
  const rawTotal = bill + tax + service + tipAmount
  const total = roundTotal ? Math.ceil(rawTotal) : rawTotal
  const perPerson = total / people

  const calculations = useMemo(() => ({ tipAmount, total, perPerson, tax, service }), [tipAmount, total, perPerson, tax, service])

  useEffect(() => {
    document.documentElement.classList.toggle('light', !dark)
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const pointerX = useMotionValue(50)
  const pointerY = useMotionValue(40)
  const glowX = useSpring(pointerX, { stiffness: 70, damping: 24 })
  const glowY = useSpring(pointerY, { stiffness: 70, damping: 24 })

  function reset() {
    setBillInput('0')
    setTip(20)
    setCustom(false)
    setPeople(1)
    setTaxEnabled(false)
    setServiceEnabled(false)
    setRoundTotal(false)
  }

  async function share() {
    const text = `Bill ${formatMoney(total, currency)} · ${tip}% tip · ${formatMoney(perPerson, currency)} each for ${people}`
    if (navigator.share) await navigator.share({ title: 'Split summary', text }).catch(() => undefined)
    else await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <main
      className="app-shell"
      onPointerMove={(event) => {
        pointerX.set((event.clientX / window.innerWidth) * 100)
        pointerY.set((event.clientY / window.innerHeight) * 100)
      }}
    >
      <motion.div aria-hidden="true" className="cursor-light" style={{ left: `${glowX.get()}%`, top: `${glowY.get()}%` }} />
      <div aria-hidden="true" className="aurora aurora-one" />
      <div aria-hidden="true" className="aurora aurora-two" />
      <div aria-hidden="true" className="noise" />

      <div className="app-container">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="topbar"
        >
          <div className="brand-mark" aria-hidden="true"><WalletCards /></div>
          <div className="header-copy">
            <div className="flex items-center gap-2">
              <p className="eyebrow">Smart split</p>
              <span className="live-pill"><span /> Live</span>
            </div>
            <h1>Tip Calculator</h1>
            <p>Split bills beautifully.</p>
          </div>
          <div className="header-actions">
            <label className="currency-select">
              <span className="sr-only">Currency</span>
              <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
                {Object.keys(currencies).map((item) => <option key={item}>{item}</option>)}
              </select>
              <ChevronDown aria-hidden="true" />
            </label>
            <Button variant="ghost" size="icon-lg" aria-label={dark ? 'Use light mode' : 'Use dark mode'} onClick={() => setDark((value) => !value)} className="theme-button">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={dark ? 'sun' : 'moon'} initial={{ opacity: 0, rotate: -45, scale: .7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 45, scale: .7 }}>
                  {dark ? <Sun /> : <Moon />}
                </motion.span>
              </AnimatePresence>
            </Button>
          </div>
        </motion.header>

        <div className="calculator-grid">
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }} className="glass-card controls-card">
            <div className="section-heading"><span>01</span><div><h2>Bill amount</h2><p>Enter your receipt total</p></div></div>
            <label className="bill-field">
              <span>{currencies[currency].symbol}</span>
              <input
                aria-label="Bill amount"
                inputMode="decimal"
                value={billInput}
                onChange={(event) => setBillInput(event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))}
                onFocus={(event) => event.currentTarget.select()}
                placeholder="0.00"
              />
              <span className="field-currency">{currency}</span>
            </label>

            <div className="divider" />
            <div className="section-heading"><span>02</span><div><h2>Choose your tip</h2><p>Select a percentage</p></div></div>
            <div className="tip-grid" role="group" aria-label="Tip percentage">
              {tipOptions.map((option) => (
                <motion.button
                  key={option}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: .92 }}
                  onClick={() => { setTip(option); setCustom(false) }}
                  className="tip-chip"
                  data-active={!custom && tip === option}
                  aria-pressed={!custom && tip === option}
                >
                  {option}%
                  {(!custom && tip === option) && <motion.span layoutId="tip-check"><Check /></motion.span>}
                </motion.button>
              ))}
              <motion.button type="button" whileTap={{ scale: .94 }} onClick={() => setCustom(true)} className="tip-chip" data-active={custom} aria-pressed={custom}>Custom</motion.button>
            </div>
            <AnimatePresence>
              {custom && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="custom-tip">
                  <input aria-label="Custom tip percentage" type="range" min="0" max="50" value={tip} onChange={(e) => setTip(Number(e.target.value))} style={{ '--range': `${tip * 2}%` } as React.CSSProperties} />
                  <output>{tip}%</output>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="divider" />
            <div className="people-row">
              <div className="section-heading"><span>03</span><div><h2>Split between</h2><p>Up to 20 people</p></div></div>
              <div className="stepper">
                <motion.button whileTap={{ scale: .86 }} aria-label="Remove person" disabled={people <= 1} onClick={() => setPeople((n) => Math.max(1, n - 1))}><Minus /></motion.button>
                <AnimatePresence mode="popLayout" initial={false}><motion.strong key={people} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>{people}</motion.strong></AnimatePresence>
                <motion.button whileTap={{ scale: .86 }} aria-label="Add person" disabled={people >= 20} onClick={() => setPeople((n) => Math.min(20, n + 1))}><Plus /></motion.button>
              </div>
            </div>
            <div className="avatars" aria-label={`${people} people`}>
              {Array.from({ length: Math.min(people, 8) }).map((_, index) => (
                <motion.span key={index} initial={{ opacity: 0, scale: 0, x: -10 }} animate={{ opacity: 1, scale: 1, x: 0 }}><Users /></motion.span>
              ))}
              {people > 8 && <span className="avatar-more">+{people - 8}</span>}
            </div>

            <div className="options-grid">
              <Toggle label="Add tax" detail="8.25%" checked={taxEnabled} onChange={setTaxEnabled} />
              <Toggle label="Service" detail="5%" checked={serviceEnabled} onChange={setServiceEnabled} />
              <Toggle label="Round total" detail="Up" checked={roundTotal} onChange={setRoundTotal} />
            </div>
          </motion.section>

          <div className="results-column">
            <motion.section
              key={`${calculations.perPerson}-${people}`}
              initial={{ opacity: 0, scale: .96, y: 22 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 170, damping: 21 }}
              className="hero-result"
            >
              <div className="result-top"><span className="result-label"><Sparkles /> Per person</span><span>{people} {people === 1 ? 'person' : 'people'}</span></div>
              <div className="hero-amount"><AnimatedAmount value={perPerson} currency={currency} /></div>
              <p>That&apos;s all-in, including a {tip}% tip.</p>
              <div className="result-glow" aria-hidden="true" />
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }} className="glass-card summary-card">
              <div className="summary-title"><div><p className="eyebrow">Breakdown</p><h2>Bill summary</h2></div><ReceiptText /></div>
              <div className="summary-list">
                <SummaryRow label="Subtotal" value={formatMoney(bill, currency)} icon={ReceiptText} delay={.34} />
                <SummaryRow label={`Tip · ${tip}%`} value={formatMoney(tipAmount, currency)} icon={Sparkles} delay={.38} />
                {taxEnabled && <SummaryRow label="Tax · 8.25%" value={formatMoney(tax, currency)} icon={ReceiptText} />}
                {serviceEnabled && <SummaryRow label="Service · 5%" value={formatMoney(service, currency)} icon={WalletCards} />}
                <SummaryRow label="Split between" value={`${people} ${people === 1 ? 'person' : 'people'}`} icon={Users} delay={.42} />
              </div>
              <div className="total-row"><span>Total bill</span><span><AnimatedAmount value={total} currency={currency} /></span></div>
            </motion.section>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .46 }} className="action-row">
              <Button variant="outline" size="lg" onClick={reset} className="action-secondary"><RotateCcw data-icon="inline-start" />Reset</Button>
              <Button size="lg" onClick={share} className="action-primary">{copied ? <Check data-icon="inline-start" /> : <Share2 data-icon="inline-start" />}{copied ? 'Copied' : 'Share summary'}</Button>
            </motion.div>
          </div>
        </div>
        <p className="privacy-note"><span /> Calculations stay private on your device</p>
      </div>
    </main>
  )
}

function Toggle({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="option-toggle">
      <span><strong>{label}</strong><small>{detail}</small></span>
      <span className="switch-track" data-active={checked}><motion.span animate={{ x: checked ? 18 : 0 }} /></span>
    </button>
  )
}

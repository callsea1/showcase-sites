<script lang="ts">
  import { onMount } from 'svelte';
  import '@showcase/ui/styles/glass.css';
  import {
    fetchYahooCandles,
    genCandles,
    SYMBOL_MAP,
    type Candle
  } from '$lib/market/yahoo-quotes';

  type Book = { id: string; label: string; name: string; qty: number; avg: number; pnl: number; start: number };

  const BOOKS: Book[] = [
    { id: 'wex', label: 'WEX', name: 'Wex Inc.', qty: 45, avg: 82.1, pnl: 1840, start: 78 },
    { id: 'dkng', label: 'DraftKings', name: 'DraftKings Inc.', qty: 200, avg: 12.4, pnl: 1120, start: 11.8 },
    { id: 't', label: 'AT&T', name: 'AT&T Inc.', qty: 120, avg: 18.5, pnl: 980, start: 17.2 }
  ];

  const TIMEFRAMES = ['1D', '1W', '1M', '3M'] as const;
  let timeframe = $state<(typeof TIMEFRAMES)[number]>('1W');
  let activeId = $state('wex');
  let candles = $state<Candle[]>([]);
  let selectedIdx = $state<number | null>(null);
  let price = $state(84.2);
  let change = $state(4.12);
  let loading = $state(false);
  let liveData = $state(false);
  let toast = $state('');

  let qty = $state(10);
  let limit = $state('');

  const book = $derived(BOOKS.find((b) => b.id === activeId) ?? BOOKS[0]);
  const displayPnl = $derived(liveData ? (price - book.avg) * book.qty : book.pnl);

  async function refresh(id = activeId, tf = timeframe) {
    loading = true;
    const b = BOOKS.find((x) => x.id === id) ?? BOOKS[0];
    const symbol = SYMBOL_MAP[id];
    const count = tf === '1D' ? 24 : tf === '1W' ? 48 : tf === '1M' ? 60 : 90;

    let next: Candle[] | null = null;
    if (symbol) {
      next = await fetchYahooCandles(symbol, tf);
    }

    if (next?.length) {
      candles = next;
      liveData = true;
    } else {
      candles = genCandles(count, b.start);
      liveData = false;
    }

    price = candles[candles.length - 1]?.c ?? b.start;
    limit = price.toFixed(2);
    change = ((price - (candles[0]?.o ?? price)) / (candles[0]?.o ?? 1)) * 100;
    selectedIdx = null;
    loading = false;
  }

  onMount(() => refresh());

  function selectTf(tf: (typeof TIMEFRAMES)[number]) {
    timeframe = tf;
    refresh(activeId, tf);
  }

  function selectBook(id: string) {
    activeId = id;
    refresh(id, timeframe);
  }

  function fmtUsd(n: number) {
    return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  function simulateOrder(side: 'buy' | 'sell') {
    toast = `Simulated ${side.toUpperCase()} · ${qty} ${book.label} @ $${limit} — not executed`;
    setTimeout(() => (toast = ''), 3200);
  }
</script>

<div class="market glass-panel">
  <header class="market__head">
    <div>
      <span class="demo-badge">{liveData ? 'DELAYED · ~15m · DEMO PORTFOLIO' : 'MOCK · DEMO PORTFOLIO'}</span>
      <h2>{book.label} · {book.name}</h2>
      <p class="price">
        ${price.toFixed(2)}
        {#if loading}<span class="loading"> …</span>{/if}
        <span class:up={change >= 0} class:down={change < 0}>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span>
      </p>
    </div>
    <div class="tf-tabs" role="tablist">
      {#each TIMEFRAMES as tf}
        <button
          type="button"
          role="tab"
          aria-selected={timeframe === tf}
          class:active={timeframe === tf}
          onclick={() => selectTf(tf)}
        >
          {tf}
        </button>
      {/each}
    </div>
  </header>

  <div class="chart-wrap glass-chart-frame">
    <svg viewBox="0 0 400 180" class="chart" aria-label="Price chart">
      {#if candles.length}
        {@const min = Math.min(...candles.map((c) => c.l)) - 1}
        {@const max = Math.max(...candles.map((c) => c.h)) + 1}
        {@const range = max - min || 1}
        {#each candles as c, i}
          {@const x = (i / (candles.length - 1)) * 380 + 10}
          {@const bodyTop = 170 - ((Math.max(c.o, c.c) - min) / range) * 150}
          {@const bodyBot = 170 - ((Math.min(c.o, c.c) - min) / range) * 150}
          {@const wickTop = 170 - ((c.h - min) / range) * 150}
          {@const wickBot = 170 - ((c.l - min) / range) * 150}
          {@const up = c.c >= c.o}
          <g
            role="button"
            tabindex="0"
            class="candle"
            class:selected={selectedIdx === i}
            onclick={() => (selectedIdx = selectedIdx === i ? null : i)}
            onkeydown={(e) => e.key === 'Enter' && (selectedIdx = selectedIdx === i ? null : i)}
          >
            <line x1={x} y1={wickTop} x2={x} y2={wickBot} stroke={up ? '#5dff95' : '#ff6b6b'} stroke-width="1" />
            <rect
              x={x - 3}
              y={bodyTop}
              width="6"
              height={Math.max(2, bodyBot - bodyTop)}
              fill={up ? '#5dff95' : '#ff6b6b'}
              opacity={selectedIdx === i ? 1 : 0.85}
            />
          </g>
        {/each}
        <polyline
          fill="none"
          stroke="#9ecbff"
          stroke-width="1.5"
          opacity="0.4"
          points={candles.map((c, i) => `${(i / (candles.length - 1)) * 380 + 10},${170 - ((c.c - min) / range) * 150}`).join(' ')}
        />
      {/if}
    </svg>
    {#if selectedIdx !== null && candles[selectedIdx]}
      {@const c = candles[selectedIdx]}
      <div class="tip">
        O {c.o.toFixed(2)} · H {c.h.toFixed(2)} · L {c.l.toFixed(2)} · C {c.c.toFixed(2)} · Vol {c.v.toLocaleString()}
      </div>
    {/if}
  </div>

  <div class="panels">
    <section class="ticket glass-ticket">
      <h3>Order Ticket</h3>
      <div class="row"><label for="qty">Qty</label><input id="qty" type="number" bind:value={qty} min="1" /></div>
      <div class="row"><label for="limit">Limit</label><input id="limit" type="text" bind:value={limit} /></div>
      <div class="actions">
        <button type="button" class="buy glass-btn" onclick={() => simulateOrder('buy')}>Buy</button>
        <button type="button" class="sell glass-btn" onclick={() => simulateOrder('sell')}>Sell</button>
      </div>
      <p class="fine">Simulated · no real orders · WEX, DraftKings, AT&amp;T</p>
    </section>

    <section class="positions glass-ticket">
      <h3>Positions</h3>
      <ul>
        {#each BOOKS as p}
          <li>
            <button
              type="button"
              class="pos glass-pos-row"
              class:active={activeId === p.id}
              onclick={() => selectBook(p.id)}
            >
              <strong>{p.label}</strong>
              <span>{p.qty} @ ${p.avg}</span>
              <span class="up">+${fmtUsd(activeId === p.id ? displayPnl : p.pnl)}</span>
            </button>
          </li>
        {/each}
      </ul>
    </section>
  </div>

  {#if toast}
    <p class="toast" role="status">{toast}</p>
  {/if}
</div>

<style>
  .market {
    display: grid;
    gap: 1rem;
    padding: 1rem;
  }

  .demo-badge {
    font: 0.6rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.12em;
    padding: 0.2rem 0.5rem;
    border: 1px solid #ff9f43;
    color: #ff9f43;
    border-radius: 4px;
  }

  .market__head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
    align-items: flex-start;
  }

  .market__head h2 {
    margin: 0.5rem 0 0;
    font-size: 1.1rem;
    font-family: 'IBM Plex Mono', monospace;
  }

  .price {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0.25rem 0 0;
  }

  .loading {
    opacity: 0.5;
    font-size: 0.9rem;
  }

  .up {
    color: #5dff95;
  }

  .down {
    color: #ff6b6b;
  }

  .tf-tabs {
    display: flex;
    gap: 0.35rem;
  }

  .tf-tabs button {
    min-height: 44px;
    min-width: 44px;
    padding: 0.4rem 0.75rem;
    border: 1px solid rgba(158, 203, 255, 0.3);
    border-radius: 0.35rem;
    background: transparent;
    color: #9ecbff;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem;
    cursor: pointer;
  }

  .tf-tabs button.active {
    background: #03049c;
    border-color: #9ecbff;
  }

  .chart-wrap {
    position: relative;
    padding: 0.5rem;
  }

  .chart {
    width: 100%;
    height: auto;
    min-height: 160px;
    display: block;
  }

  .candle {
    cursor: pointer;
  }

  .tip {
    margin-top: 0.5rem;
    font: 0.72rem 'IBM Plex Mono', monospace;
    color: #9ecbff;
    opacity: 0.9;
  }

  .panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  @media (max-width: 640px) {
    .panels {
      grid-template-columns: 1fr;
    }
  }

  .ticket h3,
  .positions h3 {
    margin: 0 0 0.75rem;
    font-size: 0.75rem;
    font-family: 'IBM Plex Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.8;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .row label {
    min-width: 3rem;
    font-size: 0.8rem;
  }

  .row input {
    flex: 1;
    min-height: 44px;
    padding: 0.4rem 0.6rem;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(158, 203, 255, 0.3);
    border-radius: 0.35rem;
    color: inherit;
    font-family: inherit;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .actions button {
    flex: 1;
    min-height: 44px;
    border: none;
    border-radius: 0.35rem;
    font-weight: 700;
    cursor: pointer;
    font-family: 'IBM Plex Mono', monospace;
  }

  .buy {
    background: #5dff95;
    color: #0d1117;
  }

  .sell {
    background: #ff6b6b;
    color: #fff;
  }

  .fine {
    margin: 0.75rem 0 0;
    font-size: 0.65rem;
    opacity: 0.55;
  }

  .positions ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .positions li {
    border-bottom: 1px solid rgba(158, 203, 255, 0.1);
  }

  .pos {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 0.5rem;
    width: 100%;
    min-height: 44px;
    padding: 0.5rem 0.35rem;
    border: none;
    border-radius: 0.35rem;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 0.85rem;
    text-align: left;
    cursor: pointer;
  }

  .toast {
    font: 0.72rem 'IBM Plex Mono', monospace;
    color: #9ecbff;
    padding: 0.5rem 0.75rem;
    background: rgba(3, 4, 156, 0.4);
    border-radius: 0.35rem;
    margin: 0;
  }
</style>

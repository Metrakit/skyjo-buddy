import type { GameType } from '../types'

export const GAME_TYPE_COLORS: Record<GameType, string> = {
  skyjo: '#3b82f6',
  papayoo: '#f59e0b',
  flip7: '#8b5cf6',
  uno: '#ef4444'
}

function escapeXml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c] as string)
}

export interface BarChartItem {
  label: string
  value: number
  color?: string
  highlight?: boolean
}

export interface BarChartOptions {
  barHeight?: number
  gap?: number
  labelWidth?: number
  valueWidth?: number
  totalWidth?: number
  maxValue?: number
  valueFormatter?: (v: number) => string
}

export function horizontalBarChart(items: BarChartItem[], options: BarChartOptions = {}): string {
  const barHeight = options.barHeight ?? 22
  const gap = options.gap ?? 10
  const labelWidth = options.labelWidth ?? 110
  const valueWidth = options.valueWidth ?? 40
  const totalWidth = options.totalWidth ?? 400
  const chartWidth = totalWidth - labelWidth - valueWidth - 12

  const max = options.maxValue ?? Math.max(1, ...items.map(i => i.value))
  const totalHeight = Math.max(barHeight, items.length * (barHeight + gap) - gap)
  const formatter = options.valueFormatter ?? ((v: number) => v.toString())

  const bars = items.map((item, i) => {
    const y = i * (barHeight + gap)
    const w = max > 0 ? (item.value / max) * chartWidth : 0
    const color = item.color ?? 'var(--primary-500)'
    const opacity = item.highlight === false ? 0.5 : 1
    return `
      <g>
        <text x="${labelWidth - 8}" y="${y + barHeight / 2}" dominant-baseline="middle" text-anchor="end" class="chart-label">${escapeXml(item.label)}</text>
        <rect x="${labelWidth}" y="${y}" width="${chartWidth}" height="${barHeight}" rx="4" class="chart-bar-bg"/>
        <rect x="${labelWidth}" y="${y}" width="${w}" height="${barHeight}" rx="4" fill="${color}" opacity="${opacity}" class="chart-bar"/>
        <text x="${labelWidth + chartWidth + 8}" y="${y + barHeight / 2}" dominant-baseline="middle" class="chart-value">${escapeXml(formatter(item.value))}</text>
      </g>
    `
  }).join('')

  return `
    <svg class="chart" viewBox="0 0 ${totalWidth} ${totalHeight}" preserveAspectRatio="xMidYMid meet" width="100%" role="img">
      ${bars}
    </svg>
  `
}

export interface DonutSegment {
  label: string
  value: number
  color: string
}

export interface DonutChartOptions {
  size?: number
  thickness?: number
  centerText?: string
  centerSubtext?: string
}

export function donutChart(segments: DonutSegment[], options: DonutChartOptions = {}): string {
  const size = options.size ?? 160
  const thickness = options.thickness ?? 22
  const radius = (size - thickness) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius

  const total = segments.reduce((sum, s) => sum + s.value, 0)

  let arcsHtml = ''
  if (total > 0) {
    let offset = 0
    arcsHtml = segments.map(seg => {
      if (seg.value <= 0) return ''
      const length = (seg.value / total) * circumference
      const arc = `
        <circle
          cx="${cx}" cy="${cy}" r="${radius}"
          stroke="${seg.color}" stroke-width="${thickness}" fill="none"
          stroke-dasharray="${length} ${circumference - length}"
          stroke-dashoffset="${-offset}"
          transform="rotate(-90 ${cx} ${cy})"
          stroke-linecap="butt"
        />
      `
      offset += length
      return arc
    }).join('')
  }

  const center = options.centerText
    ? `<text x="${cx}" y="${cy - (options.centerSubtext ? 4 : 0)}" text-anchor="middle" dominant-baseline="middle" class="donut-center">${escapeXml(options.centerText)}</text>`
    : ''
  const subtext = options.centerSubtext
    ? `<text x="${cx}" y="${cy + 16}" text-anchor="middle" dominant-baseline="middle" class="donut-subtext">${escapeXml(options.centerSubtext)}</text>`
    : ''

  return `
    <svg class="donut" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img">
      <circle cx="${cx}" cy="${cy}" r="${radius}" stroke="var(--gray-100)" stroke-width="${thickness}" fill="none"/>
      ${arcsHtml}
      ${center}
      ${subtext}
    </svg>
  `
}

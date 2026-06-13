import { useEffect, useRef } from 'react'
import { useDesignStore } from '../store/design'
import { createRng, generateSpiral, generateFractal, generateWave, generateCircles, generateNoise } from '../generators/patterns'

const GRAYSCALE_FILTER = `
  <defs>
    <filter id="grayscale-filter">
      <feColorMatrix type="matrix"
        values="0.2126 0.7152 0.0722 0 0
                0.2126 0.7152 0.0722 0 0
                0.2126 0.7152 0.0722 0 0
                0      0      0      1 0"/>
    </filter>
  </defs>`

export default function ArtCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const store = useDesignStore()

  useEffect(() => {
    const rng = createRng(store.seed)
    const { width, height, pattern, iterations, scale, palette, strokeWidth, opacity, bgColor, rotation, grayscaleMode } = store
    let content = ''
    switch (pattern) {
      case 'spiral':  content = generateSpiral(width, height, iterations, scale, palette, rng, strokeWidth, opacity); break
      case 'fractal': content = generateFractal(width, height, iterations, scale, palette, rng, strokeWidth, opacity); break
      case 'wave':    content = generateWave(width, height, iterations, scale, palette, rng, strokeWidth, opacity); break
      case 'circles': content = generateCircles(width, height, iterations, scale, palette, rng, strokeWidth, opacity); break
      case 'noise':   content = generateNoise(width, height, iterations, scale, palette, rng, strokeWidth, opacity); break
    }
    const groupFilter = grayscaleMode ? 'filter="url(#grayscale-filter)"' : ''
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
${grayscaleMode ? GRAYSCALE_FILTER : ''}
  <rect width="${width}" height="${height}" fill="${bgColor}" ${grayscaleMode ? 'filter="url(#grayscale-filter)"' : ''}/>
  <g ${groupFilter} transform="rotate(${rotation},${width/2},${height/2})">${content}</g>
</svg>`
    store.setSvgContent(svg)
    if (containerRef.current) {
      containerRef.current.innerHTML = svg
    }
  }, [store.pattern, store.seed, store.iterations, store.scale, store.rotation,
      store.strokeWidth, store.opacity, store.bgColor, store.palette, store.width, store.height, store.grayscaleMode])

  return (
    <div
      ref={containerRef}
      className="shadow-2xl rounded border border-gray-700"
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
        filter: store.grayscaleMode ? 'grayscale(100%)' : 'none',
      }}
    />
  )
}

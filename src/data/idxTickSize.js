// Engine Fraksi Harga Resmi Bursa Efek Indonesia (IDX Tick Size Rules)
// Aturan SK Direksi PT BEI:
// 1. < 200: fraksi Rp 1, maks perubahan 10 tick
// 2. 200 - 500: fraksi Rp 2, maks perubahan 10 tick
// 3. 500 - 2000: fraksi Rp 5, maks perubahan 10 tick
// 4. 2000 - 5000: fraksi Rp 10, maks perubahan 10 tick
// 5. > 5000: fraksi Rp 25, maks perubahan 10 tick

export function getIdxTickSize(price) {
  if (price < 200) return 1
  if (price < 500) return 2
  if (price < 2000) return 5
  if (price < 5000) return 10
  return 25
}

// Menyelaraskan harga sembarang ke harga tick bursa yang sah
export function roundToIdxTick(price, direction = 'round') {
  if (!price || price <= 0) return 50
  const tick = getIdxTickSize(price)
  if (direction === 'floor') {
    return Math.floor(price / tick) * tick
  } else if (direction === 'ceil') {
    return Math.ceil(price / tick) * tick
  }
  return Math.round(price / tick) * tick
}

// Menambah/mengurangi N tick dari harga tertentu
export function shiftTicks(price, steps) {
  let current = roundToIdxTick(price)
  const sign = steps >= 0 ? 1 : -1
  const absSteps = Math.abs(steps)

  for (let i = 0; i < absSteps; i++) {
    const tick = getIdxTickSize(current)
    current += sign * tick
    if (current < 50) return 50 // Minimum harga reguler bursa (kecuali papan pemantauan khusus)
  }
  return current
}

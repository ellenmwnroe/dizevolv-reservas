// lib/conflict.ts

export type TimeInterval = {
    start: Date
    end: Date
  }
  
  /**
   * Verifica se dois intervalos de tempo conflitam, considerando um buffer de tolerância (em minutos).
   */
  export function hasTimeConflict(
    existingStart: Date,
    existingEnd: Date,
    newStart: Date,
    newEnd: Date,
    bufferMinutes: number = 10
  ): boolean {
    const bufferMs = bufferMinutes * 60 * 1000
    
    // Adiciona o buffer ao redor do intervalo existente
    const bufferedStart = new Date(existingStart.getTime() - bufferMs)
    const bufferedEnd = new Date(existingEnd.getTime() + bufferMs)
  
    // Verifica sobreposição com margem de buffer
    return newStart < bufferedEnd && newEnd > bufferedStart
  }
export function formatPercentWithoutSymbol(value: number, precision = 2) {
  const formattedValue = Number(value)
  const percentValue = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(formattedValue)

  return percentValue.replaceAll('%', '').replaceAll(',', '.')
}

export function generateSlug(name: string): string {
  return name
    .normalize('NFD') // Separa acentos das letras base (ex: 'ã' -> 'a' + '~')
    .replace(/[\u0300-\u036f]/g, '') // Remove os acentos combinados
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_') // Substitui qualquer caractere não alfanumérico por '_'
    .replace(/^_|_$/g, '') // Remove underscores no início ou fim
}

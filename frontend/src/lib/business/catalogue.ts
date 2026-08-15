export function cleanCatalogueLabel(value: string): string {
  return value
    .trim()
    .replace(/sequrity/gi, 'Security')
    .replace(/meterials/gi, 'Materials')
}

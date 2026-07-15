export function fallbackRecordsForProvider(previousPublished, provider, generatedRecords) {
  if (generatedRecords !== 0) return [];
  return previousPublished.filter((item) => item.provider === provider);
}

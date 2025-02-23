export const GetLocalDate = (): Date => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
};

export const FormatLocalDate = (date: Date): Date => {
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() - 3);
  return adjustedDate;
};


//this function takes a duration in minutes and returns a formatted string in hours and minutes
export const formatDuration = (minutes, t) => {
  if (!minutes || minutes <= 0) return '';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} ${t('minutes')}`;
  }

  if (mins === 0) {
    return `${hours} ${hours === 1 ? t('hour') : t('hours')}`;
  }

  return `${hours} ${hours === 1 ? t('hour') : t('hours')} ${mins} ${t('minutes')}`;
};
export const START_DATE_STR = '2026-08-17T00:00:00';
export const END_DATE_STR = '2026-09-05T23:59:59';

export const getStartDate = () => new Date(START_DATE_STR);
export const getEndDate = () => new Date(END_DATE_STR);

export function getHiringState(now: Date = new Date()) {
  const startDate = getStartDate();
  const endDate = getEndDate();

  if (now < startDate) {
    return 'upcoming';
  } else if (now > endDate) {
    return 'closed';
  } else {
    return 'active';
  }
}

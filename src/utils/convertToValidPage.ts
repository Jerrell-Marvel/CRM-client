export const convertToValidPage = (page: string | null): number => {
  let tempPage = Number(page);

  if (isNaN(tempPage) || tempPage < 1) {
    return 1;
  }

  return tempPage;
};

export const truncateText = (input, displayLength) => {
  if (input.length <= displayLength * 2 + 3) {
      return input;
  }

  const start = input.substring(0, displayLength);
  const end = input.substring(input.length - displayLength);
  return `${start}...${end}`;
}
export const DAY_COLORS = [
  '#e4572e', '#2e86ab', '#7a9e3a', '#a23b72',
  '#f18f01', '#3b5bdb', '#0c8a7a', '#8d6e63',
]

export const dayColor = (index: number) => DAY_COLORS[index % DAY_COLORS.length]

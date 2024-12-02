const sizes = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 56,
  xxxxl: 80,
};

const { xxs, xs, sm, md, lg, xl, xxl, xxxl } = sizes;

export default {
  xxs,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  xxxl,
  borderRadius: {
    sm: xs,
    md: sm,
    lg: md,
    xl: lg,
    round: 9999,
  },
};

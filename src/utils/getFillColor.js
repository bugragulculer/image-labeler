import { colors } from "../constants/colors";

// Get the fill color based on the step.

export const getFillColor = (step) => {
  return colors[step + 1];
};

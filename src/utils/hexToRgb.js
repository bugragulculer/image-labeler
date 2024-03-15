// Convert a hex color code to RGBA format.

export function hexToRGBA(hex, opacity) {
  let red = 0,
    green = 0,
    blue = 0;

  if (hex?.length === 4) {
    red = parseInt(hex[1] + hex[1], 16);
    green = parseInt(hex[2] + hex[2], 16);
    blue = parseInt(hex[3] + hex[3], 16);
  } else if (hex?.length === 7) {
    red = parseInt(hex[1] + hex[2], 16);
    green = parseInt(hex[3] + hex[4], 16);
    blue = parseInt(hex[5] + hex[6], 16);
  }

  // Constructing and returning the RGBA representation
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

// // utils/addressParser.ts

// export function parseStreetAddress(fullAddress: string): string {
//   // Split the address into parts
//   const parts = fullAddress.split(",");

//   // The street address is typically the first part
//   let streetAddress = parts[0].trim();

//   // If the street address contains a number, we're good
//   if (/\d/.test(streetAddress)) {
//     return streetAddress;
//   }

//   // If not, it might be in the second part (rare cases)
//   if (parts.length > 1 && /\d/.test(parts[1])) {
//     return parts[1].trim();
//   }

//   // If we couldn't find a number, just return the first part
//   return streetAddress;
// }

export default function parseAddress(fullAddress: string): {
  fullAddress: string;
  displayAddress: string;
} {
  const parts = fullAddress.split(",").map((part) => part.trim());

  // Assume the first part is always the street address
  let streetAddress = parts[0];

  // If the street address doesn't contain a number, look in the second part
  if (!/\d/.test(streetAddress) && parts.length > 1) {
    streetAddress = `${parts[0]}, ${parts[1]}`;
  }

  return {
    fullAddress: fullAddress,
    displayAddress: streetAddress,
  };
}

// Gallery (TAK-1491): VOID's provider asks for location permission and checks
// the service area against Supabase. The gallery pins the customer to the
// fixture drop-off instead.
import type { PropsWithChildren } from "react";

const location = {
  inServiceArea: true,
  serviceAreaChecking: false,
  location: { latitude: 53.2602, longitude: -9.0766 },
  fullAddress: "14 Raleigh Row, Salthill, Galway",
  street: "14 Raleigh Row",
  city: "Galway",
  county: "Galway",
  postcode: "H91",
  displayAddress: "14 Raleigh Row",
  addressLabel: "Home",
  loading: false,
  locationPermissionStatus: null,
  apartmentNumber: null,
};

export const LocationProvider = ({ children }: PropsWithChildren) => <>{children}</>;

export const useLocation = () => location;

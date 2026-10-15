import { Input, View } from "@/components/ui";
import { SelectRow } from "@/components/onboarding/SelectRow";
import { PhoneInput } from "@/components/phone/PhoneInput";
import { COUNTRIES, type Country } from "@/components/phone/countries";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { Bike, Car, Footprints } from "lucide-react-native";
import { useState } from "react";
import { ScrollView } from "react-native";

const VEHICLES = [
  { id: "bike", label: "Bicycle", description: "No licence needed", icon: Bike },
  { id: "car", label: "Car", description: "Licence and insurance", icon: Car },
  { id: "foot", label: "On foot", description: "City centre only", icon: Footprints },
];

// Recipe §3.3: one Input card per field, gap 12. §3.4: SelectRow for inline choice.
export default function Inputs() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState<Country>(COUNTRIES.find((c) => c.iso2 === "IE") ?? COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("bike");

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 48 }}
    >
      <SectionTitle>Input</SectionTitle>
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        <Input placeholder="Name" value={name} onChangeText={setName} />
        <Input label="Business name" required placeholder="Required field" />
        <Input label="Email" placeholder="you@example.com" hint="We send the code here" keyboardType="email-address" />
        <Input label="Handle" defaultValue="taken" error="That handle is taken" />
        <Input label="Bio" placeholder="Multiline" multiline />
      </View>

      <SectionTitle>PhoneInput</SectionTitle>
      <View style={{ paddingHorizontal: 16 }}>
        <PhoneInput country={country} onCountryChange={setCountry} value={phone} onChangeText={setPhone} />
      </View>

      <SectionTitle inset={32}>SelectRow</SectionTitle>
      <SettingsGroup>
        {VEHICLES.map((v, i) => (
          <SelectRow
            key={v.id}
            icon={v.icon}
            label={v.label}
            description={v.description}
            selected={vehicle === v.id}
            isLast={i === VEHICLES.length - 1}
            onPress={() => setVehicle(v.id)}
          />
        ))}
      </SettingsGroup>
    </ScrollView>
  );
}

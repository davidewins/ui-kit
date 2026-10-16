// Excerpt of VOID src/app/_layout.tsx (VOID main, 16 Oct 2026). Reference only,
// not a compilable file. Lines are verbatim; "// ..." marks VOID-only code left
// out (OneSignal, Sentry, pending deep links and notifications, providers).

import { Session } from "@supabase/supabase-js";

// inside RootLayout()
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  // ...

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
      // ...
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // ...
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inProtectedGroup = segments[0] === "(protected)";
    const isEmailConfirmed = session?.user?.email_confirmed_at !== null;
    const hasConfirmedSession = !!session && isEmailConfirmed;

    if (hasConfirmedSession && inAuthGroup) {
      router.replace("/(protected)/(tabs)/home");
    } else if (!hasConfirmedSession && inProtectedGroup) {
      router.replace("/(auth)");
    }
    // ...
  }, [session, initialized, segments]);

  useEffect(() => {
    if (loaded && fontReady && initialized) {
      SplashScreen.hideAsync().catch(() => {});
      markInteractive();
    }
  }, [loaded, fontReady, initialized]);

  if (!loaded || !fontReady || !initialized) {
    return null;
  }

  // Check if user has confirmed their email
  const isEmailConfirmed = session?.user?.email_confirmed_at !== null;
  const hasConfirmedSession = !!session && isEmailConfirmed;
  // A signed-in reload lands on the (auth) welcome route first and the effect
  // above replace()s to home a beat later (visible for ~1s on Android) - and
  // the reverse for a signed-out user on a protected route. Cover that frame
  // with a plain background instead of flashing the wrong screen.
  const redirectPending = hasConfirmedSession
    ? segments[0] === "(auth)"
    : segments[0] === "(protected)";

  // ... providers, then:
            <Stack screenOptions={{}}>
            <Stack.Screen
              name="(auth)"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="(protected)"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            {/* ... (aux) modal group etc. */}
            </Stack>
            {redirectPending ? (
              <View
                pointerEvents="none"
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: (colorScheme === "dark"
                      ? DarkTheme
                      : DefaultTheme
                    ).colors.background,
                  },
                ]}
              />
            ) : null}

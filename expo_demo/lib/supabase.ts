import { AppState } from 'react-native'
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://utlankoqlpvjmwacdzai.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0bGFua29xbHB2am13YWNkemFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NTQxNjMsImV4cCI6MjA2MDQzMDE2M30.JpiWZ67ayIrDxrpTWDhh5LppurXaxs1Cwye-nwJz7CI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}), // ???
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: false, // this is buggy : https://github.com/orgs/supabase/discussions/25909
    detectSessionInUrl: false,
  },
})

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})
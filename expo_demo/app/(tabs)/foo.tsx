import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://utlankoqlpvjmwacdzai.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0bGFua29xbHB2am13YWNkemFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NTQxNjMsImV4cCI6MjA2MDQzMDE2M30.JpiWZ67ayIrDxrpTWDhh5LppurXaxs1Cwye-nwJz7CI");

type Instrument = {
  name: string; // Adjust this type based on your actual data structure
};

export default function TabThreeScreen() {
  const [instruments, setInstruments] = useState<Instrument[] | null>(null);
  useEffect(() => {
    getInstruments();
  }, []);
  async function getInstruments() {
    const { data } = await supabase.from("instruments").select();
    setInstruments(data);
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">foo</ThemedText>
      </ThemedView>
      <ThemedText>
        <ul>
          {instruments?.map((instrument) => (
            <li key={instrument.name}>{instrument.name}</li>
          ))}
        </ul>
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

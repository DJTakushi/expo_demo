import { StyleSheet, Button, TextInput, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEffect, useState } from "react";
import * as React from 'react';
import { DataTable } from 'react-native-paper';

import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://utlankoqlpvjmwacdzai.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0bGFua29xbHB2am13YWNkemFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NTQxNjMsImV4cCI6MjA2MDQzMDE2M30.JpiWZ67ayIrDxrpTWDhh5LppurXaxs1Cwye-nwJz7CI");

/* this isn't in the official docs, but the official examples for produce 
    warnings in the codebase.  Defining these classes seems to be safer.
*/
type Instrument = {
  name: string;
  description: string;
};

export default function TabThreeScreen() {
  const [InputName, setInputName] = useState('instrument name');
  const [InputDescription, setInputDescription] = useState('instrument description');
  const [instruments, setInstruments] = useState<Instrument[] | null>(null);
  useEffect(() => {
    getInstruments();
  }, []);
  async function getInstruments() {
    const { data } = await supabase.from("instruments").select();
    setInstruments(data);
  }
  async function addInstrument(name: string, desc: string) {
    const { data } = await supabase.from("instruments").insert({ name: name, description: desc });
    getInstruments();
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
        <DataTable>
          <DataTable.Header>
            <DataTable.Title><ThemedText>name</ThemedText></DataTable.Title>
            <DataTable.Title style={[styles.desc_column]}><ThemedText>description</ThemedText></DataTable.Title>
            <DataTable.Title><ThemedText>[]</ThemedText></DataTable.Title>
          </DataTable.Header>
          {instruments?.map((instrument) => (
            <DataTable.Row key={instrument.name}>
              <DataTable.Cell><ThemedText>{instrument.name}</ThemedText></DataTable.Cell>
              <DataTable.Cell style={styles.desc_column}><ThemedText>{instrument.description}</ThemedText></DataTable.Cell>
              <DataTable.Cell>
                <Button
                  title="Replae this with modal"
                  onPress={() => console.log('replace this with modal')}
                />
              </DataTable.Cell>

            </DataTable.Row>
          ))}
        </DataTable>
      </ThemedText>
      <TextInput
        style={styles.input}
        onChangeText={setInputName}
        value={InputName}
      />
      <TextInput
        style={styles.input}
        onChangeText={setInputDescription}
        value={InputDescription}
      />
      <Button
        title="Press me"
        onPress={() => addInstrument(InputName, InputDescription)}
      />
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 4,
    paddingLeft: 10,
    padding: 10,
    color: '#808080'
  },
  desc_column: {
    flex: 3,
  },
});

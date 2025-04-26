import { Alert, StyleSheet, Button, Text, TextInput, Modal, Pressable, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

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
  id: number;
  name: string;
  description: string;
};

export default function TabThreeScreen() {
  const [InputName, setInputName] = useState('instrument name');
  const [InputDescription, setInputDescription] = useState('instrument description');
  const [instruments, setInstruments] = useState<Instrument[] | null>(null);
  const [instrument_tgt_id, setInstrument_tgt_id] = useState<number>(0);
  const [instrument_tgt_name, setInstrument_tgt_name] = useState<string>('');
  const [instrument_tgt_description, setInstrument_tgt_description] = useState<string>('');
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
  async function updateInstrument(id: number, name: string, desc: string) {
    const { data } = await supabase.from("instruments").update({ name: name, description: desc }).eq('id', id);
    getInstruments();
  }
  async function deleteInstrument(id: number) {
    const { data } = await supabase.from("instruments").delete().eq('id', id);
    getInstruments();
  }
  const [modalCreateVisible, setmodalCreateVisible] = useState(false);
  const [modalEditVisible, setmodalEditVisible] = useState(false);
  const [modalDeleteVisible, setmodalDeleteVisible] = useState(false);

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
            <DataTable.Title><ThemedText></ThemedText></DataTable.Title>
          </DataTable.Header>
          {instruments?.map((instrument) => (
            <DataTable.Row key={instrument.name}>
              <DataTable.Cell><ThemedText>{instrument.name}</ThemedText></DataTable.Cell>
              <DataTable.Cell style={styles.desc_column}><ThemedText>{instrument.description}</ThemedText></DataTable.Cell>
              <DataTable.Cell>
                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => {
                    setInstrument_tgt_id(instrument.id);
                    setInstrument_tgt_name(instrument.name);
                    setInstrument_tgt_description(instrument.description);
                    setmodalEditVisible(true)
                  }}>
                  <Text style={styles.textStyle}>edit
                  </Text>
                </Pressable>
                <ThemedText> / </ThemedText>
                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => {
                    setInstrument_tgt_id(instrument.id);
                    setInstrument_tgt_name(instrument.name);
                    setmodalDeleteVisible(true)
                  }}>
                  <Text style={styles.textStyle}>delete</Text>
                </Pressable>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ThemedText>
      <Pressable
        style={[styles.button, styles.buttonOpen, styles.width_150]}
        onPress={() => setmodalCreateVisible(true)}>
        <Text style={styles.textStyle}>Create Instrument</Text>
      </Pressable>
      <SafeAreaProvider>
        <SafeAreaView style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalEditVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed');
              setmodalEditVisible(!modalEditVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{instrument_tgt_name}</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setInstrument_tgt_name}
                  value={instrument_tgt_name}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={setInstrument_tgt_description}
                  value={instrument_tgt_description}
                />
                <Button
                  title="Update"
                  onPress={() => {
                    updateInstrument(instrument_tgt_id, instrument_tgt_name, instrument_tgt_description)
                    setmodalEditVisible(!modalEditVisible)
                  }
                  }
                />
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalCreateVisible}
            onRequestClose={() => {
              setmodalCreateVisible(!modalCreateVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Create</Text>
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
                  title="Create"
                  onPress={() => {
                    addInstrument(InputName, InputDescription);
                    setmodalCreateVisible(false);
                  }}
                />
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalDeleteVisible}
            onRequestClose={() => {
              setmodalDeleteVisible(false);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Delete {instrument_tgt_name}?</Text>
                <Button
                  title="Delete"
                  onPress={() => {
                    deleteInstrument(instrument_tgt_id)
                    setmodalDeleteVisible(false);
                  }}
                />
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </SafeAreaProvider>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  width_150: {
    width: 150,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

import React, {useState} from 'react';
import {Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {
  NativeModal,
  NativeSheet,
  NativeSheetProvider,
  presentAlert,
  presentToast,
  useNativeSheet,
} from 'react-native-universal-sheet';

function Demo() {
  const sheet = useNativeSheet();
  const [lastEvent, setLastEvent] = useState('none yet');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>react-native-universal-sheet</Text>
      <Text style={styles.status}>Last event: {lastEvent}</Text>

      <Button title="Open bottom sheet (imperative)" onPress={() => setSheetOpen(true)} />
      <Button title="Open center modal" onPress={() => setModalOpen(true)} />
      <Button
        title="Show alert"
        onPress={() =>
          presentAlert(sheet, {
            id: 'confirm-delete',
            title: 'Delete item?',
            message: 'This cannot be undone.',
            actions: [
              {label: 'Cancel', style: 'cancel'},
              {label: 'Delete', style: 'destructive', onPress: () => setLastEvent('deleted')},
            ],
            appearance: {backgroundColor: '#FFFFFF', cornerRadius: 20, width: 300},
          })
        }
      />
      <Button
        title="Show toast"
        onPress={() => presentToast(sheet, {id: 'saved', message: 'Saved', durationMs: 2000})}
      />
      <Button title="Dismiss topmost" onPress={() => sheet.dismiss()} />

      {/* Declarative bottom sheet with custom design */}
      <NativeSheet
        visible={sheetOpen}
        snapPoints={['50%', '90%']}
        initialSnapPoint="50%"
        appearance={{
          backgroundColor: '#FFF8F0',
          cornerRadius: 28,
          handleColor: '#C2703D',
          borderColor: '#E0B98F',
          borderWidth: 1,
          shadowRadius: 16,
          shadowOpacity: 0.25,
          backdropOpacity: 0.5,
        }}
        styles={{contentStyle: {padding: 20, gap: 12}}}
        onDismiss={() => {
          setSheetOpen(false);
          setLastEvent('sheet dismissed');
        }}
        onSnapChange={index => setLastEvent(`sheet snap ${index}`)}>
        <ProfileSheetContent />
      </NativeSheet>

      {/* Declarative centre modal */}
      <NativeModal
        visible={modalOpen}
        presentation="center"
        appearance={{width: 320, cornerRadius: 16, backgroundColor: '#FFFFFF'}}
        styles={{contentStyle: {padding: 20, gap: 8}}}
        onDismiss={() => {
          setModalOpen(false);
          setLastEvent('modal dismissed');
        }}>
        <Text style={styles.heading}>Center modal</Text>
        <Text>Customised with props: width, corner radius and background.</Text>
        <Button title="Close" onPress={() => setModalOpen(false)} />
      </NativeModal>
    </SafeAreaView>
  );
}

function ProfileSheetContent() {
  const sheet = useNativeSheet();
  const [name, setName] = useState('Ada');

  return (
    <ScrollView>
      <Text style={styles.heading}>Profile</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Name" />
      <Text>Typed name: {name}</Text>
      <Button
        title="Edit (stacked sheet)"
        onPress={() =>
          sheet.present({
            id: 'edit',
            content: <EditSheetContent />,
            sizing: 'medium',
            presentation: 'stack',
          })
        }
      />
      {Array.from({length: 30}, (_, i) => (
        <Text key={i} style={styles.row}>
          Row {i + 1}
        </Text>
      ))}
    </ScrollView>
  );
}

function EditSheetContent() {
  const sheet = useNativeSheet();
  return (
    <View style={styles.body}>
      <Text style={styles.heading}>Edit (child sheet)</Text>
      <Text>The profile sheet stays open underneath, with its state.</Text>
      <Button title="Close this sheet" onPress={() => sheet.dismiss('edit')} />
    </View>
  );
}

export default function App() {
  return (
    <NativeSheetProvider>
      <Demo />
    </NativeSheetProvider>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, padding: 24, gap: 12, justifyContent: 'center'},
  title: {fontSize: 20, fontWeight: '700'},
  status: {color: '#555'},
  body: {padding: 20, gap: 12},
  heading: {fontSize: 18, fontWeight: '600'},
  input: {borderWidth: 1, borderColor: '#999', borderRadius: 8, padding: 10},
  row: {paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth},
});

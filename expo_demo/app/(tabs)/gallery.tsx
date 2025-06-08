import { Alert, StyleSheet, Button, Text, TextInput, Modal, Pressable, View, Image } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as React from 'react';
import { supabase } from '../../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { DataTable } from 'react-native-paper';
import { Timestamp } from 'react-native-reanimated/lib/typescript/commonTypes';

type gallery_images = {
  id: number;
  created_at: Timestamp;
  name: string;
  description: string;
  url: string;
};

type Profile = {
  username: string;
  avatar_url: string;
  // avatar_url_full: string;
};

export default function TabFourScreen() {
  const [session, setSession] = React.useState<Session | null>(null)
  const [profiles, setProfiles] = React.useState<Profile[] | null>([]);
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);
  const [galleryImages, setGalleryImages] = React.useState<gallery_images[] | null>([]);
  const [galleryImageUrls, setGalleryImageUrls] = React.useState<string[]>([]);
  const avatarSize = { height: 150, width: 150 }
  const galleryImageSize = { height: 800, width: 1200 }

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    getProfiles();
    getGalleryImages();
  }, []);

  // gets profiles
  async function getProfiles() {
    const { data } = await supabase.from("profiles").select();
    setProfiles(data);

    // add updateFullUrl process for each profile object
    for (let i = 0; i < data.length; i++) {
      if (data[i].avatar_url) {
        await updateFullUrl(data[i].avatar_url, i);
      } else {
      }
    }
  }

  // updates imageUrls asynchronously`
  async function updateFullUrl(path: string, idx: number) {
    var fullUrlPath = "";
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)

      if (error) {
        throw error
      }

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        fullUrlPath = fr.result as string

        const newImageUrls = [...imageUrls]; // Create a new array to avoid mutating the state directly
        newImageUrls[idx] = fullUrlPath; // Store the full URL in the new array
        setImageUrls(newImageUrls); // Update the state with the new array

        // This often finishes before profiles were loaded, causing errors
        // var profilesNew = [...profiles]; // Create a new array to avoid mutating the state directly
        // console.log("profilesNew", profilesNew);
        // profilesNew[idx].avatar_url_full = fullUrlPath; // Store the full URL in the profile object
        // setProfiles(profilesNew); // Update the state with the new profiles array
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
  }

  // gets profiles
  async function getGalleryImages() {
    const { data } = await supabase.from("gallery_images").select();
    console.log("galleryImages", data);
    
    // add updateFullUrl process for each profile object
    for (let i = 0; i < data.length; i++) {
      if (data[i].url) {
        await updateGalleryFullUrl(data[i].url, i);
        
        data[i].url = "https://utlankoqlpvjmwacdzai.supabase.co/storage/v1/object/public/gallerypictures/" + data[i].url;
      } else {
      }
    }

    setGalleryImages(data);
  }
  // updates galleryImageUrls asynchronously`
  async function updateGalleryFullUrl(path: string, idx: number) {
    console.log("updateGalleryFullUrl for idx", idx, "path", path);
    var fullUrlPath = "";
    try {
      const { data, error } = await supabase.storage.from('gallerypictures').download(path)

      if (error) {
        throw error
      }

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        fullUrlPath = fr.result as string

        const newGalleryImageUrls = [...galleryImageUrls];
        newGalleryImageUrls[idx] = fullUrlPath;
        setGalleryImageUrls(newGalleryImageUrls);
        console.log("galleryImageUrls", galleryImageUrls);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
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
        <ThemedText type="title">gallery</ThemedText>
      </ThemedView>

      {galleryImages?.map((galleryImage) => (
        <View key={galleryImage.id} style={{ margin: 10 }}>
          <Image
            // source={{ uri: galleryImageUrls[galleryImages.indexOf(galleryImage)] }}
            source={{ uri: galleryImage.url }}
            accessibilityLabel="Gallery Image"
            style={[galleryImageSize, styles.avatar, styles.image]}
          // onLoad={() => updateGalleryFullUrl(galleryImage.image_url, galleryImages.indexOf(galleryImage))}// TODO :attempt using onLoad to complete the image URL
          />
          <ThemedText>{galleryImage.name}</ThemedText>
          <ThemedText>{new Date(galleryImage.created_at).toLocaleDateString()}</ThemedText>
          <ThemedText>{galleryImage.description}</ThemedText>
        </View>
      ))}

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">team</ThemedText>
      </ThemedView>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title><ThemedText>name</ThemedText></DataTable.Title>
          <DataTable.Title><ThemedText>avatar_url</ThemedText></DataTable.Title>
          <DataTable.Title><ThemedText>avatar</ThemedText></DataTable.Title>
        </DataTable.Header>
        {profiles?.map((profile) => (
          <DataTable.Row key={profile.username}>
            <DataTable.Cell><ThemedText>{profile.username}</ThemedText></DataTable.Cell>
            <DataTable.Cell style={styles.desc_column}><ThemedText>{profile.avatar_url}</ThemedText></DataTable.Cell>
            <DataTable.Cell style={styles.desc_column}><ThemedText>
              <Image
                source={{ uri: imageUrls[profiles.indexOf(profile)] }}
                // source={{ uri: profile.avatar_url_full }}
                accessibilityLabel="Avatar"
                style={[avatarSize, styles.avatar, styles.image]}
              />
            </ThemedText></DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
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
  desc_column: {
    flex: 3,
  },
  avatar: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
});

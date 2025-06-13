import { StyleSheet, View, Image } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as React from 'react';
import { supabase } from '../../lib/supabase'
import { Timestamp } from 'react-native-reanimated/lib/typescript/commonTypes';

type gallery_images = {
  id: number;
  created_at: Timestamp;
  name: string;
  description: string;
  url: string;
};

export default function TabFourScreen() {
  const [galleryImages, setGalleryImages] = React.useState<gallery_images[] | null>([]);
  const [galleryImageUrls, setGalleryImageUrls] = React.useState<string[]>([]);
  const galleryImageSize = { height: 800, width: 1200 }

  React.useEffect(() => {
    getGalleryImages();
  }, []);

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

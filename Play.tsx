import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import NewEpisode from './NewEpisode';
import VideoPlayer from './videoPlayer';

export default function Play() {
    return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <NewEpisode /> 
        <VideoPlayer />
    </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingBottom: 100,
    },
})
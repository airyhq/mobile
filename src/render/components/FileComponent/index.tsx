import React from 'react';
import {StyleSheet, Text} from 'react-native';
import FileDownloadIcon from '../../../assets/images/icons/fileDownload.svg';
import {
  colorAiryBlue,
  colorBackgroundBlue,
  colorLightGray,
} from '../../../assets/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

type FileRenderProps = {
  fileUrl: string;
  fileType?: string;
  fileName?: string;
};

export const FileComponent = ({fileUrl, fileName}: FileRenderProps) => {
  const navigation = useNavigation();

  const maxFileNameLength = 30;
  if (fileName.length >= maxFileNameLength) {
    fileName = fileName.slice(-maxFileNameLength);
  }

  const handleOnPress = () => {
    navigation.navigate('FileContent', {fileName: fileName, fileUrl: fileUrl});
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleOnPress}>
      <FileDownloadIcon height={24} width={24} color={colorAiryBlue} />
      <Text style={styles.text}>{fileName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
    minWidth: '60%',
    marginTop: 5,
    backgroundColor: colorBackgroundBlue,
    borderColor: colorLightGray,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
  text: {
    marginLeft: 8,
  },
});

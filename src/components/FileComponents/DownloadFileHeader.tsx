import React from 'react';
import {TouchableOpacity} from 'react-native';
import {colorAiryBlue} from '../../assets/colors';
import DownloadIcon from '../../assets/images/icons/download.svg';

export const DownloadFileHeader = () => {
  const handleOnPress = () => {};

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <DownloadIcon
        height={32}
        width={32}
        fill={colorAiryBlue}
        style={{marginRight: 8}}
      />
    </TouchableOpacity>
  );
};

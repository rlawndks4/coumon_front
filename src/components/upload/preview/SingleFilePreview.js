import PropTypes from 'prop-types';
//
import Image from '../../image';

// ----------------------------------------------------------------------

SingleFilePreview.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default function SingleFilePreview({ file }) {
  if (!file) {
    return null;
  }

  const imgUrl = typeof file === 'string' ? file : file.preview;

  return (
    <img
      alt="file preview"
      src={imgUrl}
      style={{
        margin:'auto',
        height:'100%',
        width:'auto'
      }}
    />
  );
}

// ImageTextOverlay.js
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import styles from './ImageTextOverlay.module.scss';

const ImageTextOverlay = ({ data, currentPage }) => {
  const [objects, setObjects] = useState([]);
  console.log(data, 'inside');
  useEffect(() => {
    setObjects([]);
    const updatedGroup = [];
    data.textGroup.forEach((obj, index) => {
      const timeout = setTimeout(() => {
        updatedGroup[index] = {
          ...obj,
          translate: currentPage === data.pageNumber,
        };
        setObjects([...updatedGroup]);
      }, (index + 1) * 1000);

      return () => clearTimeout(timeout);
    });
  }, [data, currentPage]);
  return (
    <div className={styles.container}>
      <div className={styles.overlayContainer}>
        <img
          style={{ width: '700px', height: '700px' }}
          src={data.imageElement.url}
          alt="image content"
        />
        <div className={styles.textGroup}>
          {objects.map((obj, index) => (
            <div
              key={index}
              className={`${styles.overlay} ${
                obj.translate ? styles.translate : ''
              }`}
            >
              <h2
                className={`${styles.heading} ${
                  obj.translate ? styles.translate : ''
                }`}
              >
                {obj.heading}
              </h2>
              <h4
                className={`${styles.subheading} ${
                  obj.translate ? styles.translate : ''
                }`}
              >
                {obj.subheading}
              </h4>
              <p
                className={`${styles.text} ${
                  obj.translate ? styles.translate : ''
                }`}
              >
                {obj.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ImageTextOverlay.propTypes = {
  data: PropTypes.object,
  currentPage: PropTypes.number,
};

export default ImageTextOverlay;

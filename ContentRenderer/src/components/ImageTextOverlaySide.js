import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import styles from './ImageTextOverlaySide.module.scss';

const ImageTextOverlaySide = ({ data }) => {
  const [objects, setObjects] = useState([]);
  useEffect(() => {
    const updatedGroup = [];
    data.textGroup.forEach((obj, index) => {
      const timeout = setTimeout(() => {
        updatedGroup[index] = {
          ...obj,
          translate: true,
        };
        setObjects([...updatedGroup]);
      }, (index + 1) * 2000);
      return () => clearTimeout(timeout);
    });
  }, [data]);
  console.log(objects, 'ibs');
  return (
    <div className={styles.container}>
      <div className={styles.overlayContainer}>
        <img src={data.imageElement.url} alt="image content" />
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

ImageTextOverlaySide.propTypes = {
  data: PropTypes.object,
};

export default ImageTextOverlaySide;

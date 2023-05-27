import styles from './AnimatedPage.module.scss';
// import PropTypes from 'prop-types';
import { useState } from 'react';
import { ContentCategory } from '../enums/ContentCategory';
import ImageTextOverlay from '../components/ImageTextOverlay';
import { data } from '../utils/sampleData';
const ContentView = () => {
  const [currentPage, setCurrentPage] = useState(data[1]);
  console.log(currentPage, 'pge');
  const nextPage = () => {
    const currentIndex = data.findIndex(
      (page) => page.pageNumber === currentPage.pageNumber
    );
    if (currentIndex !== -1 && currentIndex + 1 < data.length) {
      setCurrentPage(data[currentIndex + 1]);
    }
  };
  console.log(currentPage.pageNumber);
  const renderContent = () => {
    switch (currentPage.imageElement.aspectRatio) {
      case ContentCategory.ImageTextOverlay:
        return <ImageTextOverlay data={currentPage} />;
      default:
        break;
    }
  };

  return (
    <div className={styles.pageContainer}>
      {renderContent()}
      <button className={styles.button} onClick={nextPage}>
        Next Page
      </button>
    </div>
  );
};
ContentView.propTypes = {};

export default ContentView;

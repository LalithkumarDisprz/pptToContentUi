import styles from './AnimatedPage.module.scss';
// import PropTypes from 'prop-types';
import { useState } from 'react';
import { ContentCategory } from '../enums/ContentCategory';
import ImageTextOverlay from '../components/ImageTextOverlay';
import { data } from '../utils/sampleData';
import ImageTextOverlaySide from '../components/ImageTextOverlaySide';
const ContentView = () => {
  // const [currentPage, setCurrentPage] = useState(data[1]);
  // console.log(currentPage, 'pge');
  // const nextPage = () => {
  //   setCurrentPage((prevPage) => {
  //     const currentIndex = data.findIndex(
  //       (page) => page.pageNumber === prevPage.pageNumber
  //     );
  //     if (currentIndex !== -1 && currentIndex + 1 < data.length) {
  //       return data[currentIndex + 1];
  //     }
  //     return prevPage;
  //   });
  // };
  const [currentPage, setCurrentPage] = useState(1);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  const renderContent = () => {
    const pageData = data.find((page) => page.pageNumber === currentPage);

    if (!pageData) {
      return null;
    }
    switch (pageData.imageElement.aspectRatio) {
      case ContentCategory.ImageTextOverlay:
        return <ImageTextOverlay data={pageData} currentPage={currentPage} />;
      // return <ImageTextOverlaySide data={currentPage} />;
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

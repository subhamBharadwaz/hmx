import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import { Box } from "@chakra-ui/react";

import NextLink from "next/link";
import { FiChevronRight } from "react-icons/fi";

interface ISlideShowItems {
  id: number;
  imageUrl: string;
  urlPrefix: string;
}

const slideShowItems: ISlideShowItems[] = [
  {
    id: 1,
    imageUrl: "/static/images/GraphicGlory_Homepage_1.webp",
    urlPrefix: "Chino Jogger",
  },
  {
    id: 2,
    imageUrl: "/static/images/Homepage--Banner_2.webp",
    urlPrefix: "Twill Jogger",
  },
  {
    id: 3,
    imageUrl: "/static/images/Homepage--Banner--Shirts_pUZrbF2.webp",
    urlPrefix: "Shirred Jogger",
  },
  {
    id: 4,
    imageUrl: "/static/images/Homepage-Banner_Naruto_Restock.webp",
    urlPrefix: "Wool Jogger",
  },
  {
    id: 5,
    imageUrl: "/static/images/homepage-Banner_Punisher-Sneaker_1.webp",
    urlPrefix: "Motoknit Jogger",
  },
];

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const SlideShow = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPage([page + 1, 1]);
    }, 2000);
    return () => clearInterval(interval);
  }, [page]);

  const slideIndex = wrap(0, slideShowItems.length, page);

  return (
    <>
      <AnimatePresence initial={false} custom={direction}>
        <NextLink href="#">
          <motion.img
            key={page}
            src={slideShowItems[slideIndex].imageUrl}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="slide-image"
          />
        </NextLink>
      </AnimatePresence>
      <div className="next" onClick={() => paginate(1)}>
        <FiChevronRight />
      </div>
      <div className="prev" onClick={() => paginate(-1)}>
        <FiChevronRight />
      </div>
    </>
  );
};

export default SlideShow;

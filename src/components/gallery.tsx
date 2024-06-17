import axios from "axios";
import { useEffect, useRef, useState } from "react";

type Image = {
  alt_description: string;
  created_at: string;
  urls: {
    small: string;
  };
  id: string;
};

const Gallery = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const lastImageRef = useRef(null);

  const loadImages = async () => {
    setLoading(true);

    try {
      const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
      const url = `https://api.unsplash.com/photos?page=${page}&per_page=10&client_id=${accessKey}`;
      const response = await axios.get(url);

      setImages((prevImages) => [...prevImages, ...response.data]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [page]);

  const parseDate = (date: string) => {
    const newDate = new Date(date);

    return `${newDate.getDay()}-${newDate.getMonth()}-${newDate.getFullYear()}`;
  };

  const callbackFunction = (entries: any) => {
    if (entries[0].isIntersecting) {
      setInterval(() => {
        setPage((prevPage) => prevPage + 1);
      }, 2000);
      //   console.log(entries);
    }
  };

  const options = {
    threshold: 1,
  };

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(callbackFunction, options);

    if (lastImageRef.current) {
      observer.observe(lastImageRef.current);
    }

    return () => {
      if (lastImageRef.current) {
        observer.unobserve(lastImageRef.current);
      }
    };
  }, [lastImageRef, options]);

  return (
    <>
      <div className="w-full flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => {
          return (
            <div
              className="bg-slate-300 flex flex-col items-center justify-center p-4 rounded-md shadow-sm space-y-2"
              key={image.id}
              ref={index === images.length - 1 ? lastImageRef : null}
            >
              <img
                src={image.urls.small}
                alt="Image"
                className="w-[300px] aspect-square"
              />
              <p className="font-bold text-center underline text-sm">
                {image.alt_description}
              </p>
              <p className="font-bold text-sm">
                Created at {parseDate(image.created_at)}
              </p>
            </div>
          );
        })}
      </div>
      {loading && (
        <p className="w-full flex items-center justify-center p-1 text-black">
          Loading...
        </p>
      )}
    </>
  );
};

export default Gallery;

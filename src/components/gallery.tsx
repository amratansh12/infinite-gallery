import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

type Image = {
  alt_description: string;
  created_at: string;
  urls: {
    full: string;
  };
  id: string;
};

const Gallery = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const loadImages = async () => {
    setLoading(true);

    try {
      const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
      const url = `https://api.unsplash.com/photos?page=${page}&per_page=4&client_id=${accessKey}`;
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

  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage(page + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  return (
    <div className="w-full flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div
          className="bg-slate-300 flex flex-col items-center justify-center p-4 rounded-md shadow-sm space-y-2"
          key={image.id}
          ref={index === images.length - 1 ? lastImageRef : null}
        >
          <img
            src={image.urls.full}
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
      ))}

      {loading && (
        <p className="w-full flex items-center justify-center p-1 text-indigo-400">
          Loading
        </p>
      )}
    </div>
  );
};

export default Gallery;

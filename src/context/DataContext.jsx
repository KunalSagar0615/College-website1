import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [notices, setNotices] = useState([]);
  const [images, setImages] = useState([]);

  const NOTIFICATION_API = "http://localhost:8081/api/notifications";
  const GALLERY_API = "http://localhost:8081/api/gallery";

  const fetchNotices = async () => {
    try {
      const res = await axios.get(NOTIFICATION_API);
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${GALLERY_API}/all`);
      setImages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotices();
    fetchImages();
  }, []);

  return (
    <DataContext.Provider value={{ notices, images, fetchNotices, fetchImages }}>
      {children}
    </DataContext.Provider>
  );
};
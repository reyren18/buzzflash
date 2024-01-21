import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const isAuthenticated = false;
  const imageUnsplashID = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  useEffect(() => {
    // Fetch a random image from the Unsplash API
    const fetchRandomImage = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/photos/random?client_id=${imageUnsplashID}`
        );
        const data = await response.json();

        if (data.urls && data.urls.full) {
          setBackgroundImage(data.urls.full);
        }
      } catch (error) {
        console.error("Error fetching random image:", error);
      }
    };

    fetchRandomImage();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img
            src={backgroundImage || "/assets/images/side-img"}
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;

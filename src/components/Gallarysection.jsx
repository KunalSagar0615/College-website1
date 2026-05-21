import React from "react";

const GALLERY_API = "http://localhost:8081/api/gallery";

const Gallarysection = ({ images }) => {

    return (

        <section className="py-10 bg-gray-100">

            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
                Campus Gallery
            </h2>

            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">

                {images && images.length > 0 ? (

                    images
                        .filter((img) =>
                            img.type?.startsWith("image")
                        )

                        .map((img) => (

                            <div
                                key={img.id}
                                className="bg-white shadow-md rounded-lg overflow-hidden"
                            >

                                <img
                                    src={`${GALLERY_API}/image/${img.id}`}
                                    alt="gallery"
                                    className="w-full h-48 object-cover"
                                />

                            </div>
                        ))

                ) : (

                    <p className="col-span-full text-center text-gray-500">
                        No gallery images available
                    </p>
                )}

            </div>

        </section>
    );
};

export default Gallarysection;
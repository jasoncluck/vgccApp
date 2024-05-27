import Image from "next/image";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export const Video = async () => {
  //   const src = await getYoutubeVideoSrc();
  return (
    <section className="m-12">
      <VidoeCardList />
      {/* <iframe
        width="1905"
        height="1080"
        src={src}
        title="Nextlander Explores Abiotic Factor"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe> */}
    </section>
  );
};

const getYoutubeVideoSrc = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return "https://www.youtube.com/embed/5Z1UKWQlXJk";
};

const VideoCard = (props: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      tabIndex={0}
      className="card image-full w-96 cursor-pointer bg-base-100 shadow-xl transition
		ease-in-out hover:scale-125 focus:scale-125"
    >
      <figure>
        <Image
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          width="400"
          height="400"
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Shoes!</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
      </div>
    </div>
  );
};

const VidoeCardList = () => {
  return (
    <section className="flex space-x-12">
      <VideoCard />
      <VideoCard />
      <VideoCard />
      <VideoCard />
      <VideoCard />
      <VideoCard />
    </section>
  );
};

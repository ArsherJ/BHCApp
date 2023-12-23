import React, { useState } from "react";
import { INewsUpdates } from "../redux/interfaces";
import Image from "next/image";
import Link from "next/link";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";

interface Props {
  item: INewsUpdates;
  newsCount: number;
}

const NewsCard = ({ item, newsCount }: Props) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      className="col-span-1 group bg-slate-200 justify-center min-h-[250px] items-center flex relative rounded-[25px] overflow-hidden border-2 border-primary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute group-hover:opacity-0  duration-150 top-0 text-white bg-[#111111c4] py-2 w-full text-center items-center flex justify-center">
        {item && item.headline && <h5>{item.headline}</h5>}
      </div>
      {item && item.image && (
        <Image
          src={item.image}
          alt="Shoes"
          width={newsCount == 1 ? 500 : newsCount == 2 ? 300 : 200}
          height={200}
        />
      )}
      {isHovered && (
        <div className="bg-[#111111c4] absolute h-full w-full duration-300">
          <div className="flex flex-col justify-between items-center text-center text-white h-full p-4">
            <div>{item && item.headline && <h5>{item.headline}</h5>}</div>
            <div className="flex justify-end items-end">
              {item && item.fb_link && (
                <Link prefetch href={item.fb_link} target="_blank">
                  <button className="btn btn-primary">
                    Visit Link <HiMiniArrowTopRightOnSquare />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsCard;

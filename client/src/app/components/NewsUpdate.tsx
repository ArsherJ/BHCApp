import React from "react";
import { INewsUpdates } from "../redux/interfaces";
import NewsCard from "./NewsCard";
import useGetNewsUpdates from "../hooks/api-hooks/newsUpdatesAPI/useGetNewsUpdates";

const NewsUpdate = () => {
  const { data, loading, error, getNewsUpdates } = useGetNewsUpdates();
  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center py-16 shadow-lg"
      id="News"
    >
      <div className="mb-4 border-b-4 border-primary ">
        <h2>News and Updates</h2>
      </div>

      <div
        className={`grid grid-cols-1 justify-center items-center pt-12 ${
          data?.length > 2 ? `sm:grid-cols-2 lg:grid-cols-3 gap-24 ` : ""
        }`}
      >
        {data &&
          data?.map(
            (item: INewsUpdates, index: React.Key | null | undefined) => (
              <NewsCard item={item} key={index} newsCount={data?.length} />
            )
          )}
      </div>
    </section>
  );
};

export default NewsUpdate;

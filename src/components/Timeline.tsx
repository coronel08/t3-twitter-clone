import React, { useEffect, useState } from "react";
import Image from "next/image";
import { api, RouterOutputs } from "../utils/api";
import { CreateTweet } from "./CreateTweet";

function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  function handleScroll() {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const scrolled = (winScroll / height) * 100;

    setScrollPosition(scrolled);
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollPosition;
}

function Tweet({
  tweet,
}: {
  tweet: RouterOutputs["tweet"]["timeline"]["tweets"][number];
}) {
  return (
    <>
      <div className="mb-4 border-b-2 border-gray-500">
        <div className="flex p-2">
          {tweet.author.image && (
            <Image
              src={tweet.author.image}
              alt={`${tweet.author.name ?? ""} pic`}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div className="ml-2">
            <p className="font-bold"> {tweet.author.name} </p>
            <p className="text-sm text-gray-400">
              - {new Date(tweet.createdAt).toISOString()}
            </p>
          </div>
        </div>
        <div className="mx-8 my-2">{tweet.text}</div>
      </div>
    </>
  );
}

export function Timeline() {
  const scrollPosition = useScrollPosition();

  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.tweet.timeline.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const tweets = data?.pages.flatMap((page) => page.tweets) ?? [];

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      fetchNextPage().catch((error) => console.error("fetch error", error));
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);

  // console.log("data", data, tweets);
  // console.log({ scrollPosition });

  return (
    <>
      <CreateTweet />
      <div className="border-l-2 border-r-2 border-t-2 border-gray-500">
        {tweets.map((tweet) => {
          return <Tweet key={tweet.id} tweet={tweet} />;
        })}

        {!hasNextPage && <p>No more items to load</p>}
      </div>
    </>
  );
}

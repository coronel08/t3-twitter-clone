import { useState } from "react";
import { object, string } from "zod";
import { api } from "../utils/api";

export const tweetSchema = object({
  text: string({
    required_error: "Text is required",
  })
    .min(10)
    .max(280),
});

export function CreateTweet() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const { mutateAsync } = api.tweet.create.useMutation();

  async function handleSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    console.log("submit tweet ran");

    try {
      await tweetSchema.parse({ text });
    } catch (error) {
      console.log(error.message);
      setError(error.message);
      return;
    }

    void mutateAsync({ text });
  }

  // const cleanedError = error && JSON.parse(error)[0]?.message;

  return (
    <>
      {error && JSON.stringify("Error Message")}
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col rounded-md border-2 p-4"
      >
        <textarea
          className="w-full p-4 shadow"
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <button className="bg-primary px-4 py-2 text-white" type="submit">
            Tweet
          </button>
        </div>
      </form>
    </>
  );
}

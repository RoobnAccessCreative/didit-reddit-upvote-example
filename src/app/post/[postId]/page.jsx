import { CommentForm } from "@/components/CommentForm";
import { CommentList } from "@/components/CommentList";
import { Vote } from "@/components/Vote";
import { db } from "@/db";
import Image from "next/image";

export async function generateMetadata({ params }, parent) {
  const { postId } = await params;

  const { rows: post } = await db.query(
    "SELECT posts.title FROM posts WHERE posts.id = $1 LIMIT 1",
    [postId]
  );

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${post[0].title} | Didit`,
    openGraph: {
      images: ["/some-specific-page-image.jpg", ...previousImages],
    },
  };
}

export default async function SinglePostPage({ params }) {
  const postId = params.postId;

  const { rows: posts } = await db.query(
    `SELECT posts.id, posts.title, posts.body, posts.created_at, users.name, users.image,
    COALESCE(SUM(votes.vote), 0) AS vote_total
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN votes ON votes.post_id = posts.id
    WHERE posts.id = $1
    GROUP BY posts.id, users.name, users.image
    LIMIT 1;`,
    [postId]
  );
  const post = posts[0];

  const { rows: votes } = await db.query(
    `SELECT *, users.name from votes 
    JOIN users on votes.user_id = users.id`
  );

  return (
    <div className="max-w-screen-lg mx-auto pt-4 pr-4 flex flex-col items-center">
      <section className="ml-8 mr-8 mb-4 mt-4 rounded-2xl p-8 bg-zinc-200/75 w-full max-w-[80%]">
        <div className="flex space-x-6 ">
          <Vote postId={post.id} votes={post.vote_total} />
          <div className="">
            <h1 className="text-2xl font-semibold">{post.title}</h1>
            <p className="text-zinc-400 mb-4 flex items-center gap-1">
              Posted by{" "}
              <span className="flex items-center gap-1">
                <Image
                  src={post.image}
                  alt={""}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                {post.name}
              </span>
            </p>
          </div>
        </div>
        <main className="whitespace-pre-wrap m-4 p-4 rounded-md bg-zinc-300/75">
          {post.body}
        </main>
      </section>

      <section className="bg-zinc-100/50 rounded-2xl p-8 w-full max-w-[80%]">
        <CommentForm postId={post.id} />
        <CommentList postId={post.id} />
      </section>
    </div>
  );
}

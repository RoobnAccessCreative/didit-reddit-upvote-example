import Link from "next/link";
import { Pagination } from "./Pagination";
import { Vote } from "./Vote";
import { db } from "@/db";
import { POSTS_PER_PAGE } from "@/config";
import Image from "next/image";

export async function PostList({ currentPage = 1 }) {
  const { rows: posts } =
    await db.query(`SELECT posts.id, posts.title, posts.body, posts.created_at, users.name, users.image, 
    COALESCE(SUM(votes.vote), 0) AS vote_total
     FROM posts
     JOIN users ON posts.user_id = users.id
     LEFT JOIN votes ON votes.post_id = posts.id
     GROUP BY posts.id, users.name, users.image
     ORDER BY vote_total DESC
     LIMIT ${POSTS_PER_PAGE}
     OFFSET ${POSTS_PER_PAGE * (currentPage - 1)}`);

  return (
    <section className="w-full h-full flex flex-col items-center justify-between gap-4">
      <ul className="mt-4 flex flex-col items-center gap-2">
        {posts.map((post) => (
          <li
            key={post.id}
            className="flex gap-4 hover:bg-zinc-300 mb-4 mt-4 rounded-2xl p-8 bg-zinc-200/75 w-[80dvw]"
          >
            <Vote postId={post.id} votes={post.vote_total} />
            <div>
              <Link
                href={`/post/${post.id}`}
                className="text-3xl hover:text-pink-500"
              >
                {post.title}
              </Link>
              <p className="text-zinc-700 flex items-center gap-1">
                posted by
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
          </li>
        ))}
      </ul>
      <Pagination currentPage={currentPage} />
    </section>
  );
}

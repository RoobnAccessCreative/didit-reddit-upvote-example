import { POSTS_PER_PAGE } from "@/config";
import { db } from "@/db";
import clsx from "clsx";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

export async function Pagination({ currentPage = 1 }) {
  const { rows: postCount } = await db.query(`SELECT COUNT(*) FROM posts`);
  const count = postCount[0].count;
  const numOfPages = Math.ceil(count / POSTS_PER_PAGE);

  return (
    <ul className="flex w-fit text-2xl justify-center mb-8 rounded-full p-1 px-3 bg-zinc-200/50">
      {currentPage > 1 && (
        <li>
          <a
            href={currentPage - 1 === 1 ? `/` : `/page/${currentPage - 1}`}
            className="p-2 hover:bg-zinc-800 block text-zinc-400"
          >
            <GrFormPrevious />
          </a>
        </li>
      )}
      {Array.from({ length: numOfPages }, (_, index) => (
        <li key={index} className="items-center flex">
          <a
            href={index > 0 ? `/page/${index + 1}` : `/`}
            className={clsx(`hover:brightness-75 p-1`, {
              "text-pink-400": currentPage === index + 1,
            })}
          >
            {index + 1}
          </a>
        </li>
      ))}
      {currentPage < numOfPages && (
        <li>
          <a
            href={`/page/${currentPage + 1}`}
            className="p-2 hover:bg-zinc-800 block"
          >
            <GrFormNext />
          </a>
        </li>
      )}
    </ul>
  );
}

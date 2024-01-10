import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { RouterOutputs } from "~/utils/api";
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["post"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div
      key={post.id}
      className="mx-2 mt-2 flex border-spacing-1 flex-row gap-4 border-b py-2"
    >
      <Link href={`/@${author.username}`}>
        <Image
          src={author?.profileImageUrl || "https://i.pravatar.cc/300"}
          alt="Profile Image"
          className="rounded-full"
          width={56}
          height={56}
        />
      </Link>
      <Link href={`/post/${post.id}`}>
        <div className="items-left flex flex-col justify-center">
          <div className="">
            <Link href={`/@${author.username}`}>
              <span className="font-bold">{`@${author.username}`}</span>
            </Link>
            <Link href={`/post/${post.id}`}>
              <span className="font-thin">{` · ${dayjs(
                post.createdAt,
              ).fromNow()}`}</span>
            </Link>
          </div>
          <div className="text-sm">{post.content}</div>
        </div>
      </Link>
    </div>
  );
};

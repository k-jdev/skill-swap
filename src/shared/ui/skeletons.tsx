import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const THEME = {
  baseColor: "var(--color-hairline)",
  highlightColor: "var(--color-surface)",
};

export function ProfileSkeleton() {
  return (
    <SkeletonTheme {...THEME}>
      <div className="mx-auto mt-10 w-full max-w-6xl rounded-4xl bg-white p-6 shadow-md sm:p-10">
        <div className="flex flex-col gap-8 md:flex-row md:gap-10">
          <Skeleton circle width={180} height={180} />
          <div className="w-full max-w-xl">
            <Skeleton height={44} width="60%" />
            <Skeleton height={22} width="40%" className="mt-3" />
            <Skeleton height={18} width="30%" className="mt-2" />
            <Skeleton height={16} count={3} className="mt-4" />
          </div>
        </div>

        <div className="mt-10">
          <Skeleton height={28} width={180} />
          <div className="mt-4 flex gap-2">
            <Skeleton height={38} width={120} borderRadius={999} />
            <Skeleton height={38} width={140} borderRadius={999} />
            <Skeleton height={38} width={100} borderRadius={999} />
          </div>
        </div>

        <div className="mt-10">
          <Skeleton height={28} width={120} />
          <Skeleton height={90} className="mt-4" />
        </div>
      </div>
    </SkeletonTheme>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <SkeletonTheme {...THEME}>
      <div className="mx-auto mt-10 grid w-full max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl bg-white p-4 shadow-sm"
            aria-hidden
          >
            <Skeleton height={160} borderRadius={12} />
            <Skeleton height={22} width="70%" className="mt-4" />
            <Skeleton height={16} count={2} className="mt-2" />
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

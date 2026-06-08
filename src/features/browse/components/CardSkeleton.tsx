import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl max-w-[330px] overflow-hidden">
      {/* Изображение - серый блок */}
      <div className="w-full h-48">
        <Skeleton height="100%" baseColor="#e5e7eb" highlightColor="#f3f4f6" />
      </div>

      {/* Контент */}
      <div className="p-4 gap-3 flex flex-col">
        {/* Заголовок */}
        <Skeleton
          height={30}
          width="70%"
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />

        {/* Описание - 3 строки */}
        <Skeleton
          count={3}
          height={16}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />

        {/* Кнопка */}
        <Skeleton
          height={40}
          width={120}
          className="rounded-full"
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />
      </div>
    </div>
  );
}

export default CardSkeleton;

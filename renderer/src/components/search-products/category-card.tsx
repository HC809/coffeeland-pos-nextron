import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Image from "@/components/ui/image";
import routes from "@/config/routes";
import placeholder from "@/assets/images/placeholders/product.svg";
import { fadeInBottomWithScaleX } from "@/lib/framer-motion/fade-in-bottom";
import { ICategory } from "../../models/ICategory";

export default function CategoryCard({ category }: { category: ICategory }) {
  const { name, image } = category ?? {};
  const router = useRouter();

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.05 }}
      variants={fadeInBottomWithScaleX()}
      onClick={() => router.push(routes.homeCategorySarchUrl(category.name))}
      className="group bg-light dark:bg-dark-250 cursor-pointer rounded-md px-4 py-7 text-center"
    >
      <div className="relative mx-auto mb-2.5 h-[75px] w-[75px] md:h-20 md:w-20 lg:h-[90px] lg:w-[90px]">
        <Image
          alt={name}
          layout="fill"
          quality={100}
          objectFit="cover"
          src={image ? `data:image/jpeg;base64,${image}` : placeholder}
          className="rounded-3xl"
        />
      </div>
      <h3 className="font-base  text-dark group-hover:text-brand dark:text-light mb-1 text-lg transition-colors">
        {name}
      </h3>
      <div className="text-dark-800 dark:text-dark-base text-sm font-medium">
        {5} Productos
      </div>
    </motion.div>
  );
}

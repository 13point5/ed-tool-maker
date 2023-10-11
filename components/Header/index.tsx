import { UserMenu } from "@/components/UserMenu";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const params = useParams();

  const showToolTitle = pathname.includes("tool") && Boolean(params.id);

  return (
    <div className="col-span-full border-b-2 p-4 flex gap-4 items-center justify-between w-full h-fit">
      <div className="flex gap-4 items-center">
        <Link href="/">
          <h2 className="text-xl font-bold">ETM</h2>
        </Link>

        {showToolTitle && (
          <>
            <div className="text-slate-300">|</div>

            <h3 className="text-lg font-semibold">GPT-3</h3>
          </>
        )}
      </div>

      <UserMenu />
    </div>
  );
}

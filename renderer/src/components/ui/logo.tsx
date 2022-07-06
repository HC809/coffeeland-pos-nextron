import cn from "classnames";
import AnchorLink from "@/components/ui/links/anchor-link";
import routes from "@/config/routes";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";

export default function Logo({
  className = "w-20",
  ...props
}: React.AnchorHTMLAttributes<{}>) {
  const isMounted = useIsMounted();
  return (
    <AnchorLink
      href={routes.home}
      className={cn(
        "text-dark dark:text-light relative flex items-center pb-2 pt-2 focus:outline-none",
        className
      )}
      {...props}
    >
      {isMounted && (
        <img
          width="200px"
          height="150px"
          className="ml-auto mr-auto"
          src="/images/coffeeland-logo.png"
        />
      )}
    </AnchorLink>
  );
}

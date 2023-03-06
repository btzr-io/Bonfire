import Image from "next/image";
import { useTheme } from "next-themes";

export default function Logo(props) {
  const { resolvedTheme } = useTheme();
  let src;
  switch (resolvedTheme) {
    case "light":
      src = "logo.svg";
      break;
    case "dark":
      src = "logo_dark.svg";
      break;
    default:
      src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      break;
  }

  return <Image src={src} alt="Bonfire" width={180} height={36} />;
}

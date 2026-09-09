import Image from "next/image";

export function CountryFlag({ country, size = 20 }: { country: string; size?: number }) {
  return (
    <Image
      src={`https://circle-flags.cdn.skk.moe/flags/${country}.svg`}
      alt=""
      width={size}
      height={size}
      unoptimized
      className="inline-block shrink-0 rounded-full"
    />
  );
}

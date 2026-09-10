import Image from "next/image";

export function CountryFlag({ country, size = 20 }: { country: string; size?: number }) {
  return (
    <Image
      src={`/flags/${country}.svg`}
      alt=""
      width={size}
      height={size}
      className="inline-block shrink-0 rounded-full"
    />
  );
}

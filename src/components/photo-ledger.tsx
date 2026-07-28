import Image from "next/image";
import type { CampaignPhoto } from "@/content/photos";

type PhotoLedgerProps = {
  photos: CampaignPhoto[];
};

export function PhotoLedger({ photos }: PhotoLedgerProps) {
  return (
    <div className="photo-ledger">
      {photos.map((photo) => (
        <figure
          className={`photo-note photo-span-${photo.span}`}
          key={photo.src}
        >
          <div className={`photo-frame photo-frame-${photo.ratio}`}>
            <Image
              alt={photo.alt}
              fill
              sizes="(max-width: 560px) calc(100vw - 32px), (max-width: 880px) 50vw, 45vw"
              src={photo.src}
              style={{ objectPosition: photo.position ?? "50% 50%" }}
            />
          </div>
          <figcaption>
            <span>{photo.label}</span>
            <p>{photo.caption}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

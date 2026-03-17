import { memo, useState, useCallback } from 'react';
import type { ReactElement } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
}

function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className,
}: SafeImageProps): ReactElement | null {
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = useCallback((): void => {
    setHasError(true);
  }, []);

  if (hasError) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      className={className}
      onError={handleError}
    />
  );
}

export default memo(SafeImage);

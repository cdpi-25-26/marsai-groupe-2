import { useEffect, useState } from "react";

export function SafeImage({ src, alt, className, fallback = null }) {
  const [resolvedSrc, setResolvedSrc] = useState(src || "");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let objectUrl = null;
    let disposed = false;
    const controller = new AbortController();

    async function resolveImage() {
      setHasError(false);

      if (!src) {
        setResolvedSrc("");
        return;
      }

      const isRemoteUrl = /^https?:\/\//i.test(src);
      const isNgrokMedia = isRemoteUrl && /ngrok-free\.dev/i.test(src);

      if (!isNgrokMedia) {
        setResolvedSrc(src);
        return;
      }

      try {
        const response = await fetch(src, {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`Image HTTP ${response.status}`);

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        if (!disposed) setResolvedSrc(objectUrl);
      } catch {
        if (!disposed) {
          // Fallback to direct URL if blob path fails.
          setResolvedSrc(src);
        }
      }
    }

    resolveImage();

    return () => {
      disposed = true;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (!resolvedSrc || hasError) return fallback;

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}

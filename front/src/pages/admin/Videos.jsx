import { useQuery } from "@tanstack/react-query";
import { getVideos } from "../../api/videos.js";

function Videos() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["listVideos"],
    queryFn: getVideos,
  });

  if (isPending) {
    return <div>Chargement en cours...</div>;
  }

  if (isError) {
    return <div>Une erreur est survenue : {error.message}</div>;
  }

  return data.data.length > 0 ? (
    data.data.map((video) => (
      <div key={video.id}>
        <h2>{video.title}</h2>
        <p>{video.description}</p>
      </div>
    ))
  ) : (
    <div>Aucune vidéo trouvée.</div>
  );
}

export default Videos;

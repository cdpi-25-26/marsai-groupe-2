import MoviesCard from "../../components/MoviesCard";

export default function DisplayVideos() {
  return (
    <div id="display-videos" className="pt-16 flex justify-center px-4 py-10">
      <div className="w-full flex justify-center px-4 py-10"
    >
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-10
          max-w-8xl
        "
      >
        <MoviesCard
          videoSrc="https://youtu.be/LSzzUe6oK0I"
          poster="/src/assets/images/movies/philippe.png"
          title="Titre de la vidéo"
          author="Les vipères"
          category="fiction"
          prize="Prix du jury"
          sponsorLogo=""
        />

        <MoviesCard
          videoSrc="https://youtu.be/LSzzUe6oK0I"
          poster="/src/assets/images/movies/philippe.png"
          title="Titre de la vidéo"
          author="Les vipères"
          category="fiction"
          prize="Prix du jury"
          sponsorLogo=""
        />

        <MoviesCard
          videoSrc="https://youtu.be/LSzzUe6oK0I"
          poster="/src/assets/images/movies/philippe.png"
          title="Titre de la vidéo"
          author="Les vipères"
          category="fiction"
          prize="Prix du jury"
          sponsorLogo=""
        />

        <MoviesCard
          videoSrc="https://youtu.be/LSzzUe6oK0I"
          poster="/src/assets/images/movies/philippe.png"
          title="Titre de la vidéo"
          author="Les vipères"
          category="fiction"
          prize="Prix du jury"
          sponsorLogo=""
        />
        </div>
      </div>
    </div>
  );
}
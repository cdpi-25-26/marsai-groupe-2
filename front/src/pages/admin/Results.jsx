import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVideos } from "../../api/videos.js";
import { getVotes } from "../../api/votes.js";
import { getAwards } from "../../api/awards.js";
import TutorialBox from "../../components/TutorialBox.jsx";
import { useEffect, useState } from "react";
import { loadTutorialSteps } from "../../utils/tutorialLoader.js";

// Fixed: was parseFloat(vote.note) which always returned NaN on ENUM strings
// Map ENUM values to numeric scores for ranking purposes
const ENUM_TO_SCORE = { YES: 1, NO: 0, "TO DISCUSS": 0.5 };

export default function Results() {
  const [tutorial, setTutorial] = useState({ title: "Tutoriel", steps: [] });

  useEffect(() => {
    async function fetchTutorial() {
      try {
        const tutorialData = await loadTutorialSteps("/src/pages/admin/TutorialVoting.fr.md");
        setTutorial(tutorialData);
      } catch (err) {
        setTutorial({ title: "Tutoriel", steps: ["Impossible de charger le tutoriel."] });
      }
    }
    fetchTutorial();
  }, []);

  const { data: moviesData, isPending: moviesLoading } = useQuery({
    queryKey: ["listVideos"],
    queryFn: getVideos,
  });

  const { data: votesData, isPending: votesLoading } = useQuery({
    queryKey: ["votes"],
    queryFn: getVotes,
  });

  const { data: awardsData, isPending: awardsLoading } = useQuery({
    queryKey: ["awards"],
    queryFn: getAwards,
  });

  const movies = moviesData?.data || [];
  const votes = votesData?.data || [];
  const awards = awardsData?.data || [];

  const voteStatsByMovie = useMemo(() => {
    const stats = {};

    votes.forEach((vote) => {
      if (!stats[vote.id_movie]) {
        stats[vote.id_movie] = {
          count: 0,
          sum: 0,
          average: 0,
          yes: 0,
          no: 0,
          toDiscuss: 0
        };
      }

      const score = ENUM_TO_SCORE[vote.note];
      if (score !== undefined) {
        stats[vote.id_movie].count += 1;
        stats[vote.id_movie].sum += score;
        stats[vote.id_movie].average =
          stats[vote.id_movie].sum / stats[vote.id_movie].count;
      }

      // Track individual vote counts per type
      if (vote.note === "YES") stats[vote.id_movie].yes += 1;
      if (vote.note === "NO") stats[vote.id_movie].no += 1;
      if (vote.note === "TO DISCUSS") stats[vote.id_movie].toDiscuss += 1;
    });

    return stats;
  }, [votes]);

  const awardsByMovie = useMemo(() => {
    const map = {};
    awards.forEach((award) => {
      if (!map[award.id_movie]) map[award.id_movie] = [];
      map[award.id_movie].push(award);
    });
    return map;
  }, [awards]);

  const enrichedMovies = useMemo(() => {
    return movies.map((movie) => {
      const stats = voteStatsByMovie[movie.id_movie] || {
        count: 0, average: 0, yes: 0, no: 0, toDiscuss: 0
      };
      const movieAwards = awardsByMovie[movie.id_movie] || [];
      return {
        ...movie,
        voteCount: stats.count,
        voteAverage: stats.average,
        voteYes: stats.yes,
        voteNo: stats.no,
        voteToDiscuss: stats.toDiscuss,
        awards: movieAwards,
      };
    });
  }, [movies, voteStatsByMovie, awardsByMovie]);

  const mostVoted = useMemo(() => {
    return [...enrichedMovies]
      .filter((movie) => movie.voteCount > 0)
      .sort((a, b) => b.voteCount - a.voteCount)
      .slice(0, 20);
  }, [enrichedMovies]);

  const awardedMovies = useMemo(() => {
    return [...enrichedMovies]
      .filter((movie) => movie.awards.length > 0 || movie.selection_status === "awarded")
      .sort((a, b) => b.awards.length - a.awards.length || b.voteAverage - a.voteAverage);
  }, [enrichedMovies]);

  const acceptedMovies = useMemo(() => {
    return [...enrichedMovies]
      .filter((movie) =>
        ["selected", "candidate", "finalist", "awarded"].includes(movie.selection_status)
      )
      .sort((a, b) => b.voteAverage - a.voteAverage);
  }, [enrichedMovies]);

  const refusedMovies = useMemo(() => {
    return [...enrichedMovies]
      .filter((movie) => movie.selection_status === "refused")
      .sort((a, b) => b.voteAverage - a.voteAverage);
  }, [enrichedMovies]);

  if (moviesLoading || votesLoading || awardsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-300">Chargement des résultats...</div>
      </div>
    );
  }

  const VoteBadge = ({ yes, no, toDiscuss }) => (
    <div className="flex items-center gap-1 flex-wrap">
      {yes > 0 && (
        <span className="px-1.5 py-0.5 text-[10px] rounded bg-green-500/20 text-green-400 border border-green-500/30">
          ✓ {yes}
        </span>
      )}
      {toDiscuss > 0 && (
        <span className="px-1.5 py-0.5 text-[10px] rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
          ? {toDiscuss}
        </span>
      )}
      {no > 0 && (
        <span className="px-1.5 py-0.5 text-[10px] rounded bg-red-500/20 text-red-400 border border-red-500/30">
          ✗ {no}
        </span>
      )}
    </div>
  );

  const renderRows = (list, emptyText) => {
    if (list.length === 0) {
      return (
        <tr>
          <td className="px-3 py-4 text-gray-400" colSpan={6}>
            {emptyText}
          </td>
        </tr>
      );
    }

    return list.map((movie, index) => (
      <tr key={movie.id_movie} className="border-t border-gray-800 hover:bg-white/5 transition-colors">
        <td className="px-3 py-2 text-gray-400">#{index + 1}</td>
        <td className="px-3 py-2 text-white font-semibold">{movie.title}</td>
        <td className="px-3 py-2 text-gray-300">{movie.voteCount}</td>
        <td className="px-3 py-2">
          <VoteBadge yes={movie.voteYes} no={movie.voteNo} toDiscuss={movie.voteToDiscuss} />
        </td>
        <td className="px-3 py-2 text-gray-300">
          {movie.voteCount > 0 ? (movie.voteAverage * 100).toFixed(0) + "%" : "–"}
        </td>
        <td className="px-3 py-2 text-gray-300">{movie.awards.length}</td>
      </tr>
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#AD46FF] to-[#F6339A] bg-clip-text text-transparent">
          Results
        </h1>
        <p className="text-gray-400 mt-1">
          Films les plus votés, primés, répartition YES/NO/TO DISCUSS et statuts.
        </p>
      </div>

      <TutorialBox title={tutorial.title} steps={tutorial.steps} defaultOpen={true} />

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total films</p>
          <p className="text-white text-2xl font-bold">{movies.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Films primés</p>
          <p className="text-white text-2xl font-bold">{awardedMovies.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Acceptés</p>
          <p className="text-white text-2xl font-bold">{acceptedMovies.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Refusés</p>
          <p className="text-white text-2xl font-bold">{refusedMovies.length}</p>
        </div>
      </div>

      {/* Most voted */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 overflow-x-auto">
        <h2 className="text-white font-semibold mb-3">Films les plus votés</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-800">
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Film</th>
              <th className="px-3 py-2">Votes</th>
              <th className="px-3 py-2">Répartition</th>
              <th className="px-3 py-2">Score</th>
              <th className="px-3 py-2">Prix</th>
            </tr>
          </thead>
          <tbody>{renderRows(mostVoted, "Aucun vote pour le moment")}</tbody>
        </table>
      </div>

      {/* Accepted / Refused */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 overflow-x-auto">
          <h2 className="text-white font-semibold mb-3">Films acceptés</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Film</th>
                <th className="px-3 py-2">Votes</th>
                <th className="px-3 py-2">Répartition</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Prix</th>
              </tr>
            </thead>
            <tbody>{renderRows(acceptedMovies, "Aucun film accepté")}</tbody>
          </table>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 overflow-x-auto">
          <h2 className="text-white font-semibold mb-3">Films refusés</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Film</th>
                <th className="px-3 py-2">Votes</th>
                <th className="px-3 py-2">Répartition</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Prix</th>
              </tr>
            </thead>
            <tbody>{renderRows(refusedMovies, "Aucun film refusé")}</tbody>
          </table>
        </div>
      </div>

      {/* Awarded */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 overflow-x-auto">
        <h2 className="text-white font-semibold mb-3">Films primés</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-800">
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Film</th>
              <th className="px-3 py-2">Votes</th>
              <th className="px-3 py-2">Répartition</th>
              <th className="px-3 py-2">Score</th>
              <th className="px-3 py-2">Prix</th>
            </tr>
          </thead>
          <tbody>{renderRows(awardedMovies, "Aucun film primé")}</tbody>
        </table>
      </div>
    </div>
  );
}
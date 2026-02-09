import Link from "next/link";
import { ROOMS, ROOM_SLUGS } from "@/lib/constants";
import { listProposals, listVotes } from "@/lib/polls";
import { getConfig, getMovieDetails, posterUrl } from "@/lib/tmdb";
import { ProposalVoteButton } from "@/components/ProposalVoteButton";

const MIN_VOTES_FOR_MAIN = 5;

export const metadata = {
  title: "Poll Results | Daily Fictions",
  description: "Overview of film proposals and votes across all rooms.",
};

export default async function PollsOverviewPage() {
  const votes = await listVotes();
  const voteCount = (proposalId: string) =>
    votes.filter((v) => v.proposal_id === proposalId).length;

  const roomData = await Promise.all(
    ROOM_SLUGS.map(async (slug) => {
      const proposals = await listProposals(slug);
      return {
        slug,
        room: ROOMS.find((r) => r.slug === slug)!,
        proposals: proposals.map((p) => ({ ...p, vote_count: voteCount(p.id) })),
      };
    })
  );

  const allProposalsWithVotes = roomData.flatMap(({ slug, room, proposals }) =>
    proposals.map((p) => ({ ...p, room_slug: slug, room_name: room.name }))
  );
  const topPicks = allProposalsWithVotes
    .filter((p) => p.vote_count >= MIN_VOTES_FOR_MAIN)
    .sort((a, b) => b.vote_count - a.vote_count);

  const movieIds = [...new Set(allProposalsWithVotes.map((p) => p.tmdb_movie_id))];
  const [config, ...details] = await Promise.all([
    getConfig(),
    ...movieIds.map((id) => getMovieDetails(id)),
  ]);
  const baseUrl = config.images.secure_base_url;
  const detailsById = Object.fromEntries(
    movieIds.map((id, i) => [id, details[i]])
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-medium tracking-tight">Poll Results</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Proposals and votes across all rooms. Films with 5+ upvotes are featured below.
      </p>

      {topPicks.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider opacity-70">
            Top picks (5+ upvotes) — pitched across rooms
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topPicks.map((p) => {
              const movie = detailsById[p.tmdb_movie_id];
              const poster = movie ? posterUrl(baseUrl, movie.poster_path) : "";
              return (
                <li
                  key={p.id}
                  className="flex gap-3 rounded-lg border border-neutral-200 bg-white/80 p-3 transition hover:shadow dark:border-neutral-700 dark:bg-neutral-900/50"
                >
                  <Link
                    href={`/movie/${p.tmdb_movie_id}`}
                    className="flex min-w-0 flex-1 gap-3"
                  >
                    <div className="h-20 w-14 shrink-0 overflow-hidden rounded bg-neutral-200 dark:bg-neutral-700">
                      {poster ? (
                        <img src={poster} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs opacity-50">—</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{movie?.title ?? `#${p.tmdb_movie_id}`}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {p.room_name}
                      </p>
                    </div>
                  </Link>
                  <ProposalVoteButton
                    proposalId={p.id}
                    roomSlug={p.room_slug}
                    voteCount={p.vote_count}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider opacity-70">
          By room
        </h2>
        <ul className="space-y-6">
          {roomData.map(({ slug, room, proposals }) => {
            const sorted = [...proposals].sort((a, b) => b.vote_count - a.vote_count);
            const onlyOne = proposals.length === 1;
            return (
              <li key={slug} className="rounded-lg border border-neutral-200 bg-white/50 p-4 dark:border-neutral-700 dark:bg-neutral-900/30">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium">
                    <Link href={`/rooms/${slug}`} className="hover:underline">
                      {room.name}
                    </Link>
                  </h3>
                  {onlyOne && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Only one film proposed —{" "}
                      <Link href={`/rooms/${slug}`} className="text-sky-600 underline dark:text-sky-400">
                        propose yours
                      </Link>
                    </p>
                  )}
                </div>
                {sorted.length === 0 ? (
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    No proposals yet.{" "}
                    <Link href={`/rooms/${slug}`} className="text-sky-600 underline dark:text-sky-400">
                      Be the first to propose
                    </Link>
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {sorted.slice(0, 5).map((p) => {
                      const movie = detailsById[p.tmdb_movie_id];
                      const poster = movie ? posterUrl(baseUrl, movie.poster_path) : "";
                      return (
                        <li key={p.id} className="flex items-center gap-2">
                          <Link
                            href={`/movie/${p.tmdb_movie_id}`}
                            className="flex h-12 w-8 shrink-0 overflow-hidden rounded bg-neutral-200 dark:bg-neutral-700"
                          >
                            {poster ? (
                              <img src={poster} alt="" className="h-full w-full object-cover" />
                            ) : null}
                          </Link>
                          <Link
                            href={`/movie/${p.tmdb_movie_id}`}
                            className="min-w-0 flex-1 truncate text-sm hover:underline"
                          >
                            {movie?.title ?? `#${p.tmdb_movie_id}`}
                          </Link>
                          <ProposalVoteButton
                            proposalId={p.id}
                            roomSlug={slug}
                            voteCount={p.vote_count}
                          />
                        </li>
                      );
                    })}
                    {sorted.length > 5 && (
                      <li>
                        <Link
                          href={`/rooms/${slug}`}
                          className="text-sm text-sky-600 dark:text-sky-400"
                        >
                          View all ({sorted.length}) in {room.name} →
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

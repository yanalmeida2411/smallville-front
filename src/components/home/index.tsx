import Header from "@/src/components/layout/Header";
import HeroCarousel from "@/src/components/home/HeroCarousel";
import MovieCarousel from "@/src/components/layout/Carousel/MovieCarousel";
import HomeBomboniere from "@/src/components/home/HomeBomboniere";
import Footer from "@/src/components/layout/Footer/Footer";
import {
  getNowPlayingMovies,
  getUpcomingReleases,
} from "@/src/actions/catalogActions";
import { CatalogMovie } from "@/src/types/admin";
import { getMockNowPlaying, getMockReleases } from "@/src/mocks/homeMocks";

/** Quantos filmes entram na rotação do destaque. */
const HERO_SIZE = 5;

export default async function HomePage() {
  // Duas listas diferentes: "Em Cartaz" olha a grade de sessões, "Lançamentos"
  // olha a data de estreia.
  const [nowPlaying, releases] = await Promise.all([
    getNowPlayingMovies(),
    getUpcomingReleases(),
  ]);

  // Sem backend (ex.: só o front publicado), a Home cai nos dados de
  // vitrine para não ficar vazia na apresentação.
  const nowPlayingMovies = nowPlaying.success
    ? nowPlaying.data
    : getMockNowPlaying();
  const releaseMovies = releases.success ? releases.data : getMockReleases();

  /**
   * O destaque usa os filmes que já estão em cartaz — são os que o botão
   * "Comprar Ingresso" consegue levar a uma sessão de verdade.
   */
  const heroMovies: CatalogMovie[] = (
    nowPlayingMovies.length ? nowPlayingMovies : releaseMovies
  ).slice(0, HERO_SIZE);

  const heroHighlights = Object.fromEntries(
    heroMovies.map((movie) => {
      const nextSession = nowPlayingMovies.find(
        (candidate) => candidate._id === movie._id,
      )?.nextSession;

      return [
        movie._id,
        nextSession
          ? `Próxima sessão: ${nextSession}`
          : movie.releaseDate
            ? `Estreia em ${movie.releaseDate}`
            : "",
      ];
    }),
  );

  return (
    <>
      <HeroCarousel movies={heroMovies} highlights={heroHighlights}>
        <Header />
      </HeroCarousel>

      <MovieCarousel
        idSection="EmCartazes"
        title="Em Cartaz"
        seeAllHref="/em-cartaz"
        movies={nowPlayingMovies}
        emptyMessage={
          nowPlaying.success
            ? "Nenhum filme com sessões abertas no momento."
            : nowPlaying.error
        }
      />

      <MovieCarousel
        idSection="Lancamentos"
        title="Lançamentos"
        seeAllHref="/lancamentos"
        movies={releaseMovies}
        emptyMessage={
          releases.success
            ? "Nenhum lançamento cadastrado no momento."
            : releases.error
        }
      />

      <HomeBomboniere />

      <Footer />
    </>
  );
}

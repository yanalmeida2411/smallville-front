/**
 * Dados de vitrine da Home, usados só quando o backend não responde — por
 * exemplo, ao apresentar o front publicado sem a API no ar. Com o backend
 * disponível, a Home continua mostrando apenas o catálogo real.
 *
 * As datas são calculadas a partir de "agora" para que as sessões estejam
 * sempre no futuro e as estreias caiam na janela de "Lançamentos".
 */
import type { NowPlayingMovie } from "@/src/actions/catalogActions";
import type { CatalogMovie, CatalogProduct, ProductCategory } from "@/src/types/admin";
import { formatBrDateTime } from "@/src/utils/date";

function daysFromNow(days: number, hour = 0, minute = 0): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date;
}

/** "DD/MM/AAAA" */
function brDate(days: number): string {
  return formatBrDateTime(daysFromNow(days)).slice(0, 10);
}

const MOCK_MOVIES: CatalogMovie[] = [
  {
    _id: "mock-reinos-esquecidos",
    title: "Reinos Esquecidos",
    banner: "/assets/Reino.png",
    synopsis:
      "Uma jovem cartógrafa descobre um mapa que leva a reinos apagados da história e precisa atravessá-los antes que eles desapareçam de vez.",
    genres: ["Aventura", "Ficção"],
    classification: "12",
    duration: 132,
    author: "Helena Duarte",
    cast: [{ name: "Marina Costa" }, { name: "Rafael Lima" }],
    releaseDate: brDate(-10),
    languages: ["Dublado", "Legendado"],
  },
  {
    _id: "mock-ultima-sessao",
    title: "A Última Sessão",
    banner: "/assets/movie-Reinos-esquecidos.png",
    synopsis:
      "Na noite de despedida de um cinema de bairro, o projecionista percebe que o filme exibido está contando a história da própria plateia.",
    genres: ["Terror", "Drama"],
    classification: "16",
    duration: 104,
    author: "Caio Mendes",
    cast: [{ name: "Bruno Alves" }, { name: "Luísa Prado" }],
    releaseDate: brDate(-20),
    languages: ["Legendado"],
  },
  {
    _id: "mock-pipoca-e-caos",
    title: "Pipoca & Caos",
    banner: "/assets/img-hero.png",
    synopsis:
      "Dois irmãos herdam um cinema falido e têm um fim de semana para lotar as salas — custe o que custar.",
    genres: ["Comédia"],
    classification: "L",
    duration: 96,
    author: "Joana Ribeiro",
    cast: [{ name: "Pedro Nunes" }, { name: "Ana Beatriz Rocha" }],
    releaseDate: brDate(-5),
    languages: ["Dublado"],
  },
  {
    _id: "mock-horizonte-vermelho",
    title: "Horizonte Vermelho",
    banner: "/assets/backAuth.png",
    synopsis:
      "Uma piloto de testes aceita uma última missão sobre o deserto e descobre que o voo nunca foi um teste.",
    genres: ["Ação"],
    classification: "14",
    duration: 118,
    author: "Diego Martins",
    cast: [{ name: "Carla Souza" }, { name: "Thiago Reis" }],
    releaseDate: brDate(7),
    languages: ["Dublado", "Legendado"],
  },
  {
    _id: "mock-cartas-de-verao",
    title: "Cartas de Verão",
    banner: "/assets/Reino.png",
    synopsis:
      "Vinte anos depois, uma caixa de cartas nunca enviadas reúne dois amigos de infância na mesma cidade litorânea.",
    genres: ["Romance", "Drama"],
    classification: "10",
    duration: 110,
    author: "Fernanda Lopes",
    cast: [{ name: "Gabriel Torres" }, { name: "Isabela Fontes" }],
    releaseDate: brDate(14),
    languages: ["Dublado"],
  },
];

/** Filmes já estreados, com uma próxima sessão fictícia. */
export function getMockNowPlaying(): NowPlayingMovie[] {
  return MOCK_MOVIES.slice(0, 3)
    .map((movie, index) => ({
      ...movie,
      sessionCount: 6 - index,
      nextSession: formatBrDateTime(daysFromNow(1, 14 + index * 2, 30)),
    }))
    .sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
}

/** Mesma ordem de `getUpcomingReleases`: estreia mais recente primeiro. */
export function getMockReleases(): CatalogMovie[] {
  return [...MOCK_MOVIES].reverse();
}

function product(
  _id: string,
  name: string,
  category: ProductCategory,
  price: number,
  size?: CatalogProduct["size"],
): CatalogProduct {
  return {
    _id,
    name,
    category,
    size,
    price,
    maxLimit: 5,
    quantity: 50,
    isAvailable: true,
    imageUrl: "/assets/promo-candy.png",
  };
}

export function getMockBomboniere(): Record<ProductCategory, CatalogProduct[]> {
  return {
    COMBOS: [
      product("mock-combo-casal", "Combo Casal", "COMBOS", 5990, "Grande"),
      product("mock-combo-solo", "Combo Solo", "COMBOS", 3490, "Médio"),
    ],
    COMIDAS: [
      product("mock-pipoca-grande", "Pipoca Salgada", "COMIDAS", 2890, "Grande"),
      product("mock-pipoca-doce", "Pipoca Doce", "COMIDAS", 2490, "Médio"),
      product("mock-nachos", "Nachos com Cheddar", "COMIDAS", 2690),
      product("mock-chocolate", "Chocolate ao Leite", "COMIDAS", 990),
    ],
    BEBIDAS: [
      product("mock-refri", "Refrigerante", "BEBIDAS", 1290, "Grande"),
      product("mock-agua", "Água Mineral", "BEBIDAS", 690, "Pequeno"),
      product("mock-suco", "Suco Natural", "BEBIDAS", 1190, "Médio"),
    ],
  };
}

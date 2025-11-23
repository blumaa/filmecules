import type {
  Film,
  Group,
  TMDBMovieDetails,
} from '../types';
import { tmdbService } from './tmdb';
import { recentContentService } from './recentContent';

interface PotentialGroup {
  films: TMDBMovieDetails[];
  connection: string;
  type: 'director' | 'actor' | 'franchise' | 'theme' | 'wordplay' | 'production';
  difficultyScore: number; // Raw score - higher = harder
}

function tmdbMovieToFilm(movie: TMDBMovieDetails): Film {
  return {
    id: movie.id,
    title: movie.title,
    year: new Date(movie.release_date).getFullYear(),
    poster_path: movie.poster_path || undefined,
  };
}

// Specific thematic keywords that make interesting connections
const SPECIFIC_THEMES = [
  { keywords: ['heist', 'robbery', 'steal'], name: 'Heist films', difficulty: 2 },
  { keywords: ['time travel', 'time machine'], name: 'Time travel films', difficulty: 2 },
  { keywords: ['artificial intelligence', 'robot', 'ai'], name: 'AI/Robot films', difficulty: 2 },
  { keywords: ['zombie', 'undead'], name: 'Zombie films', difficulty: 1 }, // More obvious
  { keywords: ['vampire'], name: 'Vampire films', difficulty: 1 },
  { keywords: ['superhero', 'marvel', 'dc comics'], name: 'Superhero films', difficulty: 1 },
  { keywords: ['space', 'astronaut', 'alien'], name: 'Space films', difficulty: 2 },
  { keywords: ['world war', 'vietnam war'], name: 'War films', difficulty: 2 },
  { keywords: ['high school', 'college'], name: 'School/College films', difficulty: 3 },
  { keywords: ['hitman', 'assassin'], name: 'Assassin films', difficulty: 3 },
];

// Production companies that have distinctive styles
const PRODUCTION_COMPANIES = [
  { id: 3, name: 'Pixar', label: 'Pixar films', difficulty: 1 }, // Very recognizable
  { id: 2, name: 'Walt Disney', label: 'Disney films', difficulty: 1 },
  { id: 420, name: 'Marvel', label: 'Marvel films', difficulty: 1 },
  { id: 9993, name: 'DC', label: 'DC films', difficulty: 2 },
  { id: 33, name: 'Universal', label: 'Universal films', difficulty: 2 },
  { id: 1632, name: 'Lionsgate', label: 'Lionsgate films', difficulty: 3 }, // Less obvious
  { id: 25, name: '20th Century Fox', label: '20th Century Fox films', difficulty: 2 },
  { id: 4, name: 'Paramount', label: 'Paramount films', difficulty: 2 },
  { id: 174, name: 'Warner Bros.', label: 'Warner Bros. films', difficulty: 2 },
  { id: 7505, name: 'A24', label: 'A24 films', difficulty: 4 }, // Hardest for non-cinephiles
];

function analyzeDirectors(movies: TMDBMovieDetails[]): PotentialGroup[] {
  const directorMap = new Map<number, { name: string; movies: TMDBMovieDetails[]; id: number }>();

  for (const movie of movies) {
    const directors = movie.credits?.crew?.filter((c) => c.job === 'Director') || [];

    for (const director of directors) {
      if (!directorMap.has(director.id)) {
        directorMap.set(director.id, { name: director.name, movies: [], id: director.id });
      }
      directorMap.get(director.id)!.movies.push(movie);
    }
  }

  const groups: PotentialGroup[] = [];

  for (const [, data] of directorMap) {
    if (data.movies.length >= 4) {
      // Calculate difficulty score: lower avg vote count = higher difficulty
      const avgVoteCount = data.movies.reduce((sum, m) => sum + (m.vote_count || 0), 0) / data.movies.length;

      // Invert so higher score = harder (we'll sort later)
      const difficultyScore = 10000 - avgVoteCount;
      const shuffled = [...data.movies].sort(() => Math.random() - 0.5);

      groups.push({
        films: shuffled.slice(0, 4),
        connection: `Directed by ${data.name}`,
        type: 'director',
        difficultyScore,
      });
    }
  }

  return groups;
}

function analyzeActors(movies: TMDBMovieDetails[]): PotentialGroup[] {
  const actorMap = new Map<number, { name: string; movies: TMDBMovieDetails[]; id: number }>();

  for (const movie of movies) {
    const topActors = movie.credits?.cast?.slice(0, 5) || [];

    for (const actor of topActors) {
      if (!actorMap.has(actor.id)) {
        actorMap.set(actor.id, { name: actor.name, movies: [], id: actor.id });
      }
      actorMap.get(actor.id)!.movies.push(movie);
    }
  }

  const groups: PotentialGroup[] = [];

  for (const [, data] of actorMap) {
    if (data.movies.length >= 4) {
      // Calculate difficulty score: lower avg vote count = higher difficulty
      const avgVoteCount = data.movies.reduce((sum, m) => sum + (m.vote_count || 0), 0) / data.movies.length;

      // Invert so higher score = harder
      const difficultyScore = 10000 - avgVoteCount;
      const shuffled = [...data.movies].sort(() => Math.random() - 0.5);

      groups.push({
        films: shuffled.slice(0, 4),
        connection: `Starring ${data.name}`,
        type: 'actor',
        difficultyScore,
      });
    }
  }

  return groups;
}

function analyzeFranchises(movies: TMDBMovieDetails[]): PotentialGroup[] {
  // Look for movies in the same collection/franchise
  const franchiseMap = new Map<number, { name: string; movies: TMDBMovieDetails[] }>();

  for (const movie of movies) {
    if ((movie as any).belongs_to_collection) {
      const collection = (movie as any).belongs_to_collection;
      if (!franchiseMap.has(collection.id)) {
        franchiseMap.set(collection.id, { name: collection.name, movies: [] });
      }
      franchiseMap.get(collection.id)!.movies.push(movie);
    }
  }

  const groups: PotentialGroup[] = [];

  for (const [, data] of franchiseMap) {
    if (data.movies.length >= 4) {
      // Calculate difficulty score: lower avg vote count = higher difficulty
      const avgVoteCount = data.movies.reduce((sum, m) => sum + (m.vote_count || 0), 0) / data.movies.length;

      // Invert so higher score = harder
      const difficultyScore = 10000 - avgVoteCount;
      const shuffled = [...data.movies].sort(() => Math.random() - 0.5);

      groups.push({
        films: shuffled.slice(0, 4),
        connection: data.name,
        type: 'franchise',
        difficultyScore,
      });
    }
  }

  return groups;
}

function analyzeThemes(movies: TMDBMovieDetails[]): PotentialGroup[] {
  const themeMap = new Map<string, { movies: TMDBMovieDetails[]; difficulty: number }>();

  for (const movie of movies) {
    const overview = movie.overview?.toLowerCase() || '';
    const title = movie.title.toLowerCase();
    const keywords = (movie as any).keywords?.keywords || [];

    for (const theme of SPECIFIC_THEMES) {
      const hasTheme = theme.keywords.some(keyword =>
        overview.includes(keyword) ||
        title.includes(keyword) ||
        keywords.some((k: any) => k.name.toLowerCase().includes(keyword))
      );

      if (hasTheme) {
        if (!themeMap.has(theme.name)) {
          themeMap.set(theme.name, { movies: [], difficulty: theme.difficulty });
        }
        themeMap.get(theme.name)!.movies.push(movie);
        break; // Only add to one theme
      }
    }
  }

  const groups: PotentialGroup[] = [];

  for (const [themeName, data] of themeMap) {
    if (data.movies.length >= 4) {
      // Scale predefined difficulty (1-4) to match vote count scoring (higher = harder)
      // Multiply by 2000 to put in similar range as vote-based scores
      const difficultyScore = data.difficulty * 2000;
      const shuffled = [...data.movies].sort(() => Math.random() - 0.5);

      groups.push({
        films: shuffled.slice(0, 4),
        connection: themeName,
        type: 'theme',
        difficultyScore,
      });
    }
  }

  return groups;
}

function analyzeProduction(movies: TMDBMovieDetails[]): PotentialGroup[] {
  const productionMap = new Map<number, { label: string; movies: TMDBMovieDetails[]; difficulty: number }>();

  for (const movie of movies) {
    const companies = (movie as any).production_companies || [];

    for (const company of companies) {
      const knownCompany = PRODUCTION_COMPANIES.find(pc => pc.id === company.id);
      if (knownCompany) {
        if (!productionMap.has(knownCompany.id)) {
          productionMap.set(knownCompany.id, {
            label: knownCompany.label,
            movies: [],
            difficulty: knownCompany.difficulty
          });
        }
        productionMap.get(knownCompany.id)!.movies.push(movie);
        break; // Only add to one production company
      }
    }
  }

  const groups: PotentialGroup[] = [];

  for (const [, data] of productionMap) {
    if (data.movies.length >= 4) {
      // Scale predefined difficulty (1-4) to match vote count scoring (higher = harder)
      const difficultyScore = data.difficulty * 2000;
      const shuffled = [...data.movies].sort(() => Math.random() - 0.5);

      groups.push({
        films: shuffled.slice(0, 4),
        connection: data.label,
        type: 'production',
        difficultyScore,
      });
    }
  }

  return groups;
}

function analyzeWordplay(movies: TMDBMovieDetails[]): PotentialGroup[] {
  const wordMap = new Map<string, TMDBMovieDetails[]>();

  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
    'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'be', 'part', 'movie',
  ]);

  for (const movie of movies) {
    const words = movie.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length >= 5 && !stopWords.has(word));

    for (const word of words) {
      if (!wordMap.has(word)) {
        wordMap.set(word, []);
      }
      wordMap.get(word)!.push(movie);
    }
  }

  const groups: PotentialGroup[] = [];

  for (const [word, wordMovies] of wordMap) {
    if (wordMovies.length >= 4 && wordMovies.length <= 6) { // More restrictive range
      // Calculate difficulty based on word length and frequency
      // Longer words and rarer occurrences = harder
      let baseDifficulty = 2; // Default medium
      if (word.length >= 8 && wordMovies.length === 4) baseDifficulty = 4; // Long rare words = hardest
      else if (word.length >= 7) baseDifficulty = 3; // Longer words = harder
      else if (wordMovies.length === 4) baseDifficulty = 3; // Rare words = harder

      // Scale to match vote count scoring
      const difficultyScore = baseDifficulty * 2000;
      const shuffled = [...wordMovies].sort(() => Math.random() - 0.5);

      groups.push({
        films: shuffled.slice(0, 4),
        connection: `"${word.charAt(0).toUpperCase() + word.slice(1)}" in the title`,
        type: 'wordplay',
        difficultyScore,
      });
    }
  }

  return groups;
}

interface GroupWithColor extends PotentialGroup {
  color: 'yellow' | 'green' | 'blue' | 'purple';
  difficulty: 'easy' | 'medium' | 'hard' | 'hardest';
}

function selectNonOverlappingGroups(
  allGroups: PotentialGroup[]
): GroupWithColor[] {
  if (allGroups.length < 4) {
    return []; // Not enough groups, will trigger retry
  }

  // Sort all groups by difficulty score (lower score = easier)
  const sorted = [...allGroups].sort((a, b) => a.difficultyScore - b.difficultyScore);

  // Divide into quartiles and assign colors
  const groupsWithColors: GroupWithColor[] = sorted.map((group, index) => {
    const quartile = Math.floor((index / sorted.length) * 4);

    let color: 'yellow' | 'green' | 'blue' | 'purple';
    let difficulty: 'easy' | 'medium' | 'hard' | 'hardest';

    if (quartile === 0) {
      color = 'yellow';
      difficulty = 'easy';
    } else if (quartile === 1) {
      color = 'green';
      difficulty = 'medium';
    } else if (quartile === 2) {
      color = 'blue';
      difficulty = 'hard';
    } else {
      color = 'purple';
      difficulty = 'hardest';
    }

    return { ...group, color, difficulty };
  });

  // Group by color
  const groupsByColor = new Map<string, GroupWithColor[]>();
  for (const group of groupsWithColors) {
    if (!groupsByColor.has(group.color)) {
      groupsByColor.set(group.color, []);
    }
    groupsByColor.get(group.color)!.push(group);
  }

  // Shuffle within each color for variety
  for (const [color, groups] of groupsByColor) {
    groupsByColor.set(color, groups.sort(() => Math.random() - 0.5));
  }

  // Select one non-overlapping group from each color
  const selected: GroupWithColor[] = [];
  const usedMovieIds = new Set<number>();
  const requiredColors = ['yellow', 'green', 'blue', 'purple'];

  for (const color of requiredColors) {
    const groupsOfColor = groupsByColor.get(color) || [];

    // Find first group of this color that doesn't overlap with selected films
    let foundForThisColor = false;
    for (const group of groupsOfColor) {
      const hasOverlap = group.films.some((film) => usedMovieIds.has(film.id));

      if (!hasOverlap) {
        selected.push(group);
        group.films.forEach((film) => usedMovieIds.add(film.id));
        foundForThisColor = true;
        break;
      }
    }

    // If we couldn't find a group for this color, return incomplete to trigger retry
    if (!foundForThisColor) {
      return selected;
    }
  }

  return selected;
}

export async function generateTestPuzzle(): Promise<{
  groups: Group[];
  films: Film[];
}> {
  // Simple test puzzle with one group of each color
  const groups: Group[] = [
    {
      id: 'test-yellow',
      films: [
        { id: 1, title: 'Yellow Film 1', year: 2020 },
        { id: 2, title: 'Yellow Film 2', year: 2021 },
        { id: 3, title: 'Yellow Film 3', year: 2022 },
        { id: 4, title: 'Yellow Film 4', year: 2023 },
      ],
      connection: 'Yellow Group (Easy)',
      difficulty: 'easy',
      color: 'yellow',
    },
    {
      id: 'test-green',
      films: [
        { id: 5, title: 'Green Film 1', year: 2020 },
        { id: 6, title: 'Green Film 2', year: 2021 },
        { id: 7, title: 'Green Film 3', year: 2022 },
        { id: 8, title: 'Green Film 4', year: 2023 },
      ],
      connection: 'Green Group (Medium)',
      difficulty: 'medium',
      color: 'green',
    },
    {
      id: 'test-blue',
      films: [
        { id: 9, title: 'Blue Film 1', year: 2020 },
        { id: 10, title: 'Blue Film 2', year: 2021 },
        { id: 11, title: 'Blue Film 3', year: 2022 },
        { id: 12, title: 'Blue Film 4', year: 2023 },
      ],
      connection: 'Blue Group (Hard)',
      difficulty: 'hard',
      color: 'blue',
    },
    {
      id: 'test-purple',
      films: [
        { id: 13, title: 'Purple Film 1', year: 2020 },
        { id: 14, title: 'Purple Film 2', year: 2021 },
        { id: 15, title: 'Purple Film 3', year: 2022 },
        { id: 16, title: 'Purple Film 4', year: 2023 },
      ],
      connection: 'Purple Group (Hardest)',
      difficulty: 'hardest',
      color: 'purple',
    },
  ];

  const films = groups.flatMap((group) => group.films);
  const shuffledFilms = shuffleArray(films);

  return {
    groups,
    films: shuffledFilms,
  };
}

export async function generatePuzzle(): Promise<{
  groups: Group[];
  films: Film[];
}> {
  // Get recently used content to avoid repetition
  const recentFilmIds = recentContentService.getRecentFilmIds();
  const recentConnections = recentContentService.getRecentConnections();

  // Fetch random pool of movies from different eras (150 total for better variety)
  const allMovies = await tmdbService.getRandomMoviePool(150);

  // Filter out recently used films to add variety
  const moviePool = allMovies.filter(movie => !recentFilmIds.has(movie.id));

  // If we filtered out too many, use all movies
  const finalPool = moviePool.length >= 100 ? moviePool : allMovies;

  // Analyze pool to find all potential groupings
  const directorGroups = analyzeDirectors(finalPool);
  const actorGroups = analyzeActors(finalPool);
  const franchiseGroups = analyzeFranchises(finalPool);
  const themeGroups = analyzeThemes(finalPool);
  const productionGroups = analyzeProduction(finalPool);
  const wordplayGroups = analyzeWordplay(finalPool);

  // Combine all potential groups and filter out recently used connections
  const allPotentialGroups = [
    ...directorGroups,
    ...actorGroups,
    ...franchiseGroups,
    ...themeGroups,
    ...productionGroups,
    ...wordplayGroups,
  ].filter(group => !recentConnections.has(group.connection));

  // Select 4 non-overlapping groups ensuring one of each color
  const selectedGroups = selectNonOverlappingGroups(allPotentialGroups);

  // If we couldn't find 4 non-overlapping groups, retry
  if (selectedGroups.length < 4) {
    console.warn(
      `Only found ${selectedGroups.length} groups, retrying puzzle generation...`
    );
    return generatePuzzle();
  }

  // Convert to Group format - color/difficulty assigned by quartile
  const groups: Group[] = selectedGroups.map((pg, index) => ({
    id: `${pg.type}-${index}`,
    films: pg.films.map(tmdbMovieToFilm),
    connection: pg.connection,
    difficulty: pg.difficulty, // Assigned by quartile
    color: pg.color, // Assigned by quartile
  }));

  // Flatten and shuffle all films
  const films = groups.flatMap((group) => group.films);
  const shuffledFilms = shuffleArray(films);

  return {
    groups,
    films: shuffledFilms,
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export { shuffleArray };
